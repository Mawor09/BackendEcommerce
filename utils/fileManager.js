const fs = require('fs');
const productsFilePath = './data/productos.json';

const readProducts = () => {
    // Verificar si el archivo existe
    if (!fs.existsSync(productsFilePath)) {
        fs.writeFileSync(productsFilePath, JSON.stringify([]));
    }
    
    // Leer el contenido del archivo
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    
    // Si el archivo está vacío, retornar un array vacío
    if (data.trim() === '') {
        return [];
    }
    
    // Intentar parsear el archivo JSON
    try {
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al parsear el archivo productos.json:', err);
        return [];
    }
};

const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

const generateId = () => {
    const products = readProducts();
    return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

module.exports = { readProducts, saveProducts, generateId };

