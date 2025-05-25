import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { User } from '../models/user.js';

const userAuthRoutes = (server) => {

    const basePath = "/auth"; // Base path for authentication

    // Joi schema for user signup
    const signupSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    // Joi schema for user login
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    // Login route
    server.route({
        method: 'POST',
        path: `${basePath}/login`,
        options: {
            cors: {
              origin: ['http://localhost:5173'],
              credentials: true,
          }},
        handler: async (request, h) => {
            try {
                // Validate input
                const { error } = loginSchema.validate(request.payload);
                if (error) {
                    return h.response({ message: error.details[0].message }).code(400);
                }

                const { email, password } = request.payload;

                // Find user by email
                const user = await User.findOne({ email });
                if (!user) {
                    return h.response({ message: 'Invalid credentials' }).code(400);
                }

                // Check password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return h.response({ message: 'Invalid credentials' }).code(400);
                }

                // Generate JWT
                const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

                // Set HTTP-only cookie
                return h.response({ message: 'Login successful' })
                    .state('auth_token', token, {
                        httpOnly: true,   // JS doesn't have access to a cookie
                        secure: false,    // ❗ Change to true in production (HTTPS)
                        sameSite: 'Lax',  // CSRF protection
                        path: '/'         // Cookie allows for all the routes
                    })
                    .code(200);
            } catch (err) {
                console.error(err);
                return h.response({ message: 'Error logging in user' }).code(500);
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/auth/logout',
		        options: {
            cors: {
              origin: ['http://localhost:5173'],
              credentials: true,
          }},
        handler: (request, h) => {
            return h.response({ message: 'Logged out successfully' })
                .unstate('auth_token', { path: '/' })
                .code(200);
        }
    });


    // Route for user signup (POST)
    server.route({
        method: 'POST',
        path: `${basePath}/signup`,
        options: {
            cors: {
              origin: ['http://localhost:5173'],
              credentials: true,
          }},
        handler: async (request, h) => {
            try {
                // Validate data using Joi
                const { error } = signupSchema.validate(request.payload);
                if (error) {
                    return h.response({ message: error.details[0].message }).code(400);
                }

                const { email, password } = request.payload;
                // Check if user already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return h.response({ message: 'User already exists' }).code(400);
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a new user
                const newUser = new User({ email, password: hashedPassword });
                await newUser.save();

                // Return a successful response
                return h.response({ message: 'User created successfully' }).code(201);
            } catch (err) {
                console.error(err); // Log the error for debugging
                return h.response({ message: 'Error creating user' }).code(500);
            }
        }
    });

    server.route({
  method: 'GET',
  path: `${basePath}/me`,
  options: {
    cors: {
      origin: ['http://localhost:5173'],
      credentials: true,
  }},
  handler: async (request, h) => {
    try {
      const token = request.state.auth_token;

      if (!token) {
        return h.response({ isAuthenticated: false }).code(401);
      }

      const payload = jwt.verify(token, 'your_jwt_secret');
      const user = await User.findById(payload.userId).select('-password');

      if (!user) {
        return h.response({ isAuthenticated: false }).code(401);
      }

      return h.response({ isAuthenticated: true, user }).code(200);
    } catch (err) {
      return h.response({ isAuthenticated: false }).code(401);
    }
  }
});

};

export default userAuthRoutes;
