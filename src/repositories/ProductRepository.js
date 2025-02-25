import ProductModel from '../models/product.model.js';

class ProductRepository {
  async findById(id) {
    return await ProductModel.findById(id);
  }

  async updateStock(productId, quantity) {
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error('Producto no encontrado');
    
    product.stock -= quantity;
    await product.save();
    return product;
  }
}

export default new ProductRepository();
