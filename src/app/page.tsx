"use client";
import React , {useState, useEffect} from "react";
import { useRouter } from "next/navigation";

import { ENV } from '@/config/env'; 

// import component from "./components"; 
import HeroSection from "./components/homePage/hero-section/page.js";
import Services from "./components/homePage/services/page.js";
import Stores from "./components/homePage/popular-store/page.js";
import WorkingProcess from "./components/homePage/working-proess/page.js";
import Categories from "./components/categories/page.js";
import Product from "./components/homePage/product/page.js";
import AddCarosuel from "./components/addCarousel/page.js";
// import FAQs from "./components/homePage/faq-section/page.js";
import Testimonial from "./components/homePage/testimonial/page.js";

export default function Home() {
  const 
    router = useRouter(),
    [posters, setPosters] = useState([]),
    [productsSasta, setProductsSasta] = useState([]),
    [whatNewProduct, setWhatNewProduct] = useState([]),
    [bestSellers, setbestSellers] = useState([]);

  const listYourStore = () => {
    router.push("/list-store");
  };

  // Fetch Stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${ENV.baseUrl}ecommerce-store-product-with-tag`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });
        const data = await res.json();
        if(data.status){
          const {cheap_product, new_product, best_seller} = data.data;
          setProductsSasta(cheap_product);
          setWhatNewProduct(new_product);
          setbestSellers(best_seller);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchStores();
  }, []);


  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await fetch(`${ENV.baseUrl}ecommerce-posters`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });
        const data = await res.json();
        setPosters(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchPosters();
  }, []);

  return (
    <div className="lg:mx-8 mx-4 mb-8">
      <HeroSection />
      <Services />

      {/* Product category */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="lg:text-2xl text-xl">
            Product <span className="text-red-600">Category</span>
          </h3>
          {/* <button className="outline-none focus:outline-none border border-red-600 text-red-600 lg:px-4 lg:py-2 px-2 py-1 rounded-lg bg-white cursor-pointer hover:text-white hover:bg-red-600">
            View all <i className="ri-arrow-right-line"></i>
          </button> */}
        </div>
        <Categories />
      </div>

      <AddCarosuel />
      <Stores />
      
      {/* Excluisve deals and offer */}
      <section className="mb-16">
        <h3 className="lg:text-2xl text-xl mb-4 font-semibold">Exclusive Deals & Offers</h3>

        <div className="flex overflow-x-auto space-x-4 scrollbar-none">
          {posters.map((img, index) => (
            <div key={index} className="flex-shrink-0 ">
              <div className="w-80 h-80 overflow-hidden">
                <img
                  src={img}
                  alt={`Deal ${index + 1}`}
                  loading="lazy"
                  className="object-cover w-full h-full rounded-xl aspect-square"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product */}
      {!productsSasta ? (
        <p className="text-center text-gray-500 my-8">Loading...</p>
      ) : productsSasta.length > 0 && ( <section className="mb-16">
        <div className="flex justify-between items-center mb-4">
          <h3 className="lg:text-lg text-sm">
            <span className="text-red-600 lg:text-2xl text-xl">#BachateRaho</span> <span className="lg:inline-block hidden">Har Roz Ki Sahi Deal</span>
          </h3>
          {/* <button className="outline-none focus:outline-none border border-red-600 text-red-600 lg:px-4 lg:py-2 px-2 py-1 rounded-lg cursor-pointer bg-white hover:text-white hover:bg-red-600">
            View all <i className="ri-arrow-right-line"></i>
          </button> */}
        </div>
        <Product featureProduct={productsSasta} />
      </section>)}

      {!whatNewProduct ? (
        <p className="text-center text-gray-500 my-8">Loading...</p>
      ) : whatNewProduct.length > 0 && (<section className="mb-16">
        <div className="flex justify-between items-center mb-4">
          <h3 className="lg:text-lg text-sm">
            <span className="text-red-600 lg:text-2xl text-xl">#NewAndNow</span> <span className="lg:inline-block hidden">Trending Products Just In</span>
          </h3>
          {/* <button className="outline-none focus:outline-none border border-red-600 text-red-600 lg:px-4 lg:py-2 px-2 py-1 rounded-lg cursor-pointer bg-white hover:text-white hover:bg-red-600">
            View all <i className="ri-arrow-right-line"></i>
          </button> */}
        </div>
        <Product featureProduct={whatNewProduct} />
      </section>)}
      
      <WorkingProcess />

      {!bestSellers ? (
        <p className="text-center text-gray-500 my-8">Loading...</p>
      ) : bestSellers.length > 0 && (<section className="mb-16">
        <div className="flex justify-between items-center mb-4">
          <h3 className="lg:text-lg text-sm">
            <span className="text-red-600 lg:text-2xl text-xl">#TopPicks</span> <span className="lg:inline-block hidden">Loved by All, Chosen by Many</span>
          </h3>
          {/* <button className="outline-none focus:outline-none border border-red-600 text-red-600 lg:px-4 lg:py-2 px-2 py-1 rounded-lg cursor-pointer bg-white hover:text-white hover:bg-red-600">
            View all <i className="ri-arrow-right-line"></i>
          </button> */}
        </div>
        
        <Product featureProduct={bestSellers} />
      </section>)}

      {/* List your store */}
      <section className="py-4 mb-8">
        <h4 className="text-2xl sm:text-4xl font-bold text-center mb-4">Join Us Today</h4>
        <p className="text-sm sm:text-lg text-center mb-4 w-full sm:w-4/5 mx-auto">
          Grow your business by joining our trusted e-commerce platform. Reach thousands of customers,
          showcase your products, and scale your revenue with ease. Get started today and watch your store thrive!
        </p>

        <div className="p-10 flex flex-col gap-4 justify-center text-white bg-cover bg-no-repeat bg-fixed"
            style={{
              backgroundImage:
                `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.59)), url('https://stayinbraj.com/assets/images/property/hotel_booking_page.svg')`,
            }}>
          <h4 className="text-center uppercase text-xl lg:text-3xl font-bold">
            Join the World of Our Marketplace <br /> and List Your Store
          </h4>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" >

            <div className="flex justify-center items-center flex-col gap-2 text-white h-48 border-2 p-4 rounded-xl bg-opacity-10 backdrop-blur-[1px]">
              <div className="h-12 w-12 rounded-full bg-red-600 flex justify-center items-center text-white">
                <i className="ri-earth-fill text-xl sm:text-2xl" />
              </div>
              <h5 className="text-center font-semibold">Reach More Customers</h5>
              <p className="text-center text-xs">
                List your store and products to a wider audience and increase your daily orders with our platform.
              </p>
            </div>

            <div className="flex justify-center items-center flex-col gap-2 text-white h-48 border-2 p-4 rounded-xl bg-opacity-10 backdrop-blur-[1px]">
              <div className="h-12 w-12 rounded-full bg-red-600 flex justify-center items-center text-white">
                <i className="ri-settings-4-line text-xl sm:text-2xl" />
              </div>
              <h5 className="text-center font-semibold">Simple Management</h5>
              <p className="text-center text-xs">
                Easily manage your store, inventory, and orders through our intuitive seller dashboard.
              </p>
            </div>

            <div className="flex justify-center items-center flex-col gap-2 text-white h-48 border-2 p-4 rounded-xl bg-opacity-10 backdrop-blur-[1px]">
              <div className="h-12 w-12 rounded-full bg-red-600 flex justify-center items-center text-white">
                <i className="ri-money-dollar-circle-fill text-xl sm:text-2xl" />
              </div>
              <h5 className="text-center font-semibold">Increase Sales</h5>
              <p className="text-center text-xs">
                Use exclusive promotional tools and analytics to increase your product visibility and revenue.
              </p>
            </div>

            <div className="flex justify-center items-center flex-col gap-2 text-white h-48 border-2 p-4 rounded-xl bg-opacity-10 backdrop-blur-[1px]">
              <div className="h-12 w-12 rounded-full bg-red-600 flex justify-center items-center text-white">
                <i className="ri-check-double-line text-xl sm:text-2xl" />
              </div>
              <h5 className="text-center font-semibold">Trusted by Sellers</h5>
              <p className="text-center text-xs">
                Join a community of successful sellers who rely on our platform for consistent growth and exposure.
              </p>
            </div>

          </div>

          {/* Call to Action */}
          <div className="text-center mt-4">
            <button type="button" onClick={listYourStore} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg transition duration-300 cursor-pointer" >
              List Your Store Now
            </button>
          </div>
        </div>
      </section>

      <Testimonial />

      <section className="mb-16">
        <div className="w-full h-full sm:h-fit  overflow-hidden bg-white rounded-3xl flex lg:flex-nowrap flex-wrap">
          <div className="order-1 lg:order-0 basis-full lg:basis-1/2 px-4 lg:px-8 py-8 lg:py-16 flex flex-col h-full justify-center items-center sm:items-start">
            <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-gray-800 mb-4">
              Everything You Need, Just a Tap Away!
            </h2>
            <p className="text-xs sm:text-lg lg:text-xl mb-6">
              Experience the convenience of booking hotels, ordering food, buying property, and much more – all from one powerful app! Explore exclusive deals, travel options, and shopping offers right at your fingertips.
            </p>
            <p className="text-xs sm:text-lg lg:text-xl mb-6">
              Download our app today and enjoy seamless travel and lifestyle services on the go. The best deals and services are just a tap away!
            </p>
            <div className="w-full flex justify-between items-center flex-wrap gap-2 sm:gap-0">
              <a href="https://play.google.com/store/apps/details?id=com.stayinbraj.stayinbraj" target="_blank" rel="noopener noreferrer">
                <button className="sm:w-auto w-full px-4 py-3 text-md font-bold rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-300">
                  <i className="fa-brands fa-google-play mr-2"></i> Download from Play Store
                </button>
              </a>
            </div>
          </div>

          <div className="order-0 lg:order-1 basis-full lg:basis-1/2 relative h-[300px] lg:h-auto">
            <img
              src="https://images.pexels.com/photos/5053847/pexels-photo-5053847.jpeg"
              alt="Download App Now"
              className="object-cover h-full w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
