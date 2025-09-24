"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Product = ({ featureProduct }) => {
  const router = useRouter();
  // const viewList = (info) => {
  //   const { unique_id: unqId, store_name } = info;
  //   router.push(`/store?store_name=${store_name}&id=${unqId}`);
  // };

  const viewProduct = (info) => {
    const { product_id: productId, store_id: storeId } = info;
    router.push(`/product-info?product_id=${productId}&id=${storeId}`);
  };

  return (
    <>
      <div className="flex gap-x-4 overflow-x-auto scrollbar-none mb-8">
        {featureProduct.map((pro, index) => {
          const images = Array.isArray(pro.img) ? pro.img : [pro.img || "https://i.pinimg.com/736x/05/a7/b8/05a7b8f050d194205ddd286ab91490ab.jpg"];

          return (
            <div className="lg:basis-1/6 w-[240px] lg:w-0 flex-shrink-0 flex-grow-0 rounded-lg bg-white border border-gray-300" key={pro.id || `product-${index}`}>
              <div className="flex justify-between flex-col relative">
                {/* Discount Ribbon */}
                {pro.discount_amount > 0 && (
                  <div className="z-[100] absolute overflow-hidden top-0 left-0 rounded-tl-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">
                      <path fill="#e7000b" d="M0 3v27.748c0 .427.47.69.834.465l3.64-2.24a1.64 1.64 0 0 1 1.72 0l3.613 2.224a1.64 1.64 0 0 0 1.72 0l3.613-2.223a1.641 1.641 0 0 1 1.72 0l3.613 2.223a1.64 1.64 0 0 0 1.72 0l3.614-2.223a1.64 1.64 0 0 1 1.72 0l3.64 2.24a.547.547 0 0 0 .833-.466V0H3a3 3 0 0 0-3 3Z" />
                    </svg>
                    <p className="absolute top-0 text-center font-title text-white px-[4px] pt-[1.75px] text-[0.6rem]" style={{ width: "36.6667px", lineHeight: "12px" }}>
                      {pro.discount || 0}% Off
                    </p>
                  </div>
                )}

                {/* Product Image */}
                <div className="w-full h-48 overflow-hidden rounded-t-lg mb-2">
                  <img src={images[0]} alt={pro.name || "product image"} loading="lazy" className="h-full w-full object-cover object-center transform transition-transform duration-700 hover:scale-110" />
                </div>

                {/* Product Info */}
                <div className="flex flex-col px-2 mb-2">
                  <p className="text-lg truncate lg:w-48 w-72 capitalize">{pro.name}</p>
                  <span className="text-xs text-gray-600">{pro.quantity}</span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between px-2 mb-2">
                  {pro.discount <= 0 ? (
                    <p className="text-sm font-light p-0">
                      &#8377;
                      <span className="text-lg"> {pro.final_price}</span>
                    </p>
                  ) : (
                    <div className="flex flex-row items-center justify-center gap-x-2">
                      <span className="text-xs text-gray-500 line-through p-0">&#8377;{pro.price}</span>
                      <span className="text-sm font-light p-0">
                        &#8377;
                        <span className="text-lg"> {pro.final_price}</span>
                      </span>
                    </div>
                  )}
                  <button onClick={() => viewProduct(pro)} className="w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full cursor-pointer">
                    <i className="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Product;
