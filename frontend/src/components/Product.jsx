import React, { useState }from 'react'
import '../componentStyles/componentStyles.css'
import { Link } from 'react-router-dom';
import Rating from './Rating';


function Product({product}) {
  const[rating,setRating]= useState(0);
const handleRatingChange=(newRating)=>{
  setRating(newRating) 
  console.log(`rating changed to ${newRating}`);
  
}
  return (
    <Link to={`/product/${product._id}`} className='product_id'>
  <div className="product-card">
    <img 
  src={product.image && product.image.length > 0 ? product.image[0].url : '/placeholder.png'} 
  alt={product.name} 
  className='product-image-card' 
/>
    <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="home-price"><strong>Price</strong>{product.price}</p>
        <div className="rating-container">
          <Rating
          value={product.ratings}
          onRatingChange={handleRatingChange}
          disabled={true} 
          />
        </div>
        <span className="product-card">
          ({product.numberOfReviews} {product.numberOfReviews === 1 ? ' Review' : ' Reviews'} )
        </span>
        <button className="add-to-cart">View Details</button>
    </div>
  </div>
  </Link>
  )
}   

export default Product
