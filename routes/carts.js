const express = require('express');
const fs = require('fs');
const router = express.Router();

const cartsFilePath = './data/carritos.json';
const productsFilePath = './data/productos.json';

// Leer datos desde el archivo
const readCarts = () => {
    if (!fs.existsSync(cartsFilePath)) {
        fs.writeFileSync(cartsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
};

// Guardar datos en el archivo
const saveCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Generar un nuevo ID
const generateId = () => {
    const carts = readCarts();
    return carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1;
};

// Ruta POST para crear un nuevo carrito
router.post('/', (req, res) => {
    const newCart = {
        id: generateId(),
        products: []
    };

    const carts = readCarts();
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});

// Ruta GET para obtener los productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();
    const cart = carts.find(c => c.id == cid);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});

// Ruta POST para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCarts();
    const cartIndex = carts.findIndex(c => c.id == cid);

    if (cartIndex === -1) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const products = readProducts();
    const product = products.find(p => p.id == pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product == pid);

    if (productIndex === -1) {
        // Producto no está en el carrito, agregarlo
        cart.products.push({ product: pid, quantity: 1 });
    } else {
        // Producto ya está en el carrito, incrementar cantidad
        cart.products[productIndex].quantity++;
    }

    saveCarts(carts);
    res.json(cart);
});

module.exports = router;
