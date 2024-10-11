const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Modelo de Producto

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Filtro por categoría o disponibilidad
        let filter = {};
        if (query) {
            if (query === 'category') {
                filter = { category: req.query.category };
            } else if (query === 'status') {
                filter = { status: req.query.status === 'true' };
            }
        }

        // Configuración de opciones de paginación
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const products = await Product.paginate(filter, options);

        // Creando el objeto de respuesta
        const response = {
            status: "success",
            payload: products.docs, // resultados de productos
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}` : null
        };

        res.json(response);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
