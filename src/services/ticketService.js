import Ticket from '../models/Ticket.js';
import crypto from 'crypto';

class TicketService {
    async createTicket(userId, products, totalAmount) {
        try {
            const ticket = new Ticket({
                code: crypto.randomUUID(),
                user: userId,
                products,
                totalAmount
            });

            await ticket.save();
            return ticket;
        } catch (error) {
            console.error(" Error al crear el ticket:", error);
            throw new Error("No se pudo generar el ticket.");
        }
    }
}

export default new TicketService();
