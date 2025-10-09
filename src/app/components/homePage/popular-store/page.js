"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchModal from "../../searchLocation/page.js";
import { ENV } from '@/config/env'; 

const LAST_CITY_COOKIE = "last_search_city";
// Cookie getter function
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const store = () => {
  const router = useRouter(),
    [searchForm, setSearchForm] = useState(false),
    [searchCookie, setSearchCookie] = useState(null),
    [stores, setStores] = useState([]);

  useEffect(() => {
    const recentSearch = getCookie(LAST_CITY_COOKIE);
    setSearchCookie(recentSearch);
  }, []);

  const seeAllStores = () => {
    !searchCookie ? setSearchForm(true) : router.push(`/available-stores?location=${searchCookie}`);
  };

  const visitNow = (store) => {
    const { store_id: storeId, name } = store;
    router.push(`/store?store_name=${name}&id=${storeId}`);
  };

  // Fetch Stores from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${ENV.baseUrl}ecommerce-stores`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });
        const data = await res.json();
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchStores();
  }, []);

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="lg:text-2xl text-xl">Popular stores</h3>

          <button onClick={seeAllStores} className="outline-none focus:outline-none border border-red-600 text-red-600 lg:px-4 lg:py-2 px-2 py-1 rounded-lg bg-white cursor-pointer hover:text-white hover:bg-red-600">
            View all <i className="ri-arrow-right-line"></i>
          </button>
        </div>

        <div className="flex lg:gap-y-8 gap-y-4 gap-x-4 overflow-x-scroll scrollbar-none">
          {stores.length > 0 ? (
            stores.map((store, index) => (
              <div className="basis-1/4 bg-white rounded-lg min-w-[400px] border border-gray-200" key={index}>
                <div className="w-full h-64 overflow-hidden border-b border-gray-200">
                  <img
                    src={store.image || "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} // fallback image
                    alt={store.name || "store image"}
                    loading="lazy"
                    className="h-full w-full object-cover rounded-t-lg transform transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="px-4 py-2">
                  <div className="mb-4">
                    <h5 className="text-lg truncate capitalize">{store.name || "N/A"}</h5>
                    <div className="text-xs mb-2 capitalize flex gap-x-1">
                      <i className="ri-map-pin-line"></i>
                      <p className="truncate ">{store.address || "N/A"}</p>
                    </div>
                    <div className="text-xs mb-2 capitalize flex gap-x-1">
                      <i className="ri-time-line"></i>
                      <p>{store.opening_time || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-center gap-x-1">
                      <i className="ri-star-fill text-yellow-400" />
                      {store.average_rating > 0 ? (
                        <div>
                          <span className="text-sm font-medium">{store.average_rating ?? "0"}</span>
                          <span className="text-xs text-gray-700"> ({store.reviews + "+" ?? "0"} reviews)</span>
                        </div>
                      ) : (
                        <p className="text-xs">Newly Listed</p>
                      )}
                    </div>
                    <button onClick={() => visitNow(store)} className="text-sm border border-red-600 text-red-700 rounded-lg px-4 py-2 hover:text-white hover:bg-red-600 cursor-pointer">
                      Visit Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">No stores found.</p>
          )}
        </div>
      </div>
      <SearchModal isOpen={searchForm} onClose={() => setSearchForm(false)} />
    </>
  );
};

export default store;
