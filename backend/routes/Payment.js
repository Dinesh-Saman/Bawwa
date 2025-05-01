import express from "express";
import Order from "../models/Order.js"; // Import Order model

const router = express.Router();

router.post('/process-payment', async (req, res) => {
  const { cardNumber, expirationDate, cvv, totalAmount, items } = req.body;

  // Basic validation
  if (!totalAmount || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Invalid request data: items and totalAmount are required' });
  }

  try {
    // Save order details with cart items
    const newOrder = new Order({
      items: items.map(item => ({
        accessoryId: item._id, // Assuming cart items have _id
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      transactionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Simple transaction ID
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order saved successfully', order: savedOrder });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(400).json({ message: 'Payment processing failed' });
  }
});

export default router;