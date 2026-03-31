const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    console.log("Signup API hit");
    try{
        const {name, email, password} = req.body;

        const userExist = await User.findOne({email});
        if(userExist) {
            return res.status(400).json({message: "User already existed"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({message: "User registered successfully", user})

    }catch(err) {
        res.status(500).json({message: err.message})
    }
}

// LOGIN
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
           return res.status(400).json({message: "Incorrect password entered"});
        }
        const userPayload = {
            userId: user._id,
            email: user.email,
        }

        const secrete_key = process.env.JWT_SECRET;

        const token = jwt.sign(userPayload, secrete_key, {
            expiresIn: "1d",
        })
        res.status(200).json({message: "Login successful", token, 
            user: {
        id: user._id,
        name: user.name,
        email: user.email
    }})
    }catch(err) {
        res.status(500).json({message: err.message});
    }
}