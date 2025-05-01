const express = require("express");
const Cart = require("./models/Cart.js");

const router = express.Router();

// Get all cart items
router.get("/", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add an item to the cart
router.post("/add", async (req, res) => {
  try {
    const { name, file, price, quantity, description } = req.body;

    if (!name || !file || !price || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCartItem = new Cart({ name, file, price, quantity, description });
    await newCartItem.save();

    res.status(201).json({ message: "Item added to cart", item: newCartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Remove an item from the cart
router.delete("/remove/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update item quantity in the cart
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const updatedCartItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    res.json({ message: "Cart updated", item: updatedCartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
