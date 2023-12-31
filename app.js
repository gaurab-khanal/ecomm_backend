require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');


// enable cors for all routes
app.use(cors())

//for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
const product = require('./routes/product');
const order = require('./routes/order');
const esewa = require('./routes/esewa');

// middleware routes
app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order);
app.use('/api/v1', esewa)

app.get('/signuptest', (req,res)=>{
    res.render('signupTest.ejs')
})

module.exports = app;