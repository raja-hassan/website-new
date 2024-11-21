const User = require("../models/userModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const loginUser = async (req, res) => { // Add user
    const { userName, password } = req.body;
    try{
        // Check if the user exists
        const user = await User.findOne({ userName });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        // generating a JWT token for authentication
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        user.password = undefined;
        res.status(200).json({message: 'Login successful', user});

    } catch(err) {
        res.status(500).json({ message: 'Server error', err });
    }
}

module.exports = {loginUser}