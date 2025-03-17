const jwt = require('jsonwebtoken');

module.exports = (request, h) => {
    try {
        const token = request.state.auth_token; // Getting cookie
        if (!token) {
            return h.response({ message: 'Unauthorized' }).code(401).takeover();
        }

        // Decoding JWT
        const decoded = jwt.verify(token, 'your_jwt_secret');
        request.user = decoded; // Add user to request
        return h.continue;
    } catch (err) {
        return h.response({ message: 'Invalid token' }).code(401).takeover();
    }
};
