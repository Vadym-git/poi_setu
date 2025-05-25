import Bell from '@hapi/bell';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import dotenv from 'dotenv';

// Завантаження змінних середовища
dotenv.config();

const setupGoogleAuth = async (server) => {
  try {
    await server.register(Bell);
  } catch (err) {
    if (!err.message.includes('already registered')) {
      throw err;
    }
  }

  // Реєстрація стратегії авторизації Google через Bell
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: process.env.GOOGLE_AUTH_PASSWORD,
    isSecure: false, // ❗ в production змінити на true
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    location: process.env.BACKEND_URL,
  });

  server.route({
    method: 'GET',
    path: '/auth/google',
    options: {
      auth: 'google',
      cors: {
        origin: [process.env.GOOGLE_REDIRECT],
        credentials: true,
      },
    },
    handler: async (request, h) => {
      if (!request.auth.isAuthenticated) {
        return h.response({ message: 'Authentication failed' }).code(401);
      }

      const profile = request.auth.credentials.profile;
      let user = await User.findOne({ email: profile.email });

      if (!user) {
        user = new User({
          email: profile.email,
          name: profile.displayName,
          password: '', // OAuth user → no password
        });
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return h
        .response('Redirecting...')
        .state('auth_token', token, {
          httpOnly: true,
          sameSite: 'Lax',
          path: '/',
        })
        .redirect(process.env.GOOGLE_REDIRECT);
    },
  });
};

export default setupGoogleAuth;
