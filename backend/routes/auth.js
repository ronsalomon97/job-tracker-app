import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


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

router.post('/login', async (req,res) => {
    const {email, password} = req.body;

    try {
        // Find the user by mail:
        const user = await User.findOne({ email });
        if (!user){
            return res.status(401).json({message: "Invalid credentials."});
        }       
        
        // Compare passwords:
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(401).json({message: "Invalid credentials."});
        }

        // Create JWT 
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'});

        // res:
        res.json( { token, user: { id:user._id, name: user.name, email: user.email }});

    } catch (error) {
        res.status(500).json({ massage: "Server error" , error: error.massage });
    }
})

export default router;
