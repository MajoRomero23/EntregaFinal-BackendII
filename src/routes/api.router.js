import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Registro de usuario
router.post('/auth/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password || !age) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Correo inválido' });
    }

    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
        return res.status(400).json({ error: 'La edad debe ser un número válido mayor a 0' });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age: ageNumber,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Inicio de sesión
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
        });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Cierre de sesión
router.post('/auth/logout', (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

export default router;
