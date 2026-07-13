const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const findUserByEmail = async (email) => {
    if (!isDatabaseReady()) {
        throw new Error('Database connection is not ready');
    }

    return await User.findOne({ email: String(email).toLowerCase() });
};

// Helper to generate JWT
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const normalizedEmail = String(email || '').toLowerCase();

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!isDatabaseReady()) {
            return res.status(503).json({ message: 'Database is unavailable. Please try again shortly.' });
        }

        // Check if user exists
        const userExists = await findUserByEmail(normalizedEmail);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: role || 'patient'
        });

        if (user) {
            return res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }

        return res.status(400).json({ message: 'Invalid user data provided' });
    } catch (error) {
        const statusCode = error.message?.includes('Database connection') ? 503 : 500;
        res.status(statusCode).json({ message: statusCode === 503 ? 'Database is unavailable. Please try again shortly.' : 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').toLowerCase();

        if (!isDatabaseReady()) {
            return res.status(503).json({ message: 'Database is unavailable. Please try again shortly.' });
        }

        // Check for user email
        const user = await findUserByEmail(normalizedEmail);

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isActive) {
                return res.status(401).json({ message: 'Account is deactivated. Please contact support.' });
            }

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }

        return res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        const statusCode = error.message?.includes('Database connection') ? 503 : 500;
        res.status(statusCode).json({ message: statusCode === 503 ? 'Database is unavailable. Please try again shortly.' : 'Server error', error: error.message });
    }
};

const getDoctors = async (req, res) => {
    try {
        if (!isDatabaseReady()) {
            return res.status(503).json({ message: 'Database is unavailable. Please try again shortly.' });
        }

        const doctors = await User.find({ role: 'doctor', isActive: true }).select('name email role');
        return res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getDoctors
};
