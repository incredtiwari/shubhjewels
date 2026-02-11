const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Products & Orders Storage
const productsFile = path.join(__dirname, 'products.json');
const ordersFile = path.join(__dirname, 'orders.json');

// Sample Products
async function getProducts() {
    try {
        const data = await fs.readFile(productsFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return [
            {id:1, name:"Kundan Necklace", price:12500, image:"https://images.unsplash.com/photo-1608043152266-1451ab6f98fc?w=800", category:"necklaces"},
            {id:2, name:"Polki Bangles", price:8500, image:"https://images.unsplash.com/photo-1608666829543-1fa0469b6498?w=800", category:"bangles"},
            {id:3, name:"Temple Ring", price:3200, image:"https://images.unsplash.com/photo-1583482354228-1b7a6e0e7f84?w=800", category:"rings"}
        ];
    }
}

// API Routes
app.get('/api/products', async (req, res) => {
    res.json(await getProducts());
});

app.get('/api/products/:category', async (req, res) => {
    const products = await getProducts();
    res.json(products.filter(p => p.category === req.params.category));
});

// ✅ NEW: ORDER PLACING
app.post('/api/orders', async (req, res) => {
    try {
        const order = {
            id: Date.now(),
            customerName: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            items: req.body.items,
            total: req.body.total,
            status: "Pending",
            date: new Date().toISOString()
        };
        
        const orders = [];
        try {
            const data = await fs.readFile(ordersFile, 'utf8');
            orders.push(...JSON.parse(data));
        } catch {}
        
        orders.push(order);
        await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
        
        res.json({success: true, orderId: order.id});
    } catch {
        res.status(500).json({error: "Order failed"});
    }
});

// ✅ NEW: ADMIN - Get Orders
app.get('/api/admin/orders', async (req, res) => {
    try {
        const data = await fs.readFile(ordersFile, 'utf8');
        res.json(JSON.parse(data));
    } catch {
        res.json([]);
    }
});

app.listen(3000, () => {
    console.log('🚀 FULLSTACK ECOMMERCE LIVE: http://localhost:3000');
});
