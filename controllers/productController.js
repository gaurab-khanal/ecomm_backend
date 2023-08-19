exports.product = ( async (req,res)=>{
    
    try {
        const info = {
            name: "Gaurab",
            greet: "This is product"
        }
        res.status(200).json(info)
    } catch (error) {
        console.log(error);    }
    
})

