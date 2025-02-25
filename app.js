import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { create } from 'express-handlebars';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import userRouter from './src/routes/user.router.js';
import sessionRouter from './src/routes/session.router.js';
import productsRouter from './src/routes/productsRouter.js';
import cartsRouter from './src/routes/cartsRouter.js';
import connectDB from './src/database.js';
import Product from './src/models/Product.js';
import passport from './src/middlewares/passport.config.js';
import viewRouter from './src/routes/view.router.js';

// Crea el valor de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 8080;

connectDB();

const server = http.createServer(app);
const io = new Server(server);

const hbs = create({
    extname: 'handlebars',
    defaultLayout: 'main',
    helpers: {
        eq: (a, b) => a === b,
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

// Cookies
app.use(cookieParser());

app.use(session({
    secret: '123ABC456DEF',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' ? true : false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',viewRouter);

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api', userRouter);



app.get('/login', (req, res) => {
    res.render('login');
});


app.post('/api/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

app.get('/realtimeproducts', (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    res.render('realTimeProducts', { limit, page, sort, query });
});

app.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error al cargar el detalle del producto:', error);
        res.status(500).send('Error al cargar el detalle del producto');
    }
});

app.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = query ? { category: query } : {};
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNum);

        const processedProducts = products.map(product => {
            return {
                ...product.toObject(),
                thumbnail: product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails[0] : ''
            };
        });

        res.render('index', {
            products: processedProducts,
            totalPages,
            prevPage: pageNum > 1 ? pageNum - 1 : null,
            nextPage: pageNum < totalPages ? pageNum + 1 : null,
            page: pageNum,
            limit: limitNum,
            sort,
            query,
            hasPrevPage: pageNum > 1,
            hasNextPage: pageNum < totalPages
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al cargar productos');
    }
});
//         res.render('index', {
//             products:products.map(product => product.toObject()),
//             totalPages,
//             prevPage: pageNum > 1 ? pageNum -1 : null,
//             nextPage: pageNum < totalPages ? pageNum + 1 : null,
//             page: pageNum,
//             limit: limitNum,
//             sort,
//             query,
//             hasPrevPage: pageNum > 1,
//             hasNextPage: pageNum < totalPages
//         });
//     } catch (error) {
//         console.error('Error al obtener productos:', error);
//         res.status(500).send('Error al cargar productos');
//     } // Aquí estaba el problema
// });

io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    try {
        const products = await Product.find();
        socket.emit('productList', products);
    } catch (error) {
        console.error('Error al obtener productos de MongoDB', error);
    }

    socket.on('newProduct', async (product) => {
        try {
            const newProduct = new Product(product);
            await newProduct.save();
            const products = await Product.find();
            io.emit('productList', products);
        } catch (error) {
            console.error('Error al agregar producto a MongoDB:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await Product.findByIdAndDelete(productId);
            const products = await Product.find();
            io.emit('productList', products);
        } catch (error) {
            console.error('Error al eliminar producto en MongoDB', error);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});