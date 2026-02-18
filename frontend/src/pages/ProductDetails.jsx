import React, { useEffect, useState } from 'react';
import '../pageStyles/ProductDetails.css';
import '../componentStyles/Rating.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductDetails, removeErrors } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { addItemsToCart } from '../features/cart/cartSlice';
import ReviewSection from '../components/ReviewSection';

function ProductDetails() {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            toast.error('Exceeded Available Stock!', { position: 'top-center', autoClose: 3000 });
            return;
        }
        setQuantity(qty => qty + 1);
    };

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('Quantity cannot be less than 1!', { position: 'top-center', autoClose: 3000 });
            return;
        }
        setQuantity(qty => qty - 1);
    };

    const addToCart = () => {
        dispatch(addItemsToCart({ id, quantity }));
        toast.success(`${product.name} added to cart!`, { position: 'top-center', autoClose: 2000 });
    };

    const { loading, error, product } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        if (id) dispatch(getProductDetails(id));
        return () => { dispatch(removeErrors()); };
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error?.message || error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    if (loading) return <><Navbar /><Loader /><Footer /></>;

    if (!product) return (
        <>
            <PageTitle title="Product Details" />
            <Navbar />
            <Footer />
        </>
    );

    return (
        <>
            <PageTitle title={product.name} />
            <Navbar />
            <div className="product-details-page">

                {/* ── Product Info Section ── */}
                <div className="product-details-grid">
                    {/* Images */}
                    <div className="product-images">
                        <div className="product-main-image">
                            <img
                                src={product.image?.[activeImage]?.url || '/images/placeholder.png'}
                                alt={product.name}
                            />
                        </div>
                        {product.image?.length > 1 && (
                            <div className="product-thumbnails">
                                {product.image.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img.url}
                                        alt={`${product.name} ${i + 1}`}
                                        className={`thumb ${activeImage === i ? 'active-thumb' : ''}`}
                                        onClick={() => setActiveImage(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="product-info">
                        <p className="product-category">{product.category}</p>
                        <h1 className="product-name">{product.name}</h1>

                        <div className="product-rating-row">
                            <Rating rating={product.ratings} />
                            <span className="product-review-count">
                                ({product.numberOfReviews} review{product.numberOfReviews !== 1 ? 's' : ''})
                            </span>
                        </div>

                        <p className="product-price">Rs. {product.price?.toLocaleString()}/-</p>

                        <div className={`product-stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                            {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✕ Out of Stock'}
                        </div>

                        {product.stock > 0 && (
                            <div className="product-qty-row">
                                <div className="qty-controls">
                                    <button className="qty-btn" onClick={decreaseQuantity}>−</button>
                                    <span className="qty-value">{quantity}</span>
                                    <button className="qty-btn" onClick={increaseQuantity}>+</button>
                                </div>
                                <button className="add-to-cart-btn" onClick={addToCart}>
                                    Add to Cart
                                </button>
                            </div>
                        )}

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* ── Review Section ── */}
                <ReviewSection productId={id} />

            </div>
            <Footer />
        </>
    );
}

export default ProductDetails;
