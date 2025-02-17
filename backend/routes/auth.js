import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate inputs:
    if (!email || !password){
        return res.status(400).json({message: "Email and password are required."});
    }

    // Checks if the user already exists:
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(400).json({ massage: "User already exits."});
        }
    

    // Hash the password:
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating the new user:
    const newUser = new User({ name, email, password: hashedPassword});
    await nreUser.save();

    res.status(201).json({ massage: "User registered successfully."}); 
    } catch (error) {
        res.status|(500).json( {massage: "Server error", error: error.message});
    }
});