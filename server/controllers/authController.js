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

        // create user collection using userModel
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
        });

        return res.json({success: true});

    } catch (error) {
        res.json({success: false, message: error.message})
    }

}



// create login function
export const login  = async(req, res)=>{
    const {email, password} = req.body;

    // check that email and password are avaialable
    if(!email || !password){
        return res.json({success: false, message: 'Email and password are required'})
    }

    try {

        // find the user with given email
        const user = await userModel.findOne({email});

        // check the given email is match with registered emails
        if(!user){
            return res.json({success:false, message: 'Invalid email'});
        }

        // compare given password with found user password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({success: false, message: 'Invalid password'})
        }

        // create jwt token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // set token to the cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE.ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 1000
        });

        return res.json({success: true});
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

// logout function

export const logout = async(req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            samesite: process.env.NODE.ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 1000
        })

        return res.json({success: true, message:'Logget Out'})
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}