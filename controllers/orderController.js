const Order = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async(req,res)=>{
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
        } = req.body;

        // gather all the product id
        const productsId = orderItems.map(item => item.product);

        // gather actual product document using product id
         const productStock = await Promise.all(productsId.map(id => Product.findById(id)));

         const outOfStockItems = [];

        for(let i=0; i<orderItems.length;i++){
            if(orderItems[i].quantity>productStock[i].stock){
                console.log("Out of Stock Item.")
                outOfStockItems.push(orderItems[i]);
            }
        }
        
        if (outOfStockItems.length > 0) {
            res.status(400).json({ message: "Some items are out of stock", outOfStockItems });
            return; // Return early to prevent order creation
        }

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
            user: req.user._id
        })

        res.status(200).json({
            success: true,
            order,
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getOneOrder = async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );


        if (order.user._id.toString() !== req.user._id.toString()){
            res.status(401).send("User not authorized")
        }
        if(!order){
            res.status(400).send("Order Not found");
        }


        res.status(200).json({
            success: true,
            order,
        })

        
    } catch (error) {
        console.log(error)   
    }
}


exports.getLoggedInOrders = async(req,res)=>{
    try {
        const order = await Order.find({user: req.user._id});

        if(!order){
            res.status(400).send("Order Not found");
        }

        
        res.status(200).json({
            success: true,
            order,
        })

        
    } catch (error) {
        console.log(error)
    }
}


exports.adminGetAllOrders = async(req,res)=>{
    try {
       
        const orders = await Order.find();
        

        res.status(200).json({
            success: true,
            orders
        })

    } catch (error) {
        console.log(error)
    }
}

exports.adminGetOneUserOrders = async(req,res)=>{
    try {
        const order = await Order.find({user: req.params.id});

        if(!order){
            res.status(400).send("Order Not found");
        }

        
        res.status(200).json({
            success: true,
            order,
        })

        
    } catch (error) {
        console.log(error)
    }
}


exports.adminUpdateOrder = async(req,res)=>{
    try {
        
        const order = await Order.findById(req.params.id);

        if(order.orderStatus === "Delivered"){
            res.status(401).send("Order is already marked for delivered!")
        }

        order.orderStatus = req.body.orderStatus;

        order.orderItems.forEach(async product=>{
            await updateProductStock(product.product, product.quantity)
        } )

        await order.save();

        res.status(200).send({
            success: true,
            order
        })

    } catch (error) {
        console.log(error)
    }
}

exports.adminDeleteOrder = async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id);

        await order.deleteOne();

        res.status(200).json({
            success: true
        })
                
    } catch (error) {
        console.log(error)
    }
}



async function updateProductStock(productId, quantity){
    const product = await Product.findById(productId);

    product.stock = product.stock - quantity;

    await product.save({validateBeforeSave: false});
}