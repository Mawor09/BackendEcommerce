const express = require('express');
const { readProducts } = require('../utils/fileManager'); // Función para leer productos
const router = express.Router();

// Ruta para la vista home
router.get('/', async (req, res) => {
    const products = readProducts();
    res.render('home', { products });
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = readProducts();
    res.render('realTimeProducts', { products });
});

module.exports = router;
