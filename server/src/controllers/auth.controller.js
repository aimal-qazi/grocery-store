import pool from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email, password]
        )

        const user = result.rows[0]

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({token, user: {id: user.id, email: user.email}});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}