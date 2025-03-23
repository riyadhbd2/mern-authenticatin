import 'dotenv/config';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';



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

        // send welcome email to the user
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Easir Arafat',
            text: `Welcome to Easir Arafat MERN AUTHENTICATION. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: 'User register successfully'});

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

        return res.json({success: true, message: 'User login Successfully'});
        
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

// create and send OTP
export const sendVerifyOtp = async(req, res)=>{
    try {

        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({success: false, message: 'Account already verified'})
        }

        // create otp
        const otp =  String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Your OTP us ${otp}. Verify your account using this OTP`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOption);

        res.json({success: true, message: 'Verification OTP sent on Email'});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


// email verification function fot OTP
export const verifyEmail = async(req, res) => {

    const {userId, otp} = req.body;

    if (!userId || !otp) {
        return res.json({success: false, message: 'Missing Details'})
    }

    try {

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP Expired'})
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success:true, message: 'Email verified successfully'});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// check user is signedin or not
export const isAuthenticated = async (req, res)=>{
    try {
        return res.json({success: true});
    } catch (error) {
        res.json({sucess:false, message: error.message})
    }
}

// Send password reset OTP
export const sendResetOtp = async (req, res)=>{

    const {email} = req.body;

    if (!email) {
        return res.json({success: false, message: 'Email is required'})
    }

    try {

        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({sucess: false, message: 'User not found'});
        }

            // create otp
            const otp =  String(Math.floor(100000 + Math.random() * 900000));

            user.resetOtp = otp;
            user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    
            await user.save();
    
            const mailOption = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Password Reset OTP',
                // text: `Your OTP is ${otp}. Reset your password using this OTP`,
                html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
            };

            await transporter.sendMail(mailOption);

            return res.json({success: true, message: 'OTP sent to your email'});

        
    } catch (error) {
        return res.json({sucess: false, message: error.message})
    }

}

// reset password
export const resetPassword = async (req, res) =>{

    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: 'Email, OTP and password are required'})
    }
    try {

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success:false, message: 'Invalid OTP'})
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP Expired'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: 'Password has been reset successfully'});
        
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}
