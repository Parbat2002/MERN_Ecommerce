import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";


// http://localhost:8000/api/v1/product/6967977eb8bdf8341d23493a?keyword=shirt

// 1 Creating Products
export const createProducts = handleAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;

    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

// 2 Get All Products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 4;

    const apiFeatures = new APIFunctionality(Product.find(), req.query)
        .search()
        .filter();

    // filtered querry before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    // calculate total page
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
        return next(new HandleError("Page not found", 404))
    }

    // pagination 
    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;

    if (!products || products.length === 0) {
        return next(new HandleError("No products found", 404))
    }
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        totalPages,
        currentPage: page
    })
})

// 3 Update Products
export const updateProduct = handleAsyncError(async (req, res, next) => {

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!product) {
        return next(new HandleError("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})

// 4 Delete Product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new HandleError("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

// 5 Asscessing Single Product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new HandleError("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})

// 6 Reviews and update

export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
const {rating,comment,productId}=req.body;
const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
}
const product=await Product.findById(productId);
if(!product){
    return next(new HandleError("Product not found", 400))
}
const reviewExists=product.reviews.find(review=>review.user.toString()===req.user._id.toString());
if(reviewExists){
    product.reviews.forEach(review=>{
        if(review.user.toString()===req.user._id.toString()){
            review.rating=rating,
            review.comment=comment
        }
    })
}else{
    product.reviews.push(review)
}
 product.numberOfReviews=product.reviews.length
let sum=0;
product.reviews.forEach(review=>{
    sum+=review.rating;
})
product.ratings=product.reviews.length>0?sum/product.reviews.length:0
await product.save({validateBeforeSave:false});
res.status(200).json({
    success:true,
    product
})
})

// 7 getting reviews
export const getProductReviews= handleAsyncError(async (req, res, next) => {
const product=await Product.findById(req.query.id);
if(!product){
    return next(new HandleError("Product not found", 400))
}
res.status(200).json({
    success:true,
    reviews:product.reviews
})
})

// 8 deleting reviews
export const deleteReview= handleAsyncError(async (req, res, next) => {
const product=await Product.findById(req.query.productId);
if(!product){
    return next(new HandleError("Product not found", 400))
}
const reviews=product.reviews.filter(review=>review._id.toString()!==req.query.id.toString());
let sum=0;
reviews.forEach(review=>{
    sum+=review.rating
})
const ratings=reviews.length>0?sum/reviews.length:0;
const numberOfReviews=reviews.length;
await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numberOfReviews
},{
    new:true,
    runValidators:true
})
res.status(200).json({
    success:true,
    message:"Review deleted successfully"
})
})

//  admin getting all products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})

