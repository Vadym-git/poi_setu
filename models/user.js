import mongoose from 'mongoose';  // Use import instead of require

const userSchema = new mongoose.Schema({
    login: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Regular expression for email
    },
    name: { type: String, required: false },
    secondName: { type: String, required: false },
    password: { type: String, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Named export
export { User };
