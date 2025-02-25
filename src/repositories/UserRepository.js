import UserDAO from '../dao/UserDAO.js';

class UserRepository {
  async findByEmail(email) {
    return await UserDAO.findByEmail(email);
  }

  async createUser(userData) {
    return await UserDAO.createUser(userData);
  }

  async findById(id) {
    return await UserDAO.findById(id);
  }

}

export default new UserRepository();
