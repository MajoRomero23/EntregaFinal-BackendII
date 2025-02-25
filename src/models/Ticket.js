import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }], // Productos comprados y cantidades
    totalAmount: { type: Number, required: true, min: 0 }, // Monto total de la compra
    purchaseDate: { type: Date, default: Date.now } // Fecha de compra
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
