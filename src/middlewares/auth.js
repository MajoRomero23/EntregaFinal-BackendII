import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Verificar el token JWT
export const verifyToken = (req, res, next) => {
    const token = req.cookies?.jwt; 

    if (!token) {
        return res.status(401).json({ error: 'No autorizado, token no encontrado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verificando token:', error);
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

// Verificar si el usuario está logueado
export const isLoggedIn = (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ error: 'No autorizado, necesitas iniciar sesión' });
    }

    next();
};

// Verificar si el usuario NO está logueado
export const isLoggedOut = (req, res, next) => {
    const token = req.cookies?.jwt;

    if (token) {
        return res.status(403).json({ error: 'Acceso denegado, ya has iniciado sesión' });
    }

    next();
};
