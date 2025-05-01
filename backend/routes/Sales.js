import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

router.get('/order', async (req, res) => { // This should be /order, not just /
  try {
    const orders = await Order.find();
    const salesSummary = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const accessoryId = item.accessoryId.toString();
        if (!salesSummary[accessoryId]) {
          salesSummary[accessoryId] = {
            name: item.name,
            totalQuantity: 0,
            totalRevenue: 0,
          };
        }
        salesSummary[accessoryId].totalQuantity += item.quantity;
        salesSummary[accessoryId].totalRevenue += item.quantity * item.price;
      });
    });

    const salesArray = Object.entries(salesSummary).map(([id, data]) => ({
      accessoryId: id,
      ...data,
    }));

    res.json(salesArray);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Error fetching sales data' });
  }
});

export default router;