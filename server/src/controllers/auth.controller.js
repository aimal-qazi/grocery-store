import pool from '../db/db.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
        console.log('Register payload:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const userExist = await pool.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        )

        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'User already exist' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        )

        return res.status(201).json({
            message: 'User Created',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}