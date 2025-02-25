import Cart from '../models/cart.js';

class CartService {
  // Obteniendo carrito por ID
  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  // Procesando la compra: verifica stock, actualiza stock y calcula total
  async processCartPurchase(cartId) {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    let totalAmount = 0;
    const purchasedProducts = [];
    const failedProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      if (!product) continue;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        purchasedProducts.push({ product: product._id, quantity: item.quantity });
        totalAmount += product.price * item.quantity;
      } else {
        failedProducts.push(product._id);
      }
    }

    return { purchasedProducts, failedProducts, totalAmount };
  }

  async updateCartAfterPurchase(cartId, failedProducts) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');
    cart.products = cart.products.filter(item => 
      failedProducts.includes(String(item.product))
    );
    await cart.save();
    return cart;
  }
}

export default new CartService();
