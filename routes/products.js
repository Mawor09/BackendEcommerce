const express = require('express');
const fs = require('fs');
const router = express.Router();

const productsFilePath = './data/productos.json';

// Leer datos desde el archivo
const readProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
        fs.writeFileSync(productsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};

// Guardar datos en el archivo
const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Generar un nuevo ID
const generateId = () => {
    const products = readProducts();
    return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

// Ruta GET para listar todos los productos (con limitación opcional)
router.get('/', (req, res) => {
    const { limit } = req.query;
    const products = readProducts();
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// Ruta GET para obtener un producto por ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const product = products.find(p => p.id == pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

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
    res.status(201).json(newProduct);
});

// Ruta PUT para actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const products = readProducts();
    const productIndex = products.findIndex(p => p.id == pid);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const product = products[productIndex];
    products[productIndex] = {
        ...product,
        title: title || product.title,
        description: description || product.description,
        code: code || product.code,
        price: price !== undefined ? price : product.price,
        status: status !== undefined ? status : product.status,
        stock: stock !== undefined ? stock : product.stock,
        category: category || product.category,
        thumbnails: thumbnails || product.thumbnails
    };

    saveProducts(products);
    res.json(products[productIndex]);
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
    res.json({ message: 'Producto eliminado' });
});

module.exports = router;
