import Joi from 'joi';
import mongoose from 'mongoose';

const userType = new mongoose.Schema({
    typeName: {type: String, required: true, unique: true}
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Regular expression for email
    },
    name: { type: String, required: false },
    secondName: { type: String, required: false },
    password: { type: String, required: true },
    comment: { type: String },
    userType: { type: mongoose.Schema.Types.ObjectId, ref: "userType", required: false } // if no userType, user has min permitions
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const UserType = mongoose.model('UserType', userType);

// Named export
export { User, UserType };
