import ProductRepository from '../repositories/UserRepository.js';

class ProductService {
    async getProductById(id) {
        return await ProductRepository.findById(id);
    }

    async updateStock(productId, quantity) {
        const product = await ProductRepository.findById(productId);
        if (!product) throw new Error('Producto no encontrado');
        
        product.stock -= quantity;
        await product.save();
        return product;
    }
}

export default new ProductService();
