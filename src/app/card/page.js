"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCardContext } from "../../context/addToCart";
import { useAuth } from "../../context/AuthContext.js";
import { useToast } from "../../context/toast.js";
import CountryModal from "../components/countyModal/page.js";
import SearchModal from "../components/searchLocation/page.js";

import { ENV } from '@/config/env'; 

const LAST_CITY_COOKIE = "last_search_city";
// Cookie getter function
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const CartPage = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeProduct, removeStoreFromCart } = useCardContext();
  const router = useRouter();
  const { showToast } = useToast();
  const { authToken } = useAuth();

  const [selectedCountry, setSelectedCountry] = useState({
    name: "India",
    flag: "https://i.pinimg.com/736x/76/e2/bc/76e2bc3a8c3503f9fdd53aaa924b89e5.jpg",
    code: "IN",
    dial_code: "+91",
  });
  const [countyCodemodalOpen, setCountryCodeModalOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchForm, setSearchForm] = useState(false);
  const [searchCookie, setSearchCookie] = useState(null);
  const [backButtonInfo, setBackInfo] = useState({
    store_id: "",
    name: "",
  });

  useEffect(() => {
    const recentSearch = getCookie(LAST_CITY_COOKIE);
    setSearchCookie(recentSearch);
  }, []);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_no: "",
    email_id: "",
    address: "",
    extra_note: "",
    delivery_time: "",
    delivery_time_option: "now", // 'now' or 'later'
    payment_method: "phonepe",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("userOrderCheckoutData", JSON.stringify(updated)); // ✅ Save to localStorage
      return updated;
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setHasMounted(true);

    const saved = localStorage.getItem("userOrderCheckoutData");
    if (saved) {
      setFormData((prev) => ({
        ...prev,
        ...JSON.parse(saved),
      }));
    }
  }, []);

  useEffect(() => {
    if (hasMounted && cart && Object.keys(cart).length > 0) {
      const firstStoreId = Object.keys(cart)[0];
      if (firstStoreId) {
        fetchProductInfo(firstStoreId);
      }
    }
  }, [hasMounted, cart]);

  const fetchProductInfo = async (storeId) => {
    if (!cart || !cart[storeId]) return;
    setLoading(true);

    const store = cart[storeId];
    const payload = {
      store_id: storeId,
      store_name: store.storeName,
      items: store.items.map((item) => ({
        product_id: item.id,
        cat_id: item.cat_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
    };

    setBackInfo({
      store_id: storeId,
      name: store.storeName,
    });

    setSelectedStoreId(storeId);

    try {
      const res = await fetch(`${ENV.baseUrl}ecommerce-seleced-product-info`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          access: "stayinbraj2025osculant",
        },
        body: JSON.stringify({ cart: payload }),
      });
      const data = await res.json();
      if (data.status && data.data) {
        setFetchedData(data.data);
        setSelectedStoreId(storeId);
      } else {
        setFetchedData(null);
      }
    } catch (error) {
      console.error("Failed to fetch store info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (storeId, productId, type) => {
    if (type === "increase") await increaseQuantity(storeId, productId, false);
    else if (type === "decrease") await decreaseQuantity(storeId, productId);
  };

  const handleRemoveProduct = async (storeId, productId) => {
    await removeProduct(storeId, productId);
  };

  const visitNow = (store) => {
    const { store_id: storeId, name } = store;
    router.push(`/store?store_name=${name}&id=${storeId}`);
  };

  const seeAllStores = () => {
    !searchCookie ? setSearchForm(true) : router.push(`/available-stores?location=${searchCookie}`);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const fd = new FormData(e.target),
      countryCode = selectedCountry.dial_code.replace("+", "");

    fd.set("mobile_no", countryCode + fd.get("mobile_no"));
    fd.append("items", JSON.stringify(fetchedData.items));
    fd.append("country_code", "+" + countryCode);
    fd.append("store_id", selectedStoreId);

    try {
      const res = await fetch(`${ENV.baseUrl}ecommerce-place-order`, {
        method: "POST",
        headers: {
          access: "stayinbraj2025osculant",
          auth_token: "Bearer " + authToken,
        },
        body: fd,
      });

      const result = await res.json();

      if (result.status) {
        const { code, message, mch_txn_id, order_id, store_id, payment_method, payment_status, order_status } = result.data;

        showToast(message, "success");
        sessionStorage.setItem(
          "orderDetail",
          JSON.stringify({
            mchTxnId: mch_txn_id,
            orderId: order_id,
            storeId: store_id,
            paymentMethod: payment_method,
            paymentStatus: payment_status,
            orderStatus: order_status,
          })
        );

        removeStoreFromCart(selectedStoreId);

        if (code == 2) window.location.href = result.data.redirect_url;
        else router.push(`/order-successfully`);
      } else {
        showToast(result.message, "alert");
      }
    } catch (error) {
      console.error("Place order failed:", error);
      showToast("Try again later", "alert"); 
    }

    setBtnLoading(false);
  };

  if (!hasMounted || !cart || Object.keys(cart).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <div className="text-center">
          <i className="ri-shopping-cart-line text-9xl mb-4 text-red-500"></i>
          <p className="text-xl font-medium">Your cart is empty</p>
          <Link href="/" className="text-red-600 underline mt-2 inline-block">
            Go back to shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart && Object.keys(cart).length > 0 && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Please wait, Stayinbraj is responding...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="lg:mx-8 mx-4 my-8">
        <button onClick={() => visitNow(backButtonInfo)} className="mb-4 flex items-center justify-start gap-x-1 w-fit px-2 rounded-full cursor-pointer text-red-600 hover:text-white hover:bg-red-600">
          <i className="ri-arrow-left-line text-xl"></i>
          <span className="text-sm">Back to Store</span>
        </button>

        <h1 className="text-2xl font-medium capitalize mb-4">Checkout</h1>
        <div className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap">
          <div className="inline-flex gap-2">
            {Object.entries(cart).map(([storeId, store]) => (
              <button key={storeId} onClick={() => fetchProductInfo(storeId)} className={`px-4 py-2 border rounded-full text-sm capitalize cursor-pointer whitespace-nowrap ${selectedStoreId === storeId ? "bg-red-600 text-white" : "text-red-600 border-red-600 hover:bg-red-100"}`}>
                {store.storeName}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="basis-3/5">
            <form onSubmit={placeOrder} className="flex flex-wrap -mx-2">
              <div className="basis-full mb-4 px-2">
                <hr className="w-full border-b border-gray-100 my-4" />
                <h3 className="text-lg text-red-600 font-medium">Contact Info</h3>
              </div>

              {/* Basic Info */}
              <div className="lg:basis-1/2 basis-full mb-4 px-2">
                <label className="block text-sm font-bold text-black leading-6">First Name</label>
                <input type="text" name="first_name" id="firstName" placeholder="Jhon" value={formData.first_name} onChange={handleInputChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 capitalize focus:outline-0" required />
              </div>
              <div className="lg:basis-1/2 basis-full mb-4 px-2">
                <label className="block text-sm font-bold text-black leading-6">Last Name</label>
                <input type="text" name="last_name" id="lastName" placeholder="David" value={formData.last_name} onChange={handleInputChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 capitalize focus:outline-0" required />
              </div>
              <div className="lg:basis-1/2 basis-full mb-4 px-2 ">
                <label className="block text-sm font-bold text-black leading-6">Mobile Number</label>
                <div className="flex ">
                  <div onClick={() => setCountryCodeModalOpen(true)} className="flex justify-center items-center gap-1 uppercase w-36 bg-white rounded-l-xl border border-r-0 border-gray-300  py-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-red-600 focus:outline-0 sm:text-sm sm:leading-6 cursor-pointer outline-red-500">
                    <img src={selectedCountry.flag} alt="India Flag" className="w-6 h-4 object-cover" />
                    <span className="text-xs text-gray-500">
                      {selectedCountry.code} ({selectedCountry.dial_code})
                    </span>
                  </div>
                  <input type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleInputChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-r-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 focus:outline-0" placeholder="e.g. 9876xxxxxx" required />
                </div>
              </div>
              <div className="lg:basis-1/2 basis-full mb-4 px-2">
                <label className="block text-sm font-bold text-black leading-6">Email - Id</label>
                <input type="email" name="email_id" id="emailId" value={formData.email_id} onChange={handleInputChange} placeholder="Jhon@gmail.com" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 focus:outline-0" required />
              </div>

              <div className="basis-full mb-4 px-2">
                <hr className="w-full border-b border-gray-100 my-4" />
                <h4 className="text-lg text-red-600 font-medium"> Where do you want it deivered</h4>
              </div>

              {/* Address or note */}
              <div className="basis-full mb-4 px-2">
                <label className="block text-sm font-bold text-black leading-6">Address</label>
                <input type="address" name="address" id="address" value={formData.address} placeholder="Write Address " onChange={handleInputChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 capitalize focus:outline-0" required />
              </div>
              <div className="basis-full mb-4 px-2">
                <label className="block text-sm font-bold text-black leading-6">Extra not for delivery person</label>
                <textarea name="extra_note" id="note" placeholder="Extra Note!!" value={formData.extra_note} onChange={handleInputChange} className="resize-none h-24 bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 focus:outline-0 block w-full p-2.5"></textarea>
              </div>

              <div className="basis-full mb-4 px-2">
                <hr className="w-full border-b border-gray-100 my-4" />
                <h4 className="text-lg text-red-600 font-medium">When should we deliver it</h4>
              </div>

              {/* delivery time */}
              <div className="basis-full mb-4 px-2">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="radio" name="delivery_time_option" value="now" checked={formData.delivery_time_option === "now"} onChange={handleInputChange} className="accent-red-600 w-4 h-4 rounded border-2 border-red-600 focus:ring-0 cursor-pointer" />
                  <span className="text-sm font-medium">As Soon as possible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="radio" name="delivery_time_option" value="later" checked={formData.delivery_time_option === "later"} onChange={handleInputChange} className="accent-red-600 w-4 h-4 rounded border-2 border-red-600 focus:ring-0 cursor-pointer" />
                  <span className="text-sm font-medium">Later (Choose Time)</span>
                </label>
              </div>
              {formData.delivery_time_option === "later" && (
                <div className="basis-full mb-4 px-2">
                  <label className="block text-sm font-bold text-black leading-6 mb-1">Select Date & Time</label>
                  <input type="datetime-local" name="delivery_time" value={formData.delivery_time} onChange={handleInputChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 focus:outline-0" required />
                </div>
              )}

              <div className="basis-full mb-4 px-2">
                <hr className="w-full border-b border-gray-100 my-4" />
                <h4 className="text-lg text-red-600 font-medium">How would you like to pay?</h4>
              </div>

              {/* Delivery Option */}
              <div className="basis-full mb-8 px-2">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="radio" name="payment_method" value="cod" checked={formData.payment_method === "cod"} onChange={handleInputChange} className="accent-red-600 w-4 h-4 rounded border-2 border-red-600 focus:ring-0 cursor-pointer" />
                  <span className="text-sm font-medium">Cash on delivery</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="radio" name="payment_method" value="phonepe" checked={formData.payment_method === "phonepe"} onChange={handleInputChange} className="accent-red-600 w-4 h-4 rounded border-2 border-red-600 focus:ring-0 cursor-pointer" />
                  <span className="text-sm font-medium">Phone Pay / Google Pay</span>
                </label>
              </div>

              <div className="basis-full px-2">
                {!fetchedData || Object.keys(fetchedData).length === 0 ? (
                  <>
                    <div className="w-full text-center bg-gray-600 rounded-lg px-4 py-2">
                      <p className="text-lg text-white font-medium"> Store not available</p>
                    </div>
                  </>
                ) : (
                  <button className="btn-1 my-2 text-md font-medium border rounded-xl px-4 py-2 text-white bg-green-700 w-full cursor-pointer" disabled={btnLoading}>
                    <i className="ri-loop-right-line"></i>
                    <span>Place Order</span>
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="basis-2/5 lg:px-8 flex flex-col justify-between">
            {!fetchedData || Object.keys(fetchedData).length === 0 ? (
              <div className="text-center w-full py-20 bg-red-100 rounded-xl shadow-inner my-4">
                <i className="ri-emotion-sad-line text-9xl sm:text-9xl text-red-600" />
                <h2 className="text-2xl font-medium text-gray-700">Store not available</h2>
                <p className="text-gray-500 text-xs">Please try again later or check another store.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-y-2">
                  {fetchedData?.store_info && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-xl shadow-sm w-full my-4">
                      {/* Left Icon */}
                      <div className="w-12 h-12 rounded-full bg-white items-center justify-center border border-gray-200 sm:flex hidden">
                        <img src={fetchedData.store_info.image || "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} alt={fetchedData.store_info.name} className="w-full h-full rounded-full" />
                      </div>

                      {/* Store Info */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex flex-row sm:items-start sm:justify-between gap-2">
                          <h3 className="font-bold text-lg text-gray-900 capitalize truncate sm:w-60 w-56">{fetchedData.store_info.name}</h3>
                          <div className="flex items-center gap-x-2">
                            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-medium">
                              <i className="ri-star-fill text-yellow-500 text-xs"></i>
                              {fetchedData.store_info.average_rating}
                            </div>
                            <button className="text-pink-600 text-xl hover:scale-105 transition">
                              <i className="ri-heart-fill"></i>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-2 mt-1">
                          <span className="flex items-center gap-1">
                            <i className="ri-shopping-bag-line text-red-400"></i> Min. {fetchedData.store_info.min_product_price}₹
                          </span>
                          <span className="text-gray-400 hidden sm:inline">•</span>
                          <span className="flex items-center gap-1 capitalize">
                            <i className="ri-store-3-line text-red-400"></i> {fetchedData.store_info.type_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {fetchedData?.items?.length > 0 && (
                    <div className="lg:mb-0 mb-8 bg-white border border-gray-300 rounded-xl p-4 max-h-[560px] overflow-y-auto">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">Items</h4>
                      <ul className="space-y-4">
                        {fetchedData.items.map((item) => (
                          <li key={item.product_id} className="flex gap-4 justify-between items-center text-sm text-gray-700 border-b border-gray-300 pb-2">
                            <img src={item.image?.[0]} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                            <div className="flex flex-col flex-1">
                              <span className="font-medium capitalize">{item.product_name}</span>
                              <span className="text-xs text-gray-500 tabular-nums">
                                ₹{item.price} × {item.product_quantity}
                              </span>
                              <span className="text-sm font-semibold tabular-nums text-red-600">₹{item.final_price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleUpdateQuantity(item.store_id, item.product_id, "decrease")} className="w-6 h-6 rounded-full cursor-pointer bg-gray-200 text-gray-800 flex items-center justify-center">
                                <i className="ri-subtract-line"></i>
                              </button>
                              <span>{item.product_quantity}</span>
                              <button onClick={() => handleUpdateQuantity(item.store_id, item.product_id, "increase")} className="w-6 h-6 rounded-full cursor-pointer bg-gray-200 text-gray-800 flex items-center justify-center">
                                <i className="ri-add-line"></i>
                              </button>
                              <button onClick={() => handleRemoveProduct(item.store_id, item.product_id)} className="text-red-600 text-sm ml-2 cursor-pointer">
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {fetchedData?.payment_info && (
                  <div className="border border-gray-300 bg-white py-2 px-4 mb-2 rounded-xl">
                    <h4 className="text-lg text-red-600 font-medium mb-2">Order Summary</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{fetchedData.payment_info.total_item} items</span>
                      <span className="text-sm text-black tabular-nums">₹{fetchedData.payment_info.amount}</span>
                    </div>
                    <hr className="w-full border-b border-gray-100 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Delivery</span>
                      <span className="text-sm text-black tabular-nums">₹{fetchedData.payment_info.delivery_charge}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">GST ({fetchedData.payment_info.gst}%)</span>
                      <span className="text-sm text-black tabular-nums">₹{fetchedData.payment_info.gst_amount}</span>
                    </div>
                    <hr className="w-full border-b border-gray-100 my-2" />
                    {formData.payment_method === "cod" && (
                      <>
                        <div className="flex justify-between items-center font-medium mb-2">
                          <span className="text-lg ">Total to pay:</span>
                          <span className="text-lg text-green-600 tabular-nums">₹ {fetchedData.payment_info.cash_payable}</span>
                        </div>
                      </>
                    )}
                    {formData.payment_method === "phonepe" && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Convenience Fees</span>
                          <span className="text-sm text-red-600 tabular-nums">₹{fetchedData.payment_info.convenience_fees}</span>
                        </div>
                        <hr className="w-full border-b border-gray-100 my-2" />
                        <div className="flex justify-between items-center font-medium mb-2">
                          <span className="text-lg ">Total to pay:</span>
                          <span className="text-lg text-green-600 tabular-nums">₹ {fetchedData.payment_info.online_payable}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <CountryModal isOpen={countyCodemodalOpen} onClose={() => setCountryCodeModalOpen(false)} onSelectCountry={handleSelectCountry} />
      <SearchModal isOpen={searchForm} onClose={() => setSearchForm(false)} />
    </>
  );
};

export default CartPage;
