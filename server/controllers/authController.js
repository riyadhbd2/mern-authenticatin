import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';


// create Register function
export const register = async(req, res)=>{

    const {name, email, password} = req.body;

    // to ensure that every field is avaialble
    if (!name || !email || !password) {
        return res.json({success: false, message: 'Missing Details'});
    }

    try {

        // prevent existing to register again 
        const existingUser = await userModel.findOne({email});

        if (existingUser) {
            return res.json({success: false, message: 'User already exists'});
        }
        // to encrypt password for security purpose
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user using userModel
        const user = new userModel({name, email, password: hashedPassword});
        // save to database
        await user.save();

        // create jwt token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // set token to the cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE.ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 1000
        }).send({success: true, message: 'token set in the cookie'})

    } catch (error) {
        res.json({success: false, message: error.message})
    }

}

// create login function

