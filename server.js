const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample Products Data
const productsFile = path.join(__dirname, 'products.json');

// API Routes
app.get('/api/products', async (req, res) => {
    try {
        const data = await fs.readFile(productsFile, 'utf8');
        const products = JSON.parse(data);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/products/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const data = await fs.readFile(productsFile, 'utf8');
        const products = JSON.parse(data);
        const filtered = products.filter(p => p.category === category);
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Cart API (Simple JSON storage)
app.post('/api/cart/add', async (req, res) => {
    try {
        const cartItem = req.body;
        // In production: Save to database
        res.json({ success: true, cartItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to cart' });
    }
});

app.get('/api/cart', (req, res) => {
    // Simulate cart data
    res.json([]);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
});
