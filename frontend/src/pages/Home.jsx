import React from 'react'
import '../pageStyles/Home.css'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'

const products =[
        {
            "_id": "6967977eb8bdf8341d23493a",
            "name": "Product1",
            "description": "Product description1",
            "price": 100,
            "ratings": 0,
            "image": [
                {
                    "public_id": "This is test id1",
                    "url": "This is test url1",
                    "_id": "6967977eb8bdf8341d23493b"
                }
            ],
            "category": "shirt",
            "stock": 24,
            "numberOfReviews": 0,
            "reviews": [],
            "createdAt": "2026-01-14T13:17:50.244Z",
            "__v": 0
        },
        {
            "_id": "6967b3a427c06f41fbd74bee",
            "name": "Product2",
            "description": "Product description2",
            "price": 200,
            "ratings": 6,
            "image": [
                {
                    "public_id": "This is test id2",
                    "url": "This is test url2",
                    "_id": "6967b3a427c06f41fbd74bef"
                }
            ],
            "category": "phone",
            "stock": 1,
            "numberOfReviews": 5,
            "reviews": [
                {
                    "user": "696b071a76b25b4595a8c8da",
                    "name": "zoro1",
                    "rating": 5,
                    "comment": "good!",
                    "_id": "696b0dc2fc0f20cf46cc5332"
                },
                {
                    "user": "696b071a76b25b4595a8c8da",
                    "name": "zoro1",
                    "rating": 5,
                    "comment": "nice!",
                    "_id": "696b0e35fc0f20cf46cc5338"
                },
                {
                    "user": "696b071a76b25b4595a8c8da",
                    "name": "zoro1",
                    "rating": 8,
                    "comment": "nice!",
                    "_id": "696b0eda9c95a73379fe1b77"
                },
                {
                    "user": "696b071a76b25b4595a8c8da",
                    "name": "zoro1",
                    "rating": 8,
                    "comment": "good",
                    "_id": "696b0fea83363fd284de45b0"
                },
                {
                    "user": "696b071a76b25b4595a8c8da",
                    "name": "zoro1",
                    "rating": 4,
                    "comment": "good!!!!",
                    "_id": "696b100583363fd284de45b9"
                }
            ],
            "createdAt": "2026-01-14T15:17:56.250Z",
            "__v": 6
            
        },
        
    ]

function Home() {
    return (
    <>
    <Navbar/>
    <ImageSlider/>
        <div className="home-container">
            <h2 className="home-heading">Trending Now</h2>
            <div className="home-product-container">
               {products.map((product,index)=>(<Product product={product} key={index}/>))}
            </div>
        </div>
        <Footer />
        </>
    )
}

export default Home;