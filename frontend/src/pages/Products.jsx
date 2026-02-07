import React, { use, useEffect } from 'react'
import '../pageStyles/Products.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product'
import { getProduct, removeErrors } from '../features/products/productSlice'
import Loader from '../components/Loader'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import NoProducts from '../components/NoProducts'

function Products() {
    const { loading, error, products, resultPerPage, productCount} = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword') || '';
    console.log(keyword);


    useEffect(() => {
        dispatch(getProduct({ keyword }))
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors())
        }
    }, [dispatch, error])


    return (
        <div>
            <>
                {loading ? (<Loader />) : (<>
                    <PageTitle title="All Products" />
                    <Navbar />
                    <div className="products-layout">
                        <div className="filter-section">
                            <h3 className="filter-heading">CATEGORIES</h3>
                            {/* Render Categories */}
                        </div>
                        <div className="products-section">
                            {products.length > 0 ? (<div className="products-product-container">
                                {products.map((product) => (
                                    <Product key={product._id} product={product} />
                                ))}
                            </div>) : (<NoProducts keyword={keyword} />
                            )}
                        </div>
                    </div>
                    <Footer />
                </>)}
            </>
        </div>
    )
}

export default Products
