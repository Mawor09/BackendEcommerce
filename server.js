const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products');
const viewsRouter = require('./routes/views');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB', err));

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '/public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

// Configurar socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('new-product', (product) => {
        io.emit('update-products', product);
    });

    socket.on('delete-product', (productId) => {
        io.emit('update-products', productId);
    });
});

// Levantar el servidor en el puerto 8080
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = io; // Exportar io para poder usarlo en otras partes del código
