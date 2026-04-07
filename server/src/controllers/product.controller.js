import pool from '../db/db.js';
import uploadToCloudinary from '../utils/upload.js';
import fs from 'fs';

export const getProducts = async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM products');
        res.json(products.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        let imageUrl = null;

        if (req.file) {
            const cloudData = await uploadToCloudinary(req.file.path, 'products');
            imageUrl = cloudData.url;
            fs.unlinkSync(req.file.path); // Remove the file from local storage after upload
        }

        const newProduct = await pool.query(
            'INSERT INTO products (name, description, price, stock, iamage_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, price, stock, imageUrl]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;
        let imageUrl = null;

        if (req.file) {
            const cloudData = await uploadToCloudinary(req.file.path, 'products');
            imageUrl = cloudData.url;
            fs.unlinkSync(req.file.path); // Remove the file from local storage after upload
        }

        const updatedProduct = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5 WHERE id = $6 RETURNING *',
            [name, description, price, stock, imageUrl, id]
        );
        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (deletedProduct.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}