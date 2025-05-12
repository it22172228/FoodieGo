const express = require("express");
const router3 = express.Router();
<<<<<<< Updated upstream
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
=======
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
>>>>>>> Stashed changes

// Create Checkout Session
router3.post("/create-checkout-session", async (req, res) => {
  try {
<<<<<<< Updated upstream
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
=======
    const { items,deliveryFee } = req.body;

    if (!items || !Array.isArray(items)) {
>>>>>>> Stashed changes
      return res.status(400).json({ error: "Invalid or missing products array" });
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
<<<<<<< Updated upstream
          name: product.name,
          images: [product.image], // optional: validate if image exists
        },
        unit_amount: Math.round(product.price * 100), // price in cents
      },
      quantity: product.qty || 1, // fallback if quantity is missing
=======
          name: item.name,
          images: [item.image], // optional: validate if image exists
        },
        unit_amount: Math.round(item.price * 100), // price in cents
      },
      quantity: item.quantity || 1, // fallback if quantity is missing
>>>>>>> Stashed changes
    }));


    // Add delivery fee as a separate line item
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "lkr",
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: deliveryFee * 100, // Convert to cents
        },
        quantity: 1,
      });
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
<<<<<<< Updated upstream
      success_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancel",
=======
      success_url: "http://localhost:8080/payment-success",
      cancel_url: "http://localhost:8080/payment-cancel",
>>>>>>> Stashed changes
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

module.exports = router3;
