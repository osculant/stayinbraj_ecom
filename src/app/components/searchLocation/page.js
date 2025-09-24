"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COOKIE_KEY = "previous_searches";
const LAST_CITY_COOKIE = "last_search_city";

// Cookie Helpers
const setCookie = (name, value, days = 30) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const SearchModal = ({ isOpen, onClose }) => {
  const [previousSearches, setPreviousSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const cookieData = getCookie(COOKIE_KEY);
      const lastCity = getCookie(LAST_CITY_COOKIE);

      if (cookieData) {
        try {
          const parsed = JSON.parse(cookieData);
          if (Array.isArray(parsed)) {
            setPreviousSearches(parsed);
          }
        } catch (e) {
          console.error("Failed to parse cookie", e);
        }
      }

      if (lastCity) {
        setSearchInput(lastCity);
      }
    }
  }, [isOpen]);

  const saveToCookies = (addressObj) => {
    const updated = [addressObj, ...previousSearches.filter((item) => item.city.toLowerCase() !== addressObj.city.toLowerCase())];
    const trimmed = updated.slice(0, 5);
    setPreviousSearches(trimmed);
    setCookie(COOKIE_KEY, JSON.stringify(trimmed), 30);
    setCookie(LAST_CITY_COOKIE, addressObj.city, 1);
  };

  const getUserLocation = () => {
    if (!window.google || !window.google.maps) {
      setError("Google Maps API not loaded.");
      return;
    }

    if (navigator.geolocation) {
      setLoading(true);
      setError("");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            setLoading(false);
            if (status === "OK" && results[0]) {
              const components = results[0].address_components;
              const address = { city: "", state: "", country: "" };

              components.forEach((component) => {
                if (component.types.includes("locality")) address.city = component.long_name;
                else if (component.types.includes("administrative_area_level_1")) address.state = component.long_name;
                else if (component.types.includes("country")) address.country = component.long_name;
              });

              if (address.city) {
                setSearchInput(address.city);
                setSelectedAddress(address);
                saveToCookies(address);
              } else {
                setError("City not found from location.");
              }
            } else {
              setError("Failed to get address.");
            }
          });
        },
        () => {
          setLoading(false);
          setError("Geolocation failed or permission denied.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handlePreviousClick = (item) => {
    setSearchInput(item.city);
    setSelectedAddress(item);
  };

  const handleSearch = () => {
    const cityOnly = searchInput.trim();
    if (!cityOnly) return;

    let fullData = selectedAddress || previousSearches.find((item) => item.city.toLowerCase() === cityOnly.toLowerCase());

    if (!fullData) {
      fullData = { city: cityOnly, state: "", country: "" };
    }

    saveToCookies(fullData);
    router.push(`/available-stores?location=${encodeURIComponent(fullData.city)}`);
  };

  const handleDeleteCity = (cityName) => {
    const updated = previousSearches.filter((item) => item.city.toLowerCase() !== cityName.toLowerCase());
    setPreviousSearches(updated);
    setCookie(COOKIE_KEY, JSON.stringify(updated), 30);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-[#00070a82] flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/10 bg-opacity-40" onClick={onClose}></div>

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col justify-between relative mx-4">
        {/* Input */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center justify-between w-full border rounded-xl">
            <div className="flex items-start w-full p-2">
              <i className="ri-map-pin-line cursor-pointer pr-1" onClick={getUserLocation}></i>
              <input
                type="text"
                name="search"
                className="w-full px-2 focus:outline-0"
                placeholder="Enter city name"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSelectedAddress(null); // reset selection
                }}
              />
            </div>
            <div className="h-full">
              <button onClick={handleSearch} className="border-l bg-red-100 rounded-r-xl px-4 py-2 cursor-pointer">
                <i className="ri-search-line"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Loader/Error */}
        <div className="mt-4 text-sm text-gray-500 text-center">
          {loading && "Fetching your location..."}
          {error && <span className="text-red-500">{error}</span>}
        </div>

        {/* Previous Searches */}
        <div className="px-6 py-4">
          {previousSearches.length > 0 ? (
            <div className="text-sm text-gray-700">
              <p className="mb-2 font-bold text-black">Recent Cities</p>
              <ul className="flex flex-col gap-2">
                {previousSearches.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-red-50 px-3 py-2 rounded-md hover:bg-red-100">
                    <span onClick={() => handlePreviousClick(item)} className="text-red-600 cursor-pointer capitalize">
                      {item.city}
                      {item.state && `, ${item.state}`}
                    </span>
                    <i className="ri-close-line text-black hover:text-red-500 cursor-pointer" onClick={() => handleDeleteCity(item.city)}></i>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-gray-500">No Recent Search</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2 flex justify-end">
          <span className="p-0 text-xs">Search by Stayinbraj</span>
        </div>

        {/* Close Button */}
        <div className="absolute right-[-8px] px-3">
          <i className="ri-close-line cursor-pointer text-lg" onClick={onClose}></i>
        </div>
      </div>
    </div>
  ) : null;
};

export default SearchModal;
