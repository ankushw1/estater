const authController = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

authController.post('/register', async (req, res) => {
    try {
        const isExisting = await User.findOne({ email: req.body.email });

        if (isExisting) {
            throw new Error('Email already registered');
        }

        const hashPassword = await bcrypt.hash(req.body.password, 5);

        const newUser = await User.create({ ...req.body, password: hashPassword });

        const { password, ...others } = newUser._doc;

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_TOKEN, { expiresIn: '1h' });

        res.status(201).json({ ...others, token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



authController.post('/login', async(req,res) => {
    try{

        const user = await User.findOne({email:req.body.email})

        if(!user){
            throw new Error('User is not registered')
        }

        const comparePassword = await bcrypt.compare(req.body.password,user.password)

        if(!comparePassword){
            throw new Error('Enter correct password')
        }

        const {password,...others} = user._doc

        const token = await jwt.sign({id:user._id},process.env.JWT_TOKEN,{expiresIn:'1h'})

        res.status(200).json({...others,token})

    }catch(error){
        res.status(500).json({error:error.message})
    }
})


module.exports = authController;
