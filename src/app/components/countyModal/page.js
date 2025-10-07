"use client";
import React, { useState, useEffect } from "react";
import { baseUrl } from "./../../config/siteConfig.js";

const CountryModal = ({ isOpen, onClose, onSelectCountry }) => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCountries();
    }
  }, [isOpen]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}ecommerce-country-code`, {
        method: "GET",
        headers: {
          access: "stayinbraj2025osculant",
        },
      });

      const data = await response.json();

      if (data.status) {
        setCountries(data.data);
        setFilteredCountries(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) {
      setFilteredCountries(countries);
    } else {
      const searchLower = search.toLowerCase();
      setFilteredCountries(countries.filter((country) => country.name.toLowerCase().includes(searchLower)));
    }
  }, [search, countries]);

  const handleCountryClick = (country) => {
    onSelectCountry(country); // Pass selected country back to parent
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-[#00070a82] bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg lg:w-1/3 w-full max-h-[70vh] relative mx-4">
        {/* Close Button */}
        <button onClick={onClose} className="h-8 w-8 absolute -top-2 -right-2 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full flex justify-center items-center cursor-pointer">
          <i className="ri-close-line" />
        </button>

        {/* Search */}
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500 outline-0" placeholder="Search Country..." />

        {/* Country List */}
        <div className="overflow-y-auto h-[55vh] countryListContainer my-2">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading countries...</div>
          ) : filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <button onClick={() => handleCountryClick(country)} key={index} className="w-full flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 countryCodeOptions cursor-pointer" data-name={country.name}>
                <img src={country.flag} alt={`${country.name} Flag`} className="w-6 h-4 object-cover" />
                <div className="flex gap-1">
                  <span className="block text-sm text-gray-500">{country.code}</span>
                  <span className="block text-sm text-gray-500">({country.dial_code})</span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No countries found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
