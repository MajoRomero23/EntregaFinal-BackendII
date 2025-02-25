import express from 'express';
import { 
    getProducts, 
    getProductsById, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    generateTestProducts, 
    deleteAllProducts 
} from '../controllers/productsController.js';
import { authorization } from '../middlewares/authorization.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProductsById);
// Sólo administrador puede crear, actualizar y eliminar productos:
router.post('/', authorization('admin'), addProduct);
router.put('/:pid', authorization('admin'), updateProduct);
router.delete('/:pid', authorization('admin'), deleteProduct);
router.post('/generate', authorization('admin'), generateTestProducts);
router.delete('/deleteAll', authorization('admin'), deleteAllProducts);

export default router;
