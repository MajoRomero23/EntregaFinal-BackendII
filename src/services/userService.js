import UserRepository from '../repositories/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';
import bcrypt from 'bcrypt';
import { sendEmail } from './mailService.js'; 

class UserService {
  async registerUser(userData) {
    const { email, password, first_name, last_name, ...rest } = userData;

    // Verificando si el usuario ya está registrado
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("El usuario ya está registrado");
    }

    // Hasheando la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      ...rest
    });

    // Convirtiendo usuario a DTO
    const userDTO = new UserDTO(newUser);

    // Enviando correo de confirmación
    try {
      await sendEmail({
        to: email,
        subject: "¡Bienvenido a nuestra florería! 🌸",
        template: "confirmation",
        context: { name: first_name }
      });
    } catch (error) {
      console.error("Error al enviar el correo de confirmación:", error);
    }

    return userDTO;
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) return null;
    return new UserDTO(user);
  }

  // Autenticando usuario
  async authenticateUser(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return new UserDTO(user);
  }
}

export default new UserService();
