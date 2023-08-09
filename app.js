require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//cookies and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

//temp check
app.set('view engine', 'ejs');

// morgan middleware for logs
app.use(morgan('tiny'));



// import all routes
const home = require('./routes/home');
const user = require('./routes/user');

// middleware routes
app.use('/api/v1', home);
app.use('/api/v1', user);

app.get('/signuptest', (req,res)=>{
    res.render('signupTest.ejs')
})

module.exports = app;