import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from '../middlewares/passport.config.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Usando Passport
export const passportCall = (strategy, options = {}) => {
    return (req, res, next) => {
        passport.authenticate(strategy, options, (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ error: 'Not authenticated' });
            req.user = user;
            next();
        })(req, res, next);
    };
};

// Middleware de autorización 
export const authorization = (role) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
        next();
    };
};
