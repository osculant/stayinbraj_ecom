"use client";

import React from "react";
import { useCardContext } from "../../../context/addToCart.js"; // adjust if needed
import { useRouter } from "next/navigation";

export default function FloatingCartIcon() {
  const { cart } = useCardContext();
  const router = useRouter();

  const viewCart = () => {
    router.push(`/card`);
  };

  // Calculate total quantity of all products across all stores
  // const totalItems = Object.values(cart).reduce((total, store) => {
  //   return total + store.items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  // }, 0);

  const totalItems = Object.values(cart).reduce((total, store) => {
    return total + store.items.length;
  }, 0);

  if (totalItems <= 0) return null;

  return (
    <div className="fixed bottom-8 lg:right-10 right-4 z-50">
      <div className="relative">
        <button onClick={viewCart} className="bg-white text-red-600 border border-red-600 hover:text-white hover:bg-red-600 px-4 py-2 rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer h-16 w-16">
          <span className="ri-shopping-bag-4-line text-2xl"></span>
        </button>
        <div className="absolute top-[-11px] right-0 bg-gradient-to-tr from-yellow-500 to-yellow-800 text-white shadow-lg rounded-full w-6 h-6 flex justify-center items-center">
          <span>{totalItems}</span>
        </div>
      </div>
    </div>
  );
}
