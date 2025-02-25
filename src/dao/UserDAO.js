import UserModel from '../models/user.model.js';

class UserDAO {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }
  
  async createUser(userData) {
    const newUser = new UserModel(userData);
    return newUser.save();
  }
  
  async findById(id) {
    return UserModel.findById(id);
  }
}

export default new UserDAO();
