const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/emailHelper');
const crypto = require('crypto');

exports.signup = async (req, res) => {
    try {

        if (!req.files) {
            return res.send("Photo is required for signup")
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

        const myUrl = `${process.env.FRONT_END_URL}/resetpassword/${forgetToken}`;

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


exports.getLoggedInUserDetails = async (req, res) => {
    try {

     const user = await User.findById(req.user.id)

     res.status(200).json({
        success: true,
        user
     })
    } catch (error) {   
        console.log(error)
    }

}

// change password

exports.changePassword = async (req,res)=>{
    try {

        // get user from middleware
        const userId = req.user.id

        const user = await User.findById(userId).select("+password");

       const isPasswordCorrect = await user.isPasswordValidated(req.body.oldPassword);

       if(!isPasswordCorrect){
        return res.status(400).send("Current Password is incorrect");
       }

       user.password = req.body.password;

       await user.save();

       cookieToken(user,res)

    } catch (error) {
        console.log(error)
    }
}


exports.updateUserDetails = async (req,res)=>{
    try {
        // check if email and name exists

        if(!(req.body.name && req.body.email)){
            res.status(400).send("All fields are required!");
        }

        const newData = {
            name : req.body.name,
            email: req.body.email
        };

        if(req.files){
            const user = await User.findById(req.user.id);

            const imageId = user.photo.id;

            // delete photo on cloudinary
            const response = await cloudinary.v2.uploader.destroy(imageId);

            // upload the new photo
            const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
                folder: "users",
            });

            newData.photo = {
                id: result.public_id,
                secure_url: result.secure_url
            }
        }

        const user = await User.findByIdAndUpdate(req.user.id, newData, {
            new: true,
            runValidators: true,
            useFindAndMofify: false
        })

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}


// ADMIN starts

exports.adminAllUser = async(req,res)=>{
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: err?.message ||" No user found"})
    }
}

exports.managerAllUser = async(req,res)=>{
    try {
        const users = await User.find({role: "user"});

        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        console.log(error)
    }
}


exports.admingetOneUser = async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            res.status(400).send("No user");
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}


exports.adminUpdateOneUserDetails = async (req,res)=>{
    try {
        // check if email and name exists

        if(!(req.body.name && req.body.email)){
            res.status(400).send("All fields are required!");
        }

        const newData = {
            name : req.body.name,
            email: req.body.email,
            role: req.body.role
        };
 

        const user = await User.findByIdAndUpdate(req.params.id, newData, {
            new: true,
            runValidators: true,
            useFindAndMofify: false
        })

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}

exports.adminDeleteOneUser = async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);

        if(user.role === "admin"){
            return res.status(400).json({
               message:  "Admin Cannot be deleted"
            })
        }

        if(!user){
            res.status.send("No user found");
        }

        const imageId = user.photo?.id;

        if(imageId){
            await cloudinary.v2.uploader.destroy(imageId);
        }

       

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
       
    } catch (error) {
        console.log(error)
    }
}
