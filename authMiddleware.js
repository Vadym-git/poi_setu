import jwt from 'jsonwebtoken';

const authMiddleware = (request, h) => {
    try {
        const token = request.state.auth_token; // Отримання токена з cookie
        if (!token) {
            return h.response({ message: 'Unauthorized' }).code(401).takeover();
        }

        // Декодування JWT
        const decoded = jwt.verify(token, 'your_jwt_secret');
        request.user = decoded; // Додаємо user до request
        return h.continue;
    } catch (err) {
        return h.response({ message: 'Invalid token' }).code(401).takeover();
    }
};

export default authMiddleware;
