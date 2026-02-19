import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';
import { v2 as cloudinary } from 'cloudinary';

// ─── Helper: upload one base64 image to Cloudinary ───────────────────────────
async function uploadImageToCloudinary(base64String) {
    const result = await cloudinary.uploader.upload(base64String, {
        folder: 'products',
    });
    return { public_id: result.public_id, url: result.secure_url };
}

// ─── Helper: delete image from Cloudinary ─────────────────────────────────────
async function destroyCloudinaryImage(public_id) {
    if (public_id) await cloudinary.uploader.destroy(public_id);
}

// 1 Creating Products (Admin) — supports base64 image array in req.body.images
export const createProducts = handleAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;

    // Upload images to Cloudinary if provided as base64 strings
    if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
        const uploadedImages = await Promise.all(
            req.body.images.map((img) => {
                // Accept either a base64 DataURL or an already-uploaded object {url,public_id}
                if (typeof img === 'string') return uploadImageToCloudinary(img);
                return img; // already {public_id, url}
            })
        );
        req.body.image = uploadedImages;
        delete req.body.images;
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
});

// 2 Get All Products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 8;

    const apiFeatures = new APIFunctionality(Product.find(), req.query)
        .search()
        .filter();

    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
        return next(new HandleError('Page not found', 404));
    }

    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;

    if (!products || products.length === 0) {
        return next(new HandleError('No products found', 404));
    }

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        totalPages,
        currentPage: page,
    });
});

// 3 Update Products (Admin) — optionally replaces images via Cloudinary
export const updateProduct = handleAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new HandleError('Product not found', 404));

    // If new images (base64) are supplied, delete old ones and upload new
    if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
        // Delete existing Cloudinary images
        await Promise.all(product.image.map((img) => destroyCloudinaryImage(img.public_id)));

        const uploadedImages = await Promise.all(
            req.body.images.map((img) => {
                if (typeof img === 'string') return uploadImageToCloudinary(img);
                return img;
            })
        );
        req.body.image = uploadedImages;
        delete req.body.images;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, product });
});

// 4 Delete Product (Admin)
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new HandleError('Product not found', 404));

    // Remove images from Cloudinary
    await Promise.all(product.image.map((img) => destroyCloudinaryImage(img.public_id)));

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// 5 Get Single Product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new HandleError('Product not found', 404));
    res.status(200).json({ success: true, product });
});

// 6 Create / Update Review
export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);
    if (!product) return next(new HandleError('Product not found', 400));

    const reviewExists = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (reviewExists) {
        product.reviews.forEach((r) => {
            if (r.user.toString() === req.user._id.toString()) {
                r.rating = rating;
                r.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
    }

    product.numberOfReviews = product.reviews.length;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.ratings = product.reviews.length > 0 ? sum / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, product });
});

// 7 Get Product Reviews
export const getProductReviews = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) return next(new HandleError('Product not found', 400));
    res.status(200).json({ success: true, reviews: product.reviews });
});

// 8 Delete Review
export const deleteReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new HandleError('Product not found', 400));

    const reviews = product.reviews.filter(
        (r) => r._id.toString() !== req.query.id.toString()
    );
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const ratings = reviews.length > 0 ? sum / reviews.length : 0;
    const numberOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        { reviews, ratings, numberOfReviews },
        { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
});

// 9 Admin — Get All Products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});
