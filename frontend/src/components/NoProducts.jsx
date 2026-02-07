import React from 'react'
import '../componentStyles/NoProducts.css'

function NoProducts({keyword}) {
  return (
   <div className="no-product-content">
    <div className="no-products-icon">⚠️</div>
        <h3 className="no-products-title">No Products Found</h3>
        <p className="no-products-message">
            {keyword?`No products found for "${keyword}". Please try a different search term.`: `No products available at the moment. Please check back later.`}
        </p>
   </div>
  )
}

export default NoProducts
