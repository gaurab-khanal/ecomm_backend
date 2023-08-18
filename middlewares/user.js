const User = require('../models/user');
const jwt = require('jsonwebtoken');


// while accessing userdashboard route the user should be logged in
// and provide correct information about user who is visiting userdashboard route
// to provide or get correct data(validate that is the one user which I am looking for)
// we need some sort of information
// if user is logged in, token is stored in web
// extract token
// decode token with payload(id in this case)
// find particular user by decoded user.id

// find token 


exports.isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send("Login first to access this page");
        }

        // decode token with payload(id in this case)
        // find particular user by decoded user.id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

exports.isAdmin = async (req,res, next)=>{
    try {
        if (req.user.role === "admin"){
            next();
        }else{
            res.status(401).send("Unauthorized access");
        }
    } catch (error) {
        console.log(error)
    }
}


exports.customRole =  (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new Error("Unauthorized access") )
        }
        next();
    }
}



