import express from 'express';
import { isLoggedIn, isLoggedOut } from '../middlewares/auth.js';
import { generateToken } from '../utils/jwtUtils.js';
import userService from '../services/userService.js';
import { validateUserRegistration } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Ruta para registrar usuarios
router.post('/register', isLoggedOut, validateUserRegistration, async (req, res) => {
  try {    
    const userDTO = await userService.registerUser(req.body);
    
    const token = generateToken(userDTO);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(201).json({ message: 'Usuario registrado con éxito', token, user: userDTO });

  } catch (error) {
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Ruta para obtener perfil
router.get('/perfil', isLoggedIn, async (req, res) => {
  try {
    const userDTO = await userService.getUserById(req.user.id);
    if (!userDTO) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.render('perfil', { user: userDTO });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para cerrar sesión
router.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/login');
  });
});

// Ruta de Login
router.post('/login', isLoggedOut, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔑 Intento de login con email: ${email}`);

    const userDTO = await userService.authenticateUser(email, password);

    if (!userDTO) {
      console.log(" Usuario o contraseña incorrectos");
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    console.log(`Usuario autenticado: ${userDTO.email}`);
    const token = generateToken(userDTO);

    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({ message: "Login exitoso", token, user: userDTO });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
