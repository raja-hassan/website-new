const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: false,
        trim: true,
        match:[/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength:[6, 'Password must be at least 6 characters long']
    },
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength:[3, 'Password must be at least 3 characters long']
    },
    role: {
        type: String,
        enum:['admin', 'user'],
        default:'user'
    },
});

module.exports = mongoose.model('User', userSchema);