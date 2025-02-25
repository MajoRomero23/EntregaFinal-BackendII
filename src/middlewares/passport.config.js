import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcrypt';


passport.use(
    'local',
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) return done(null, false, { message: 'Usuario no encontrado' });

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return done(null, false, { message: 'Contraseña incorrecta' });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.jwt, 
    ]),
    secretOrKey: process.env.JWT_SECRET || 'coderSecret',
};

passport.use(
    'jwt',
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const user = await UserModel.findById(payload.id);
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

export default passport;