import Product from "../models/productModel.js";

// 1 Creating Products
export const createProducts = async (req, res) => {
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
}

// 2 Get All Products
export const getAllProducts = async (req, res) => {
    const products = await Product.find()
    res.status(200).json({
        success: true,
        products
    })
}

// 3 Update Products
export const updateProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        product
    })
}

// 4 Delete Product
export const deleteProduct=async (req, res) => {
 let product = await Product.findById(req.params.id);
  if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }
    product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
}

// Asscessing Single Product
export const getSingleProduct=async (req, res) => {
const product = await Product.findById(req.params.id);
if (!product) {
    return res.status(500).json({
        success: false,
        message: "Product not found"
    })
}
res.status(200).json({
    success: true,
    product
})
}