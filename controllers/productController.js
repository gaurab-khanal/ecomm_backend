const Product = require('../models/product');
const cloudinary = require('cloudinary');
const WhereClause = require('../utils/whereClause');


exports.addProduct = ( async (req,res)=>{
    
    try {
        // images

        let imageArray = [];

        if(!req.files){
            return res.status(401).send("Images are required!")
        }

        if(req.files){
            for(let i = 0; i<req.files.photos.length;i++){
                let result = await cloudinary.v2.uploader.upload(req.files.photos[i].tempFilePath,
                    {
                        folder: "products"
                    })

                    imageArray.push({
                        id: result.public_id,
                        secure_url: result.secure_url
                    })
            }
        }

        req.body.photos = imageArray;
        req.body.user = req.user.id

       const product = await Product.create(req.body);

       res.status(200).json({
        success: true,
        product,
       })

    } catch (error) {
        console.log(error);    }
    
});

exports.getAllProducts = async(req,res)=>{
    try {   

        const resultPerPage = 6;
        const totalCountProduct = await Product.countDocuments(); // count total products

        
        let productsObj = new WhereClause(Product.find(), req.query).search().filter()

        
        // products.limit().skip()
        
        let products = await productsObj.base.clone();
        const filteredProductsNumber = products.length;

        productsObj.pager(resultPerPage);
        productsObj = await productsObj.base

        res.status(200).json({
            success: true,
            productsObj,
            filteredProductsNumber,
            totalCountProduct
        })
    } catch (error) {
        console.log(error)
    }
}

exports.getSingleProducts = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(401).send("No Product Found with this id", )
        }

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        console.log(error)   
    }
}


exports.addReview = async(req,res)=>{
    try {
        const { rating, comment, productId } = req.body;

        const review = {
          user: req.user._id,
          name: req.user.name,
          rating: Number(rating),
          comment,
        };
      
        const product = await Product.findById(productId);
      
        const AlreadyReview = product.reviews.find(
          (rev) => rev.user.toString() === req.user._id.toString()
        );
      
        if (AlreadyReview) {
          product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
              review.comment = comment;
              review.rating = rating;
            }
          });
        } else {
          product.reviews.push(review);
          product.noOfReviews = product.reviews.length;
        }
      
        // adjust ratings
      
        product.ratings =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
      
        //save
      
        await product.save({ validateBeforeSave: false });
      
        res.status(200).json({
          success: true,
        });
     } catch (error) {
        console.log(error)   
    }
}



exports.deleteReview = async(req,res)=>{
    try {
        const {productId} = req.query;

        const product = await Product.findById(productId);

        const reviews = product.reviews.filter(
            (rev) => rev.user.toString() !== req.user._id.toString()
        )

        const noOfReviews = reviews.length;

        const ratings = (noOfReviews===0)?0: reviews.reduce(
            (acc,item)=>item.rating+acc,0
        )/noOfReviews;

        //update product

        await Product.findByIdAndUpdate(productId,
            {
                reviews,
                ratings,
                noOfReviews
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

            res.status(400).json({
                success: true
            })

     } catch (error) {
        console.log(error)   
    }
}


exports.getOnlyReviewsForOneProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.query.id);

        res.status(200).json({
            success:true,
            reviews: product.reviews
        })
    } catch (error) {
        console.log(error)
    }
}




// admin only controllers
exports.adminGetAllProducts = async (req,res)=>{
    try {
        const products = await Product.find();

        if(!products){
            res.status(400).send("Products aren't available")
        }

        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
    }
}


exports.adminUpdateOneProduct = async (req,res)=>{
    try {
        let product = await Product.findById(req.params.id);

        if(!product){
            return res.status(401).send("No Product Found with this id", )
        }

        let imageArray = [];

        if(req.files){
            //destroy the existing image

            for( i = 0;i<product.photos.length; i++){
                const result = cloudinary.v2.uploader.destroy(product.photos[i]._id)
            }

            //upload and save the images
            for(let i = 0; i<req.files.photos.length;i++){
                let result = await cloudinary.v2.uploader.upload(req.files.photos[i].tempFilePath,
                    {
                        folder: "products" // folder name => .env
                    })

                    imageArray.push({
                        id: result.public_id,
                        secure_url: result.secure_url
                    })
            }

            req.body.photos = imageArray;
            
        }

        

        product = await Product.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        console.log(error)
    }
}


exports.adminDeleteOneProduct = async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(401).send("No Product Found with this id", )
        }

        for( i = 0;i<product.photos.length; i++){
            cloudinary.v2.uploader.destroy(product.photos[i]._id)
        }


        await product.deleteOne();
        
        

        res.status(200).json({
            success: true,
            message: "Product was deleted!!"
        })
    } catch (error) {
        console.log(error)
    }
}
