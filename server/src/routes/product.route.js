import express from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '.js';
import admin from '../middlewares/admin.middleware';
import { protect } from '../middlewares/auth.middleware';

const productRouter = express.Router();
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', admin, protect, createProduct);
productRouter.put('/:id', admin, protect, updateProduct);
productRouter.delete('/:id', admin, protect, deleteProduct);

export default productRouter;