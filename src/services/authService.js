import express from 'express';
import { isLoggedOut } from '../middlewares/auth.js';
import { generateToken } from '../utils/jwtUtils.js'; 
import { authenticateUser } from '../services/userService.js'; 

const router = express.Router();

router.post('/login', isLoggedOut, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password); 

        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const token = generateToken(user); 

        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor, inténtalo de nuevo más tarde.' });
    }
});

export default router;
