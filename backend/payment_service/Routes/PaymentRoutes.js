const express = require("express");
const router3 = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Create Checkout Session
router3.post("/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid or missing products array" });
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image], // optional: validate if image exists
        },
        unit_amount: Math.round(product.price * 100), // price in cents
      },
      quantity: product.qty || 1, // fallback if quantity is missing
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

module.exports = router3;
