const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Регулярний вираз для імейла
    },
    name: { type: String, required: false },
    secondName: { type: String, required: false },
    password: {type: String, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
