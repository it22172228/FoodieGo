const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

// Admin Service
app.use('/Admin', createProxyMiddleware({
    target: 'http://localhost:5100',
    pathRewrite: {
        '^/Admin': ''
    }
}));

// Delivery Service
app.use('/Delivery', createProxyMiddleware({
    target: 'http://localhost:5200',
    pathRewrite: {
        '^/Delivery': ''
    }
}));

// Notification Service
app.use('/Notification', createProxyMiddleware({
    target: 'http://localhost:5300',
    pathRewrite: {
        '^/Notification': ''
    }
}));

// Payment Service
app.use('/Payment', createProxyMiddleware({
    target: 'http://localhost:5400',
    pathRewrite: {
        '^/Payment': ''
    }
}));

// Restaurant Service
app.use('/Restaurant', createProxyMiddleware({
    target: 'http://localhost:5500',
    pathRewrite: {
        '^/Restaurant': ''
    }
}));

// User Service
app.use('/User', createProxyMiddleware({
    target: 'http://localhost:5600',
    pathRewrite: {
        '^/User': ''
    }
}));

app.listen(PORT, () => {
    console.log(`Gateway service running on ${PORT}`);
});