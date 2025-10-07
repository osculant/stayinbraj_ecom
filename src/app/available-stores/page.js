"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

import { baseUrl } from "./../config/siteConfig.js";

import AddCarosuel from "../components/addCarousel/page.js";
import SearchModal from "../components/searchLocation/page.js";
import Categories from "../components/categories/page.js";

const Filters = ({ filterOpen, storeCategory, selectedCategories, handleCategoryToggle, ratingFilter, setRatingFilter, minOrderFilter, setMinOrderFilter, handleResetFilters }) => {
  return (
    <>
      <aside className={`${filterOpen ? "" : "lg:block hidden"}`}>
        <div className="border border-red-200 bg-white py-4 px-5 mb-4 rounded-lg">
          <p className="mb-3 text-sm font-semibold text-black ">Category</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-800">
            {storeCategory.map((cat, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-red-600 w-4 h-4 rounded border-2 border-red-600 focus:ring-0 cursor-pointer" checked={selectedCategories.includes(cat.id?.toString())} onChange={() => handleCategoryToggle(cat.id?.toString())} />
                <span className="capitalize">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border border-red-200 bg-white py-4 px-5 mb-4 rounded-lg">
          <p className="mb-4 text-sm font-semibold text-black">By Rating</p>
          <div className="flex flex-col gap-3 text-sm text-gray-800">
            {[5, 4, 3].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rating" value={rating} checked={ratingFilter === String(rating)} onChange={(e) => setRatingFilter(e.target.value)} className="accent-red-600 w-4 h-4 rounded border-2 border-red-600 focus:ring-0 cursor-pointer" />
                <span>
                  {rating} Stars{rating !== 5 && " & above"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border border-red-200 bg-white py-4 px-5 rounded-lg mb-4">
          <p className="mb-3 text-sm font-semibold text-black">Min Order Amount</p>
          <div className="flex flex-col gap-3 text-sm text-gray-800">
            {[50, 100, 150].map((amount) => (
              <label key={amount} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="amount" value={amount} checked={minOrderFilter === String(amount)} onChange={(e) => setMinOrderFilter(e.target.value)} className="accent-red-600 w-4 h-4 rounded border-2 border-red-600 focus:ring-0 cursor-pointer" />
                <span>₹{amount} or less</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={handleResetFilters} className="my-2 text-sm border border-gray-400 text-black rounded-lg px-4 py-2 bg-gray-400 w-full cursor-pointer">
          Reset Filters
        </button>
      </aside>
    </>
  );
};

const AvailableStore = () => {
  const searchParams = useSearchParams(),
    router = useRouter(),
    location = searchParams.get("location") || "",
    category = searchParams.get("category") || "";

  const [stores, setStores] = useState([]),
    [loading, setLoading] = useState(true),
    [apiError, setApiError] = useState(""),
    [ratingFilter, setRatingFilter] = useState(""),
    [minOrderFilter, setMinOrderFilter] = useState(""),
    [searchText, setSearchText] = useState(""),
    [searchForm, setSearchForm] = useState(false),
    [searchingTab, setSearchingTab] = useState("searchIcon"),
    [storeCategory, setStoreCategory] = useState([]),
    [selectedCategories, setSelectedCategories] = useState([]),
    [isFilterOpen, setIsFilterOpen] = useState(false);

  const visitNow = (store) => {
    const { store_id: storeId, name } = store;
    router.push(`/store?store_name=${name}&id=${storeId}`);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);

        let route = category ? `${baseUrl}ecommerce-available-store?location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}` : `${baseUrl}ecommerce-available-store?location=${encodeURIComponent(location)}`;

        const res = await fetch(route, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });

        const data = await res.json();

        if (data.status) {
          const { stores, store_category } = data.data;
          const safeStores = Array.isArray(stores)
            ? stores.map((store) => ({
                ...store,
                images: Array.isArray(store.images) ? store.images : [],
              }))
            : [];

          setStores(safeStores);
          setStoreCategory(store_category);
          setApiError("");
        } else {
          setStores([]);
          setApiError("No stores found for this location");
        }
        setSearchForm(false);
      } catch (error) {
        setStores([]);
        setApiError("Failed to fetch stores. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [location, category]);

  const handleCategoryToggle = (id) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]));
  };

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchRating = ratingFilter ? Number(store.average_rating) >= Number(ratingFilter) : true;
      const matchMinOrder = minOrderFilter ? Number(store.min_product_price || 0) <= Number(minOrderFilter) : true;
      const matchSearchText = searchText ? store.name?.toLowerCase().includes(searchText.toLowerCase()) : true;
      const matchCategory = selectedCategories.length > 0 ? selectedCategories.includes(store.type_id?.toString()) : true;
      return matchRating && matchMinOrder && matchSearchText && matchCategory;
    });
  }, [stores, ratingFilter, minOrderFilter, searchText, selectedCategories]);

  const handleResetFilters = () => {
    setRatingFilter("");
    setMinOrderFilter("");
    setSelectedCategories([]);
    setSearchText("");
  };

  const isEmptyFromCategoryOnly = !loading && stores.length === 0 && category !== "";
  const isEmptyFromLocationOnly = !loading && stores.length === 0 && category === "";

  const isEmptyFromApi = !loading && stores.length === 0;
  const isEmptyFromFilters = !loading && stores.length > 0 && filteredStores.length === 0;

  const activeFilterCount = (selectedCategories?.length || 0) + (ratingFilter ? 1 : 0) + (minOrderFilter ? 1 : 0);

  return (
    <>
      {/* CASE 1: LOADING */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-opacity-50 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg font-medium">Please wait, Stayinbraj is responding...</p>
          </div>
        </div>
      ) : isEmptyFromCategoryOnly ? (
        <>
          {/* CASE 2: Category selected but no stores */}
          <div className="lg:m-8 mx-4 my-8">
            <AddCarosuel />
            <Categories />
            <div className="text-center text-gray-600 py-16 flex flex-col items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" // example illustration
                alt="No stores found"
                className="w-40 h-40 mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-700">No stores available for this category</h3>
              <span className="text-xs mb-4">Try selecting a different category or change your location </span>
              <div onClick={() => setSearchForm(true)} className="ri-map-pin-line text-2xl text-red-600 cursor-pointer uppercase">
                {location}
              </div>
            </div>
          </div>
        </>
      ) : isEmptyFromLocationOnly ? (
        <>
          {/* CASE 3: No store for location */}
          <div className="min-h-screen flex items-center justify-center flex-col text-center text-gray-600">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" // example store not found image
              alt="No stores available"
              className="w-64 h-64"
            />
            <span className="text-lg mb-4">No stores available in this location </span>
            <div onClick={() => setSearchForm(true)} className="ri-map-pin-line text-2xl text-red-600 cursor-pointer uppercase">
              {location}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* CASE 4: Stores available */}
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css" />
          <Script
            src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js"
            strategy="afterInteractive"
            onLoad={() => {
              if (typeof window !== "undefined" && window.Fancybox) {
                window.Fancybox.bind("[data-fancybox]", {
                  Thumbs: { autoStart: true },
                });
              }
            }}
          />
          <div className="lg:m-8 mx-4 my-8">
            <AddCarosuel />
            <Categories />

            <div className="flex lg:justify-between justify-end items-center mb-4 sticky top-5 z-10 bg-white/80 backdrop-blur shadow-sm px-4 py-2 rounded-md">
              <h3 className="lg:text-xl text-lg hidden lg:block">Available Stores </h3>
              <div className="flex gap-x-2">
                {searchingTab === "searchIcon" ? (
                  <button onClick={() => setSearchingTab("searchingInput")} className="text-red-600 bg-white px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white border border-red-600 flex gap-x-2 cursor-pointer">
                    <i className="ri-search-line"></i>
                  </button>
                ) : (
                  <div className="overflow-hidden">
                    <div className="flex items-center border border-red-600 rounded-md bg-white animate-carpetExpand px-2 py-2 gap-x-2">
                      <input type="text" name="search" className="w-full px-2 focus:outline-0" placeholder="Search Store ..." autoFocus value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                      <i className="ri-close-circle-line text-black hover:text-red-600 cursor-pointer" onClick={() => setSearchingTab("searchIcon")}></i>
                    </div>
                  </div>
                )}
                <button onClick={() => setSearchForm(true)} className="text-red-600 bg-white px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white border border-red-600 flex gap-x-2 cursor-pointer">
                  <i className="ri-map-pin-line"></i>
                  {location}
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Mobile filter button */}
              <div className="lg:hidden fixed bottom-4 right-4 z-40">
                <button onClick={() => setIsFilterOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                  <span>Filters</span>
                  <i className="ri-filter-3-line"></i>
                  {activeFilterCount > 0 && <span className="bg-white text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>}
                </button>
              </div>

              {/* Filters */}
              {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                  {/* Background Overlay */}
                  <div className="absolute inset-0 bg-black/10 bg-opacity-40" onClick={() => setIsFilterOpen(false)}></div>

                  {/* Bottom Sheet */}
                  <div className="relative bg-white w-full h-1/2 rounded-t-2xl z-50 shadow-lg animate-slideUp flex flex-col">
                    {/* Sticky Header Area */}
                    <div className="sticky top-0 bg-white z-10">
                      {/* Drag Indicator */}
                      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" onClick={() => setIsFilterOpen(false)}></div>

                      {/* Header */}
                      <div className="flex justify-between items-center px-4 pb-3 border-b border-gray-400">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <button onClick={() => setIsFilterOpen(false)} className="text-red-500 font-medium">
                          Close ✕
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <Filters filterOpen={isFilterOpen} storeCategory={storeCategory} selectedCategories={selectedCategories} handleCategoryToggle={handleCategoryToggle} ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} minOrderFilter={minOrderFilter} setMinOrderFilter={setMinOrderFilter} handleResetFilters={handleResetFilters} />
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Filters */}

              <div className="lg:block hidden w-full sm:w-1/4">
                <Filters filterOpen={isFilterOpen} storeCategory={storeCategory} selectedCategories={selectedCategories} handleCategoryToggle={handleCategoryToggle} ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} minOrderFilter={minOrderFilter} setMinOrderFilter={setMinOrderFilter} handleResetFilters={handleResetFilters} />
              </div>

              {/* Store Grid (reuse your original UI here) */}
              {isEmptyFromFilters ? (
                <>
                  <div className="w-full lg:w-3/4 flex flex-col items-center justify-center text-center py-10">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" // Replace with your image path
                      alt="No results"
                      className="w-48 h-48 object-contain mb-6 opacity-90"
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Stores Found</h3>
                    <p className="text-gray-500 text-lg max-w-md">We couldn’t find any stores that match your filters. Try adjusting your filters to see more results.</p>
                  </div>
                </>
              ) : (
                <>
                  <main className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStores.map((store, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md flex flex-col h-[460px]">
                        {/* Main Image */}
                        <div className="w-full h-64 overflow-hidden border-b border-gray-200">
                          <a href={store.image || "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} data-fancybox={`gallery-${index}`} data-caption={store.name || "Store Image"}>
                            <img src={store.image || "https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"} alt={store.name || "store image"} className="h-full w-full object-cover rounded-t-lg transform transition-transform duration-700 hover:scale-110" loading="lazy" />
                          </a>
                        </div>

                        {/* Thumbnail Images */}
                        {store.images.length > 0 ? (
                          <div className="flex gap-2 mt-2 px-4">
                            {store.images.slice(0, 3).map((img, i) => (
                              <div key={i} className="w-12 h-12 relative">
                                <a href={img} data-fancybox={`gallery-${index}`} data-caption={`Image ${i + 1}`}>
                                  <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover rounded border" />
                                </a>
                              </div>
                            ))}

                            {/* 4th with +N overlay */}
                            {store.images.length > 3 && (
                              <div className="w-12 h-12 relative">
                                <a href={store.images[3]} data-fancybox={`gallery-${index}`} data-caption={`Image 4`}>
                                  <img src={store.images[3]} alt="Thumb 4" className="w-full h-full object-cover rounded border" />
                                  <div className="absolute inset-0 bg-red-600 bg-opacity-60 flex items-center justify-center text-white font-semibold text-sm rounded">+{store.images.length - 3}</div>
                                </a>

                                {/* Hidden preload */}
                                {store.images.slice(4).map((img, i) => (
                                  <a key={`hidden-${i}`} href={img} data-fancybox={`gallery-${index}`} data-caption={`Image ${i + 5}`} className="hidden" />
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-2 px-4">
                            <div className="w-12 h-12 relative">
                              <a
                                href="https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg"
                                data-fancybox={`gallery-${index}`} // 🔧 Use the correct index here too
                                data-caption="Default Store Image"
                              >
                                <img src="https://i.pinimg.com/736x/0b/88/68/0b8868d98431f2deafe14361efcd3911.jpg" alt="Default Thumb" className="w-full h-full object-cover rounded border transform transition-transform duration-700 hover:scale-110" />
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Info */}
                        <div className="px-4 py-2 flex flex-col justify-between flex-grow">
                          <div>
                            <h5 className="text-lg truncate capitalize">{store.name || "N/A"}</h5>
                            <p className="text-xs capitalize flex items-center gap-x-1 mb-1 truncate">
                              <i className="ri-map-pin-line" />
                              {store.address || "N/A"}
                            </p>

                            <p className="text-xs capitalize flex items-center gap-x-1 mb-1">
                              <i className="ri-time-line" />
                              {store.opening_time || "N/A"}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-x-1 text-sm">
                              <i className="ri-star-fill text-yellow-400" />
                              {store.average_rating > 0 ? (
                                <>
                                  <span>{store.average_rating ?? "0"}</span>
                                  <span className="text-xs text-gray-700">({store.reviews + "+" ?? "0"} reviews)</span>
                                </>
                              ) : (
                                <span className="text-xs">Newly Listed</span>
                              )}
                            </div>
                            <div className="flex items-center gap-x-1 text-red-600 text-sm">
                              <i className="ri-handbag-line" />
                              Min. ₹{store.min_product_price || "N/A"}
                            </div>
                          </div>

                          <button onClick={() => visitNow(store)} className="my-2 text-sm border border-red-600 text-red-700 rounded-lg px-4 py-2 hover:text-white hover:bg-red-600 w-full cursor-pointer">
                            Shop Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </main>
                </>
              )}
            </div>

            <style jsx>{`
              @keyframes slideUp {
                from {
                  transform: translateY(100%);
                }
                to {
                  transform: translateY(0);
                }
              }
              .animate-slideUp {
                animation: slideUp 0.3s ease-out;
              }
            `}</style>
          </div>
        </>
      )}

      <SearchModal isOpen={searchForm} onClose={() => setSearchForm(false)} />
    </>
  );
};

export default AvailableStore;
