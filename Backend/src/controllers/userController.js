const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");
const {validateUser} = require("../validations/userValidation")

const addUser = async (req, res) => { // Add user
    // Determine if it's an admin adding a user or a user registering themselves
    const isAdmin = req.user && req.user.role === 'admin'; // Assuming you have req.user populated from authentication middleware
    const {error} = validateUser(req.body, !isAdmin) //Passing true for registration, false for Admin

    if(error) return res.status(400).json({status:400, error: error.details[0].message, message: error.details[0].message})

    try{
        const existingUser = await User.findOne({
            $or: [{ email: req.body.email }, { userName: req.body.userName }]
        });
        if (existingUser) {
            return res.status(400).json({ //1 brown, 1 blue 
                status: 400,
                error: 'Email or Username already exists',
                message: 'Email or Username already exists'
            });
        }
        // Hash password before saving (if you're storing passwords)
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        const user = new User({
            ...req.body,
            password: hashedPassword // Save the hashed password
        });
        const result = await user.save();
        res.status(200).json({status:200, data: result, message:  isAdmin ? 'User added successfully' : 'User registered successfully'});
    } catch(err) {
        res.status(500).json({status:500, error: `An error occurred while adding user: ${err}`, message: `An error occurred while adding user: ${err}`})
    }
}

module.exports = {addUser}