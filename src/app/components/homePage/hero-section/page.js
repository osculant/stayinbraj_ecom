"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchModal from "../../searchLocation/page.js";

const LAST_CITY_COOKIE = "last_search_city";
// Cookie getter function
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const HeroSection = () => {
  const router = useRouter();
  const [searchForm, setSearchForm] = useState(false);
  const [searchCookie, setSearchCookie] = useState(null);

  useEffect(() => {
    const recentSearch = getCookie(LAST_CITY_COOKIE);
    setSearchCookie(recentSearch);
  }, []);

  const checkLocation = () => {
    if (!searchCookie) {
      setSearchForm(true);
    } else {
      router.push(`/available-stores?location=${searchCookie}`);
    }
  };

  return (
    <>
      <section className="rounded-2xl overflow-hidden relative bg-gradient-to-r to-red-400 from-red-700 my-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="lg:p-16 p-8 md:w-1/2 lg:text-left text-center">
            <div className="inline-block px-3 lg:pr-6 py-1 rounded-full bg-gradient-to-r from-sky-900 to-yellow-800 text-white text-xs mb-4">Welcome Discount</div>
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white lg:mb-2 mb-8">
              All your <span className="text-yellow-300">grocery</span> <br />
              needs here!
            </h1>
            <p className="text-gray-200 mb-6 max-w-md text-sm lg:block hidden">We have prepared special discount for you on organic breakfast products.</p>
            {!searchCookie ? (
              <button onClick={() => checkLocation()} className="p-3 w-40 rounded-xl border border-red-600 bg-white cursor-pointer hover:text-white hover:bg-red-600">
                Shop Now
              </button>
            ) : (
              <button onClick={() => setSearchForm(true)} className="py-3  w-40 rounded-xl border border-red-600 bg-white cursor-pointer hover:text-white hover:bg-red-600">
                <i className="ri-map-pin-line mr-1"></i>
                <span>{searchCookie}</span>
              </button>
            )}
          </div>
          <div className="md:w-1/2 h-[400px]">
            <img src="/assets/images/hero-section-2.png" loading="lazy" alt="Delivery person with grocery box" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <SearchModal isOpen={searchForm} onClose={() => setSearchForm(false)} />
    </>
  );
};

export default HeroSection;
