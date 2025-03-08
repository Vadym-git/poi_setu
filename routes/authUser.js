const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user'); // User model

const basePath = "/auth"; // Base path for authentication

module.exports = (server) => {
    // Joi schema for user signup
    const signupSchema = Joi.object({
        login: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    // Joi schema for user login
    const loginSchema = Joi.object({
        login: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    // Route for user signup (POST)
    server.route({
        method: 'POST',
        path: `${basePath}/signup`,
        handler: async (request, h) => {
            try {
                // Validate data using Joi
                const { error } = signupSchema.validate(request.payload);
                if (error) {
                    return h.response({ message: error.details[0].message }).code(400);
                }

                const { login, password } = request.payload;

                // Check if user already exists
                const existingUser = await User.findOne({ login });
                if (existingUser) {
                    return h.response({ message: 'User already exists' }).code(400);
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a new user
                const newUser = new User({ login, password: hashedPassword });
                await newUser.save();

                // Return a successful response
                return h.response({ message: 'User created successfully' }).code(201);
            } catch (err) {
                console.error(err); // Log the error for debugging
                return h.response({ message: 'Error creating user' }).code(500);
            }
        }
    });

    // Route for user login (POST)
    server.route({
        method: 'POST',
        path: `${basePath}/login`,
        handler: async (request, h) => {
            try {
                // Validate data using Joi
                const { error } = loginSchema.validate(request.payload);
                if (error) {
                    return h.response({ message: error.details[0].message }).code(400);
                }

                const { name, password } = request.payload;

                // Find the user by name
                const user = await User.findOne({ name });
                if (!user) {
                    return h.response({ message: 'Invalid credentials' }).code(400);
                }

                // Check the password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return h.response({ message: 'Invalid credentials' }).code(400);
                }

                // Generate JWT token
                const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

                // Return the token to the user
                return h.response({ token }).code(200);
            } catch (err) {
                return h.response({ message: 'Error logging in user' }).code(500);
            }
        }
    });
};
