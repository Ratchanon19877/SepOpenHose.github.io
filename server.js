const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// ตั้งค่า Express
const app = express();
app.use(bodyParser.json());

// เชื่อมต่อกับ MongoDB
mongoose.connect('mongodb://localhost:27017/foodOrderDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Failed to connect to MongoDB", err));

// สร้าง Schema และ Model สำหรับ Order
const orderSchema = new mongoose.Schema({
    items: [String],
    total: Number,
    completed: { type: Boolean, default: false },
});

const Order = mongoose.model('Order', orderSchema);

// API สำหรับดึงข้อมูลออเดอร์ทั้งหมด
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API สำหรับอัพเดตสถานะออเดอร์
app.put('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.completed = true;
            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
