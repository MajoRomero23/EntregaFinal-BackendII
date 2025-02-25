
import Joi from 'joi';

// Esquema de validación para el registro de usuario
export const userRegistrationSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre debe tener máximo 50 caracteres'
  }),
  last_name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'El apellido es obligatorio',
    'string.min': 'El apellido debe tener al menos 2 caracteres',
    'string.max': 'El apellido debe tener máximo 50 caracteres'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Debe ser un email válido',
    'string.empty': 'El email es obligatorio'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'string.empty': 'La contraseña es obligatoria'
  }),
  age: Joi.number().integer().min(18).required().messages({
    'number.base': 'La edad debe ser un número',
    'number.min': 'Debes ser mayor de 18 años'
  })
});

// Middleware para validar el registro de usuario
export const validateUserRegistration = (req, res, next) => {
  const { error } = userRegistrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
