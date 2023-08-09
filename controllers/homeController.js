const bigPromise = require('../middlewares/bigPromise')

exports.home = bigPromise( async (req,res)=>{
    // const db  = await something()
    const info = {
        name: "Gaurab",
        greet: "Hello Gaurab"
    }
    res.status(200).json(info)
})

exports.demo = async  (req,res)=>{
    try {
         // const db  = await something()
    const info = {
        name: "Gaurab",
        greet: "Hello Gaurab"
    }
    res.status(200).json(info)
    } catch (error) {
        console.log(error)
    }
}
