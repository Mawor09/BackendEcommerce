const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); // Modelo de Carrito
const Product = require('../models/product'); // Modelo de Producto

// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        cart.products = cart.products.filter(product => product.product.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Actualizar carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
        res.json({ status: 'success', cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findById(cid);
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        }
        await cart.save();
        res.json({ status: 'success', cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Traer los productos del carrito usando populate
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.product');
        res.json({ status: 'success', cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
