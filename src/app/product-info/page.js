"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

import Categories from "../components/categories/page.js";
import SearchModal from "../components/searchLocation/page.js";
import Product from "../components/homePage/product/page.js";

import { useToast } from "../../context/toast.js";
import { useCardContext } from "../../context/addToCart.js";

import { ENV } from '@/config/env'; 

const LAST_CITY_COOKIE = "last_search_city";
// Cookie getter function
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const productInfo = () => {
  const searchParams = useSearchParams(),
    router = useRouter(),
    { showToast } = useToast(),
    productId = searchParams.get("product_id") || "",
    unqId = searchParams.get("id") || "",
    { cart, addProduct, increaseQuantity, decreaseQuantity } = useCardContext();

  const [product, setProduct] = useState([]),
    [similarProduct, setSimilarProduct] = useState([]),
    [sponsorProduct, setSponsorProduct] = useState([]),
    [relaventProduct, setReleventProduct] = useState([]),
    [storeInfo, setStoreInfo] = useState([]),
    [loading, setLoading] = useState(true),
    [apiError, setApiError] = useState(""),
    [searchForm, setSearchForm] = useState(false),
    [searchCookie, setSearchCookie] = useState(null),
    [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const recentSearch = getCookie(LAST_CITY_COOKIE);
    setSearchCookie(recentSearch);
  }, []);

  const getQuantityInCart = (productId) => {
    const storeCart = cart[product?.store_id];
    if (!storeCart) return 0;
    const item = storeCart.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);

        let route = `${ENV.baseUrl}ecommerce-available-store-product?product_id=${encodeURIComponent(productId)}&id=${encodeURIComponent(unqId)}`;

        const res = await fetch(route, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });

        const data = await res.json();

        if (data.status) {
          const { product_info, similar_product, sponsor_product, store_info, relavent_product } = data.data;
          setProduct(product_info);
          setSimilarProduct(similar_product);
          setSponsorProduct(sponsor_product);
          setStoreInfo(store_info);
          setReleventProduct(relavent_product);
        } else {
          setApiError("No stores found for this location");
        }
      } catch (error) {
        setApiError("Failed to fetch stores. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [productId, unqId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Please wait, Stayinbraj is responding...</p>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    const link = `http://localhost:3000/product-info?product_id=${productId}&id=${unqId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        showToast("Link copied successfully!!", "success");
      })
      .catch(() => {
        showToast("Failed to copy link ❌", "warning");
      });
  };

  const checkLocation = (storeId, productId, type) => {
    if (!searchCookie) {
      setSearchForm(true);
      return;
    }

    if (!(storeInfo && Object.keys(storeInfo).length > 0)) {
      showToast("Store not available, so you can't place the order at this time!!", "warning");
      return;
    }

    if (type === "increase") increaseQuantity(storeId, productId);
    else if (type === "decrease") decreaseQuantity(storeId, productId);
    else if (type === "add") {
      addProduct({
        id: product.product_id,
        name: product.name,
        cat_id: product.cat_id,
        store_id: storeInfo.store_id,
        store_name: storeInfo.name,
        price: product.price,
        quantity: 1,
      });
    } else {
      showToast("Reload the page!!", "warning");
    }
  };

  return (
    <>
      <div className="lg:mx-8 mx-4 my-8">
        {/* Product category */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="lg:text-2xl text-xl">
              Product <span className="text-red-600">Category</span>
            </h3>
          </div>
          <Categories />
        </div>

        {apiError || product.length === 0 ? (
          <>
            <div className="flex items-center justify-center flex-col text-center text-gray-600">
              <img
                src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" // example illustration
                alt="No stores found"
                className="w-40 h-40 mb-6"
              />
              <span className="text-lg mb-4">Product info not found.</span>
            </div>
          </>
        ) : (
          <>
            {/* Fancybox Assets */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css" />
            <Script
              src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js"
              strategy="afterInteractive"
              onLoad={() => {
                if (typeof window !== "undefined" && window.Fancybox) {
                  window.Fancybox.bind("[data-fancybox]", { Thumbs: { autoStart: true } });
                }
              }}
            />

            <section className="my-8">
              <div className="flex flex-col lg:flex-row lg:gap-12 px-2 mb-8">
                <div className="w-full lg:w-2/5 flex lg:flex-row flex-col-reverse gap-4 lg:px-2">
                  {/* Thumbnail List */}
                  <div className="flex flex-col gap-2">
                    {parseInt(product.discount_amount) > 0 && <div className="bg-gradient-to-r from-red-900 to-yellow-800 text-white text-center rounded-sm text-sm font-medium py-2 px-4 w-fit lg:w-full md:w-full sm:w-full">{product.discount}% OFF</div>}
                    <div className="flex lg:flex-col gap-2">
                      {product.img && Array.isArray(product.img) && product.img.length > 0 ? (
                        <>
                          {product.img.slice(0, 3).map((img, i) => (
                            <div key={img || i} className="lg:w-24 lg:h-20 w-16 h-12 relative">
                              <a href={img} data-fancybox={`gallery-${product.store_id}`} data-caption={`Image ${i + 1}`}>
                                <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover rounded border" />
                              </a>
                            </div>
                          ))}

                          {/* + More Images */}
                          {product.img.length > 3 && (
                            <div className="lg:w-32 lg:h-20 w-16 h-12 relative">
                              <a href={product.img[3]} data-fancybox={`gallery-${product.store_id}`} data-caption={`Image 4`}>
                                <img src={product.img[3]} alt="Thumb 4" className="w-full h-full object-cover rounded" />
                                <div className="absolute inset-0 bg-white bg-opacity-60 text-red-600 flex items-center justify-center lg:text-xl text-lg rounded hover:bg-red-600 hover:text-white border">+{product.img.length - 3}</div>
                              </a>

                              {/* Hidden extra images */}
                              {product.img.slice(4).map((img, i) => (
                                <a key={img || i} href={img} data-fancybox={`gallery-${product.store_id}`} data-caption={`Image ${i + 5}`} className="hidden" />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="lg:w-32 lg:h-20 w-16 h-12 relative">
                          <a href="https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg" data-fancybox={`gallery-${product.store_id}`} data-caption="Default Store Image">
                            <img src="https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg" alt="Default Thumb" className="w-full h-full object-cover rounded border" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Main Large Image */}
                  <div className="flex-grow h-88 overflow-hidden border border-gray-300 rounded-lg">
                    <a href={product.img && Array.isArray(product.img) && product.img.length > 0 ? product.img[0] : "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} data-fancybox={`gallery-${product.store_id}`} data-caption={product.name}>
                      <img src={product.img && Array.isArray(product.img) && product.img.length > 0 ? product.img[0] : "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} alt={product.name} className="h-full w-full object-cover rounded-lg" loading="lazy" />
                    </a>
                  </div>
                </div>
                <div className="w-full lg:w-3/5 lg:px-2 mt-4 lg:mt-0">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg lg:text-2xl font-medium text-gray-800 mb-1 capitalize">
                      {product.name} - {product.quantity}
                    </h2>

                    <button onClick={() => handleCopyLink()} className="text-lg text-red-600 cursor-pointer" title="Copy Link">
                      <i className="ri-share-line"></i>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-red-600 font-semibold mb-8">
                    <i className="ri-star-fill"></i> <span># Lowest Price</span>
                  </div>

                  <div className="mt-2 mb-4">
                    {parseInt(product.discount_amount) > 0 && <span className="line-through text-gray-400 text-sm mr-2">MRP ₹{product.price}</span>}
                    <div className="text-2xl font-bold text-gray-900">₹ {product.final_price}</div>
                    <p className="text-xs text-gray-500">(Taxes not included)</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    {getQuantityInCart(product.product_id) > 0 ? (
                      <div className="flex items-center border border-red-500 rounded">
                        <button onClick={() => checkLocation(product.store_id, product.product_id, "decrease")} className="rounded-r-none cursor-pointer flex items-center justify-center px-3 text-xl font-bold text-red-600 h-full w-full hover:bg-red-100">
                          <i className="ri-subtract-line text-sm"></i>
                        </button>
                        <div className="px-4 py-1 text-lg font-medium bg-red-600 text-white h-full w-full flex items-center justify-center">{getQuantityInCart(product.product_id)}</div>
                        <button onClick={() => checkLocation(product.store_id, product.product_id, "increase")} className="rounded-l-none cursor-pointer flex items-center justify-center px-3 text-xl font-bold text-red-600 h-full w-full hover:bg-red-100">
                          <i className="ri-add-line text-sm"></i>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => checkLocation(product.store_id, product.product_id, "add")} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded sm:w-fit cursor-pointer">
                        Add To Cart
                      </button>
                    )}
                    {/* <button className="border border-red-500 text-red-500 font-semibold py-2 px-4 rounded sm:w-fit hover:bg-red-50 cursor-pointer">
                      <i className="ri-heart-3-fill"></i> Save To Wishlist
                    </button> */}
                  </div>

                  {
                    product.veg_tag != 0 && (
                      product.product_type == "vegetarian" ? (
                        <div className="flex items-center text-sm text-green-700 mb-4">
                          <div className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center mr-2">
                            <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
                          </div>
                          This is a Vegetarian product.
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-red-700 mb-4">
                          <div className="w-4 h-4 border-2 border-red-600 rounded-sm flex items-center justify-center mr-2">
                            <div className="w-2 h-2 bg-red-600 rounded-sm"></div>
                          </div>
                          This is a Non - Vegetarian product.
                        </div>
                      )
                    )
                  }
                  <div className="flex flex-wrap gap-4">
                    {relaventProduct.map((v, i) => (
                      <div onClick={() => setProduct(v)} key={i} className={`border ${product.product_id == v.product_id ? "border-red-600" : "border-gray-600"} rounded  bg-white text-center px-4 py-2 hover:bg-red-100 cursor-pointer`}>
                        <p className={`${product.product_id == v.product_id ? "text-red-600 " : "text-gray-600"} text-md font-medium capitalize`}>About {v.quantity}</p>
                        <span className={`${product.product_id == v.product_id ? "text-red-600 " : "text-gray-600"} text-sm`}>₹{v.final_price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="my-8">
              <div className="flex flex-wrap border-b overflow-x-auto scrollbar-hide">
                <button onClick={() => setActiveTab("description")} className={`cursor-pointer text-sm sm:text-base px-4 py-2 whitespace-nowrap transition-all duration-200 ${activeTab === "description" ? "text-red-600 font-semibold border-b-2 border-red-600" : "text-gray-600 hover:text-red-500"} focus:outline-none focus:ring-0`}>
                  Description
                </button>
                <button onClick={() => setActiveTab("store-info")} className={`cursor-pointer text-sm sm:text-base px-4 py-2 whitespace-nowrap transition-all duration-200 ${activeTab === "store-info" ? "text-red-600 font-semibold border-b-2 border-red-600" : "text-gray-600 hover:text-red-500"} focus:outline-none focus:ring-0`}>
                  Store
                </button>
              </div>

              {activeTab === "description" && <div className="p-4 text-sm sm:text-base text-gray-600 capitalize">{product?.description?.trim() ? product.description : "No description available."}</div>}
              {activeTab === "store-info" && (
                <div className="p-4 text-sm sm:text-base text-gray-700">
                  {storeInfo && Object.keys(storeInfo).length > 0 ? (
                    <div className="space-y-2">
                      <p className="capitalize">
                        <strong>Store Name:</strong> {storeInfo.name}
                      </p>
                      <p className="capitalize">
                        <strong>Address:</strong> {storeInfo.address}
                      </p>
                      <p className="capitalize">
                        <strong>Opening Time:</strong> {storeInfo.opening_time}
                      </p>
                      <p className="capitalize">
                        <strong>Closing Time:</strong> {storeInfo.closing_time}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">Store not available for order.</p>
                  )}
                </div>
              )}
            </section>

            <section className="my-8">
              <div className="max-w-2xl px-2 py-10">
                <h2 className="text-xl font-medium text-red-800 mb-8">Four reasons to shop with us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 text-2xl rounded-full">
                      <i className="ri-focus-2-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-thin text-black">Top Deals Daily</h3>
                      <p className="text-xs text-gray-600">Best prices updated every morning</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 text-2xl rounded-full">
                      <i className="ri-truck-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-thin text-black">Fast Delivery</h3>
                      <p className="text-xs text-gray-600">Groceries at your doorstep in hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 text-2xl rounded-full">
                      <i className="ri-money-rupee-circle-line"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-thin text-black">Easy Payments</h3>
                      <p className="text-xs text-gray-600">Multiple secure payment options</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 text-2xl rounded-full">
                      <i className="ri-text-wrap"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-thin text-black">Hassle-free Returns</h3>
                      <p className="text-xs text-gray-600">Quick returns with no questions asked</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="my-8">
              <h3 className="text-xl font-medium text-red-800 mb-8">Sponsored</h3>

              <Product featureProduct={sponsorProduct} />
            </section>

            <section className="my-8">
              <h3 className="text-xl font-medium text-red-800 mb-8">Similar Products</h3>

              <Product featureProduct={similarProduct} />
            </section>

            <SearchModal isOpen={searchForm} onClose={() => setSearchForm(false)} />
          </>
        )}
      </div>
    </>
  );
};

export default productInfo;
