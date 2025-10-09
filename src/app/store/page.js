"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import AddCarosuel from "../components/addCarousel/page.js";
import { useCardContext } from ".././../context/addToCart.js"; // adjust path as needed
import { useToast } from "../../context/toast.js";
import SearchModal from "../components/searchLocation/page.js";
import { ENV } from '@/config/env'; 

const LAST_CITY_COOKIE = "last_search_city";
// Cookie getter function
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const StoreDetail = () => {
  const searchParams = useSearchParams();
  const storeName = searchParams.get("store_name") || "";
  const unqId = searchParams.get("id") || "";
  const router = useRouter();
  const { cart, addProduct, increaseQuantity, decreaseQuantity } = useCardContext();
  const { showToast } = useToast();

  const [store, setStore] = useState(null),
    [activeCategory, setActiveCategory] = useState("All"),
    [storeAvailability, setStoreAvailability] = useState("approved"),
    [searchText, setSearchText] = useState(""),
    [similarStore, setSimilarStore] = useState([]),
    [storeReviews, setStoreReviews] = useState([]),
    [searchForm, setSearchForm] = useState(false),
    [searchCookie, setSearchCookie] = useState(null),
    [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const recentSearch = getCookie(LAST_CITY_COOKIE);
    setSearchCookie(recentSearch);
  }, []);

  const checkLocation = (storeId, productId, type) => {
    if (!searchCookie) {
      setSearchForm(true);
      return;
    }

    if (type === "increase") increaseQuantity(storeId, productId);
    else if (type === "decrease") decreaseQuantity(storeId, productId);
    else if (type === "add") {
      const product = filteredProducts.find((pro) => pro.product_id === productId);
      if (product) {
        addProduct({
          id: product.product_id,
          name: product.name,
          cat_id: product.cat_id,
          store_id: storeId,
          store_name: store.name,
          price: product.price,
          quantity: 1,
        });
      }
    } else {
      showToast("Reload the page!!", "warning");
    }
  };

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(`${ENV.baseUrl}ecommerce-store-info?store_name=${encodeURIComponent(storeName)}&id=${encodeURIComponent(unqId)}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });
        const data = await res.json();
        if (data.status && data.data) {
          const { store_info, similar_stores, store_review } = data.data;
          setStore(store_info);
          setSimilarStore(similar_stores);
          setStoreReviews(store_review);
        } else {
          setStore(data);
        }
      } catch (error) {
        console.error("Failed to fetch store info:", error);
      }
    };

    fetchStore();
  }, [storeName, unqId]);

  useEffect(() => {
    if (!store) return;

    if (store.status !== "approved" || !store.available) {
      setStoreAvailability("pending");
      return;
    }

    if (store.latitude == null || store.longitude == null) {
      setStoreAvailability("location");
      return;
    }

    const initMap = () => {
      const latitude = parseFloat(store.latitude || "0");
      const longitude = parseFloat(store.longitude || "0");

      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: latitude, lng: longitude },
      });

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: store.name,
      });
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          initMap();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [store]);

  const visitNow = (store) => {
    const { store_id: unqId, name } = store;
    router.push(`/store?store_name=${name}&id=${unqId}`);
  };

  const getQuantityInCart = (productId) => {
    const storeCart = cart[store?.store_id];
    if (!storeCart) return 0;
    const item = storeCart.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const filteredProducts = (activeCategory === "All" ? store?.category?.flatMap((cat) => cat.products || []) || [] : store?.category?.find((cat) => cat.name === activeCategory)?.products || []).filter((pro) => (pro.name || "").toLowerCase().includes(searchText.toLowerCase()));

  if (!store)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Please wait, Stayinbraj is responding...</p>
        </div>
      </div>
    );

  if (store && store.status === false) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center text-gray-600">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" // example store not found image
          alt="No stores available"
          className="w-64 h-64"
        />
        <span className="text-lg mb-4">Store is not available.</span>
      </div>
    );
  }

  return (
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

      {/* Main UI */}
      <section className="lg:mx-8 mx-4 my-8">
        <div className="flex flex-wrap px-2 mb-8">
          {/* Header */}
          <div className="w-full mb-4 lg:px-2">
            <h2 className="text-2xl font-bold capitalize mb-1">{store.name}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-700 mb-2">
              <div className="flex items-center gap-1">
                <i className="ri-map-pin-line text-red-600"></i>
                <span className="capitalize truncate">{store.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="ri-store-3-line text-red-600"></i>
                <span className="capitalize truncate">{store.type_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="ri-price-tag-3-line text-red-600"></i>
                <span>{store.category?.length || 0} categories</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="ri-star-smile-line text-yellow-500"></i>
                <span>{store.average_rating || 0} / 5</span>
                <span className="text-gray-500">({store.reviews ? store.reviews + "+" : 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="w-full lg:w-2/3 flex lg:flex-row flex-col-reverse gap-4 lg:px-2">
            <div className="flex lg:flex-col gap-2">
              {store.images && store.images.length > 0 ? (
                <>
                  {store.images.slice(0, 3).map((img, i) => (
                    <div key={img || i} className="lg:w-32 lg:h-20 w-16 h-12 relative">
                      {" "}
                      {/* ✅ updated */}
                      <a href={img} data-fancybox={`gallery-${store.store_id}`} data-caption={`Image ${store.store_id + i + 1}`}>
                        <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover rounded border" />
                      </a>
                    </div>
                  ))}
                  {store.images.length > 3 && (
                    <div className="lg:w-32 lg:h-20 w-16 h-12 relative">
                      <a href={store.images[3]} data-fancybox={`gallery-${store.store_id}`} data-caption={`Image 4`}>
                        <img src={store.images[3]} alt="Thumb 4" className="w-full h-full object-cover rounded" />
                        <div className="absolute inset-0 bg-white bg-opacity-60 text-red-600 flex items-center justify-center lg:text-xl text-lg rounded hover:bg-red-600 hover:text-white border">+{store.images.length - 3}</div>
                      </a>
                      {store.images.slice(4).map((img, i) => (
                        <a key={img || i} href={img} data-fancybox={`gallery-${store.store_id}`} data-caption={`Image ${i + 5}`} className="hidden" /> // ✅ updated
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="lg:w-32 lg:h-20 w-16 h-12 relative">
                  <a href="https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg" data-fancybox={`gallery-${store.store_id}`} data-caption="Default Store Image">
                    <img src="https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg" alt="Default Thumb" className="w-full h-full object-cover rounded border" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex-grow h-88 overflow-hidden">
              <a href={store.image || "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} data-fancybox={`gallery-${store.store_id}`} data-caption={store.name}>
                <img src={store.image || "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} alt={store.name} className="h-full w-full object-cover rounded-lg" loading="lazy" />
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="w-full lg:w-1/3 lg:px-2 mt-4 lg:mt-0">
            {storeAvailability === "approved" && <div id="map" className="lg:h-[22rem] h-[12rem] w-full rounded-xl"></div>}
            {storeAvailability === "pending" && (
              <section className="px-4 py-24 text-center text-gray-900 rounded-lg">
                <i className="ri-emotion-sad-line text-7xl sm:text-9xl mb-4"></i>
                <p className="text-xl sm:text-2xl">Store is not available at this time</p>
              </section>
            )}
            {storeAvailability === "location" && (
              <section className="px-4 py-20 text-center text-gray-900 rounded-lg">
                <i className="ri-emotion-sad-line text-7xl sm:text-9xl mb-4"></i>
                <p className="text-xl sm:text-2xl">Store location is not available</p>
              </section>
            )}
          </div>
        </div>

        <AddCarosuel />

        {/* Product List */}
        <div className="w-full mb-8">
          <div className="sticky top-5 z-10 bg-white/90 backdrop-blur-md shadow-md px-4 py-3 rounded-lg mb-8 border border-gray-100">
            <div className="flex justify-between items-center gap-4 ">
              <h3 className="flex items-center gap-2 text-lg lg:text-xl font-medium text-black">
                <i className="ri-shopping-bag-3-line text-red-600 text-xl"></i>
                <span className="hidden sm:block">Products</span>
              </h3>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Search Box */}
                <div className="flex items-center border border-red-500 rounded-lg bg-white px-3 py-1.5 shadow-sm w-56 transition-all focus-within:shadow-md">
                  <i className="ri-search-line text-red-500 text-lg"></i>
                  <input type="text" className="w-full px-2 py-1 text-sm focus:outline-none" placeholder="Search Product..." autoFocus value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </div>

                {/* Category Toggle */}
                <button onClick={() => setShowCategories((prev) => !prev)} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" title="Toggle Categories">
                  <span className="hidden sm:block">{showCategories ? "Hide Categories" : "Show Categories"}</span>
                  <i className={`ri-arrow-${showCategories ? "up" : "down"}-s-line text-lg`}></i>
                </button>
              </div>
            </div>

            {/* Category Buttons */}
            {showCategories && (
              <div className="flex flex-wrap gap-2 mt-4">
                <button onClick={() => setActiveCategory("All")} className={`px-4 py-2 border rounded-lg text-sm font-medium capitalize transition-colors cursor-pointer ${activeCategory === "All" ? "bg-red-600 text-white border-red-600" : "hover:bg-red-100 hover:text-red-600 border-gray-300 text-gray-700"}`}>
                  <i className="ri-apps-line mr-1"></i> All
                </button>
                {store.category?.map((cat) => (
                  <button key={cat.id || cat.name} onClick={() => setActiveCategory(cat.name)} className={`px-4 py-2 border rounded-lg text-sm font-medium capitalize transition-colors cursor-pointer ${activeCategory === cat.name ? "bg-red-600 text-white border-red-600" : "hover:bg-red-100 hover:text-red-600 border-gray-300 text-gray-700"}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <span className="text-5xl mb-2">🛒</span>
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredProducts.map((pro, index) => {
                const images = Array.isArray(pro.img) ? pro.img : [pro.img || "https://i.pinimg.com/736x/05/a7/b8/05a7b8f050d194205ddd286ab91490ab.jpg"];
                return (
                  <div key={pro.id || index + `product`} className="sm:w-full bg-white border border-gray-300 rounded-sm">
                    <div className="relative">
                      {parseInt(pro.discount_amount) > 0 && (
                        <div className="absolute top-0 left-0 z-10">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M0 3v27.748c0 .427.47.69.834.465l3.64-2.24a1.64 1.64 0 011.72 0l3.613 2.224a1.64 1.64 0 001.72 0l3.613-2.223a1.641 1.641 0 011.72 0l3.613 2.223a1.64 1.64 0 001.72 0l3.614-2.223a1.64 1.64 0 011.72 0l3.64 2.24a.547.547 0 00.833-.466V0H3a3 3 0 00-3 3z" fill="#e7000b" />
                          </svg>
                          <p className="absolute top-0 left-0 text-white text-[10px] px-1">{pro.discount || 0}% Off</p>
                        </div>
                      )}
                      <div className="w-full h-48 overflow-hidden rounded-t-sm">
                        <a href={images[0]} data-fancybox={`product-gallery-${index}`} data-caption={pro.name}>
                          <img src={images[0]} alt={pro.name} className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110" loading="lazy" />
                        </a>
                        {images.slice(1).map((img, i) => (
                          <a key={img || i} href={img} data-fancybox={`product-gallery-${index}`} data-caption={`${pro.name} - image ${i + 2}`} className="hidden" /> // ✅ updated
                        ))}
                      </div>
                      <div className="px-3 py-2 flex flex-col">
                        <div>
                          <p className="text-lg font-medium truncate capitalize">{pro.name}</p>
                          <p className="text-xs text-gray-500">{pro.quantity}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          {parseInt(pro.discount) > 0 ? (
                            <div className="flex items-center gap-x-2">
                              <span className="text-xs text-gray-500 line-through">&#8377;{pro.price}</span>
                              <span className="text-sm">
                                &#8377;<span className="text-lg ml-1">{pro.final_price}</span>
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm">
                              &#8377;<span className="text-lg ml-1">{pro.final_price}</span>
                            </span>
                          )}
                          {getQuantityInCart(pro.product_id) > 0 ? (
                            <div className="flex items-center gap-2">
                              <button className="w-6 h-6 flex items-center justify-center bg-gray-200 text-black rounded-full cursor-pointer" onClick={() => checkLocation(store.store_id, pro.product_id, "decrease")}>
                                <i className="ri-subtract-line text-sm"></i>
                              </button>
                              <span>{getQuantityInCart(pro.product_id)}</span>
                              <button className="w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full cursor-pointer" onClick={() => checkLocation(store.store_id, pro.product_id, "increase")}>
                                <i className="ri-add-line text-sm"></i>
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => checkLocation(store.store_id, pro.product_id, "add")} className="w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full cursor-pointer">
                              <i className="ri-add-line text-sm"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {storeReviews?.length > 0 && (
          <div className="w-full mt-8">
            <h3 className="text-lg lg:text-xl mb-4">Customer Reviews</h3>
            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-none">
              {storeReviews.slice(0, 20).map((review, index) => (
                <div key={index} className="min-w-[300px] max-w-[250px] flex-shrink-0 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={review.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={review.name || "Anonymous"} className="w-8 h-8 rounded-full object-cover" />
                      <div className="text-sm font-semibold capitalize">{review.name || "Anonymous"}</div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <i className="ri-star-fill"></i>
                      <span className="text-sm font-medium text-gray-800">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-4">{review.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {similarStore?.length > 0 && (
          <>
            <hr className="w-full border-b border-gray-100 lg:my-8 my-4" />
            <div className="w-full">
              <h3 className="lg:text-xl text-lg mb-4">Similar Stores</h3>
              <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {similarStore.map((storeItem, idx) => (
                  <div key={storeItem.id || idx} className="min-w-[220px] w-[220px] border border-gray-300 rounded-lg bg-white shadow hover:shadow-md transition flex-shrink-0">
                    <div className="w-full h-40 overflow-hidden border-b border-gray-200 mb-4">
                      <img src={storeItem.image || "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} alt={storeItem.name || "store image"} loading="lazy" className="h-full w-full object-cover rounded-t-lg" />
                    </div>
                    <div className="px-2 mb-4">
                      <h5 className="text-lg truncate capitalize">{storeItem.name || "N/A"}</h5>
                      <div className="text-xs mb-2 capitalize flex gap-x-1">
                        <i className="ri-map-pin-line text-red-600"></i>
                        <p className="truncate ">{storeItem.address || "N/A"}</p>
                      </div>
                      <div className="text-xs mb-2 capitalize flex gap-x-1">
                        <i className="ri-time-line text-red-600"></i>
                        <p>{storeItem.opening_time || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2 mb-4">
                      <div className="flex items-center justify-center gap-x-1">
                        <i className="ri-star-fill text-yellow-400" />
                        {storeItem.average_rating > 0 ? (
                          <div>
                            <span className="text-sm font-medium">{storeItem.average_rating ?? "0"}</span>
                            <span className="text-xs text-gray-700"> ({storeItem.reviews ?? "0"} reviews)</span>
                          </div>
                        ) : (
                          <p className="text-xs">Newly Listed</p>
                        )}
                      </div>
                      <button onClick={() => visitNow(storeItem)} className="text-xs border border-red-600 text-red-700 rounded-lg px-2 py-2 hover:text-white hover:bg-red-600 cursor-pointer">
                        Visit Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      <SearchModal isOpen={searchForm} onClose={() => setSearchForm(false)} />
    </>
  );
};

export default StoreDetail;
