const express = require("express");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, userId, restaurantId, phone } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid or missing items array" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "lkr",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert LKR to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/cart?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId,
        restaurantId,
        phone: phone || '+94760000000', // Fallback to sample number
        items: JSON.stringify(items.map(item => ({
          id: item.id,
          quantity: item.quantity
        })))
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ 
      error: error.message || "Checkout session creation failed",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// Stripe Webhook Handler
router.post("/webhook", express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    try {
      // Send SMS notification
      await twilio.messages.create({
        body: `Payment of LKR ${(session.amount_total / 100).toFixed(2)} confirmed!\nThank you for your order at ${session.metadata.restaurantId}.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: session.metadata.phone
      });

      // Here you would typically:
      // 1. Save order to database
      // 2. Clear user's cart
      // 3. Update order status

    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
    }
  }

  res.json({ received: true });
});

module.exports = router;
