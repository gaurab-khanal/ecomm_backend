const app = require('./app');
require('./config/db').connect();

const cloudinary = require('cloudinary');

const {PORT} = process.env;

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


app.listen(PORT, ()=>{console.log(`Listening on port http://localhost:${PORT}`)})