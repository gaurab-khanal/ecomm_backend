const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const bcrypt = require('bcryptjs');
const mailHelper = require('../utils/emailHelper');
const crypto = require('crypto');

exports.signup = async (req, res) => {
    try {

        if (!req.files) {
            return new Error("Photo is required for signup")
        }

        const { name, email, password } = req.body;

        if (!(email && name && password)) {
            return new Error("All fields are required!");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const file = req.files.photo;
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "users",
        })


        // register user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            photo: {
                id: result.public_id,
                secure_url: result.secure_url,
            }
        })

        cookieToken(user, res);

    } catch (error) {
        console.log("after cookie Token")
        console.log(error)
        res.status(400).send(error)
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check for email and password field
        if (!(email && password)) {
            return res.status.send("All fields are required");
        }

        // check if user is available in DB // get user from DB
        const user = await User.findOne({ email }).select("+password");


        if (!user) {
            return res.status(400).send("Email or Password does not match or exist");
        }


        // match the password
        const isPasswordCorrect = await user.isPasswordValidated(password);

        // if password donot match
        if (!isPasswordCorrect) {
            return res.status(400).send("Email or Password does not match or exist")
        }

        // if all goes good and we send the token
        cookieToken(user, res);

    } catch (error) {
        console.log(error)
    }
}


exports.logout = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: "Logout success"
        })
    } catch (error) {
        console.log(error)
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).send("You aren't registered yet!")
        }

        const forgetToken = user.getForgetPasswordToken()


        await user.save({ validateBeforeSave: false });

        const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgetToken}`;

        const message = `Copy paste this link in your browser and hit enter \n\n ${myUrl}`;

        try {
            await mailHelper({
                to: user.email,
                subject: "Received?",
                text: message
            });
            res.status(200).json({
                success: true,
                message: "Email sent successfully!"
            })
        } catch (error) {
            user.forgetPasswordToken = undefined;
            user.forgetPasswordExpiry = undefined;
            await user.save({ validateBeforeSave: false })
            console.log(error)
        }

    } catch (error) {
        console.log(error)
    }
}

exports.passwordReset = async (req, res) => {
    try {

        const token = req.params.token;

        const encryToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            forgetPasswordToken: encryToken,
            forgetPasswordExpiry: { $gt: Date.now() }
        });
        console.log(user.email);
        if(!user){
            return res.status(400).send("Token invalid or expired")
        }

        if (req.body.password !== req.body.confirmPassword){
            return  res.send("Password and Confirm password do not match");
        }

        user.password = req.body.password;
    
        user.forgetPasswordExpiry = undefined;
        user.forgetPasswordToken = undefined;


        await user.save();

        //send a JSON response or send token

        cookieToken(user,res);

    } catch (error) {   
        console.log(error)
    }

}