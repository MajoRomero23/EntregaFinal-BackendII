import jwt from 'jsonwebtoken';
import passport from 'passport';

export const postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });

        const token = jwt.sign({ sub: user._id, email: user.email, role: user.role }, 'coderSecret', { expiresIn: '24h' });
        res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
           .json({ message: 'Login correcto', user });
    })(req, res, next);
};

export const getCurrentSession = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No hay una sesión activa' });
    }

    res.json({ user: req.user });
};

export default {
    postLogin,
    getCurrentSession,
};