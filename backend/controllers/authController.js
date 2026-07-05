import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promisePool } from '../config/db.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const verifyCaptcha = async (token) => {
    if (!token) return false;
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        );
        return response.data.success;
    } catch (error) {
        return false;
    }
};

export const signupUser = async (req, res) => {
    try {
        const { name, email, password, phone, captchaToken } = req.body;

        if (!name || !email || !password || !phone || !captchaToken) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({ message: 'Invalid Captcha verification' });
        }

        // Check for existing users aggressively ignoring verified constraints since OTP is disabled
        const [users] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const connection = await promisePool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO users (name, email, password, phone, is_verified) VALUES (?, ?, ?, ?, true)',
                [name, email, hashedPassword, phone]
            );
            const userId = result.insertId;

            // Profiles inserted natively without an image initially mapping to our Dashboard forms logic instead
            await connection.query(
                'INSERT INTO profiles (user_id, image) VALUES (?, NULL)',
                [userId]
            );

            await connection.commit();
            res.status(201).json({
                _id: userId,
                name,
                email,
                token: generateToken(userId)
            });
        } catch (txnError) {
            await connection.rollback();
            throw txnError;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        if (!email || !password || !captchaToken) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const isCaptchaValid = await verifyCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return res.status(400).json({ message: 'Invalid Captcha verification' });
        }

        const [users] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
