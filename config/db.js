const mongoose = require('mongoose')

const {DB_URL} = process.env

exports.connect = ()=>{
    mongoose.connect(DB_URL)
    .then(()=>console.log("DB connected!"))
    .catch(error =>{
        console.log(`DB CONNECTION ISSUES`);
        console.log(error);
        process.exit(1);
    })
}
