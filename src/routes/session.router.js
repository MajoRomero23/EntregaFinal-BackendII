import express from 'express';
import passport from '../middlewares/passport.config.js';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/UserDTO.js';
import { sendEmail } from '../services/mailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Ruta para registrar usuarios -- /api/sessions/register
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;

        if (!first_name || !last_name || !email || !password || !age) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya está registrado' });
        }

        // Normaliza y recorta la contraseña antes de hashearla
        const normalizedPassword = password.trim().normalize("NFC");

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

        // Crear y guardar el usuario en la base de datos
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            age,
        });

        // Generando token JWT
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

        // Guardando el token en una cookie
        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Enviando correo de bienvenida
        await sendEmail({
            to: email,
            subject: "¡Bienvenido a nuestra florería! 🌸",
            template: "confirmation",
            context: { name: first_name }
        });

        res.status(201).json({ message: 'Usuario registrado con éxito', token });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para iniciar sesión -> /api/sessions/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        a
        const user = await UserModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
        }

        const normalizedPassword = password.trim().normalize("NFC");

        // Comparando contraseñas
        const isMatch = await bcrypt.compare(normalizedPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
        console.error(" Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para obtener el usuario actual -- /api/sessions/current
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ user: new UserDTO(user) });
    } catch (error) {
        console.error(" Error al obtener usuario actual:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para cerrar sesión -- /api/sessions/logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

export default router;
