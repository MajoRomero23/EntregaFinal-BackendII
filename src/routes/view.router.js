import { Router } from 'express';
import { __dirname, passportCall, authorization } from '../utils/utils.js';
import path from 'path';

const router = Router();

router.get('/register', (req, res) => {
    res.render('register'); 
});

router.get('/login', (req, res) => {
    res.render('login'); 
});

router.get('/', (req, res) => {
    if (req.user) {
        res.send(`<h1>Bienvenido, ${req.user.name}!</h1>`);
    } else {
        res.redirect('/login');
    }
});

router.get('/current', passportCall('jwt'), authorization("user"), (req, res) => {
    res.send({ status: 'success', payload: req.user });
});

router.get('/admin', passportCall('jwt'), authorization("admin"), (req, res) => {
    res.send({ status: 'success', payload: req.user });
});

export default router;
