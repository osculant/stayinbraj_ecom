"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchModal from "../searchLocation/page.js";
import { ENV } from '@/config/env'; 

const LAST_CITY_COOKIE = "last_search_city";

// Cookie getter function
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const Category = () => {
  const router = useRouter(),
    [categories, setCategories] = useState([]),
    [searchForm, setSearchForm] = useState(false),
    [searchCookie, setSearchCookie] = useState(null);

  // Call inside useEffect or after component mounts
  useEffect(() => {
    const recentSearch = getCookie(LAST_CITY_COOKIE);
    setSearchCookie(recentSearch);
  }, []);

  const clickCategory = (catName) => {
    !searchCookie ? setSearchForm(true) : router.push(`/available-stores?location=${searchCookie}&category=${encodeURIComponent(catName)}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${ENV.baseUrl}ecommerce-category`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="flex lg:gap-y-8 gap-y-4 gap-x-4 overflow-x-scroll scrollbar-none mb-8">
        {categories.map((cat, index) => (
          <div className="basis-1/7 rounded-lg p-4 border border-gray-300" key={index}>
            <a onClick={() => clickCategory(cat.name)} className="cursor-pointer flex items-center justify-center flex-col">
              <div className="lg:w-24 lg:h-24 w-48 h-48 rounded-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={(e) => {
                    e.currentTarget.src = "https://i.pinimg.com/736x/7e/fc/ed/7efced3441fc990ce01a21c137a53e60.jpg";
                  }}
                  loading="lazy"
                  className="h-full w-full object-cover rounded-full transform transition-transform duration-600 hover:scale-120"
                />
              </div>
              <p className="text-center text-sm my-2 font-medium truncate w-36 capitalize">{cat.name}</p>
            </a>
          </div>
        ))}
      </div>
      <SearchModal isOpen={searchForm} onClose={() => setSearchForm(false)} />
    </>
  );
};

export default Category;
