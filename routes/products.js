const express = require('express');
const fs = require('fs');
const io = require('../server'); // Importamos la instancia de Socket.io

const router = express.Router();
const productsFilePath = './data/productos.json';
const { readProducts, saveProducts, generateId } = require('../utils/fileManager'); // Utilidades para manejar archivos

// Ruta POST para agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
    }

    const newProduct = {
        id: generateId(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    const products = readProducts();
    products.push(newProduct);
    saveProducts(products);

    io.emit('new-product', newProduct); // Emitir nuevo producto vía websockets

    res.status(201).json(newProduct);
});

// Ruta DELETE para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    let products = readProducts();
    const productIndex = products.findIndex(p => p.id == pid);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    products = products.filter(p => p.id != pid);
    saveProducts(products);

    io.emit('delete-product', pid); // Emitir evento de producto eliminado vía websockets

    res.json({ message: 'Producto eliminado' });
});

module.exports = router;
