require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        'https://gullystraycare.org',
        'https://www.gullystraycare.org',
        'https://stray-care.vercel.app', // Fallback for Vercel subdomain
        'http://localhost:5173', // Local development
        'http://localhost:5174' // Local development fallback port
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/payment/orders', async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto capture
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send('Error creating order');
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
});

app.post('/api/payment/subscription', async (req, res) => {
    try {
        const { amount } = req.body;

        // 1. Create a Plan (or you could fetch an existing one if you stored them)
        // For simplicity, we create a new plan for every unique amount request
        // In production, you should cache these plan_ids
        const planResponse = await razorpay.plans.create({
            period: "monthly",
            interval: 1,
            item: {
                name: `Monthly Donation - ₹${amount}`,
                amount: amount * 100,
                currency: "INR",
                description: "Monthly donation to GullyStray Care"
            }
        });

        // 2. Create a Subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: planResponse.id,
            total_count: 120, // 10 years
            quantity: 1,
            customer_notify: 1,
        });

        res.json({
            subscription_id: subscription.id,
            plan_id: planResponse.id
        });

    } catch (error) {
        console.error('Subscription Error:', error);
        res.status(500).json({ message: 'Error creating subscription', error: error.message });
    }
});

app.post('/api/payment/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid signature sent!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying payment');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
