"use client";
import React from "react";

const process = () => {
  return (
    <>
      <div className="mb-16">
        <h3 className="lg:text-2xl text-xl mb-4">How its works?</h3>

        <div className="flex justify-between items-center lg:flex-row flex-col gap-4">
          <div className="lg:w-1/4 w-full flex flex-col justify-between gap-2">
            <div className="w-full h-72 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1580440282860-8555b1ae102c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMDUzMDJ8MHwxfHNlYXJjaHwyMnx8c2hvcHBpbmd8ZW58MXx8fHwxNjczMDA1NTY3&ixlib=rb-4.0.3&q=80&w=1080" alt="select your go-to store" className="h-full w-full object-cover rounded-xl" />

              <div className="absolute bottom-2 left-2 bg-white w-8 h-8 rounded-full flex items-center justify-center">
                <span className="font-medium text-2xl">1</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl">Select your go-to store</span>
              <span className="text-xs text-gray-700 inline-block whitespace-normal wrap-break-word">Browse and find stores you’ll love near you!</span>
            </div>
          </div>
          <div className="lg:w-1/4 w-full flex flex-col justify-between gap-2">
            <div className="w-full h-72 overflow-hidden relative">
              <img src="https://i.pinimg.com/736x/08/d0/dc/08d0dceafcdcab7687612a4508a4c708.jpg" alt="Shop" className="h-full w-full object-cover rounded-xl" />

              <div className="absolute bottom-2 left-2 bg-white w-8 h-8 rounded-full flex items-center justify-center">
                <span className="font-medium text-2xl">2</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl">Shop</span>
              <span className="text-xs text-gray-700 inline-block whitespace-normal wrap-break-word">Everything you need, without leaving the couch!</span>
            </div>
          </div>
          <div className="lg:w-1/4 w-full flex flex-col justify-between gap-2">
            <div className="w-full h-72 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1543499459-d1460946bdc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMDUzMDJ8MHwxfHNlYXJjaHwxOHx8ZGVsaXZlcnl8ZW58MXx8fHwxNjczMDA1MjI0&ixlib=rb-4.0.3&q=80&w=1080" alt="Wait for delivery" className="h-full w-full object-cover rounded-xl" />

              <div className="absolute bottom-2 left-2 bg-white w-8 h-8 rounded-full flex items-center justify-center">
                <span className="font-medium text-2xl">3</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl">Wait for delivery</span>
              <span className="text-xs text-gray-700 inline-block whitespace-normal wrap-break-word">Know where your order is, every step of the way!</span>
            </div>
          </div>
          <div className="lg:w-1/4 w-full flex flex-col justify-between gap-2">
            <div className="w-full h-72 overflow-hidden relative">
              <img src="https://i.pinimg.com/736x/cd/89/62/cd896296d9da356b8173eb5ef4176315.jpg" alt="Savor every bite" className="h-full w-full object-cover rounded-xl" />

              <div className="absolute bottom-2 left-2 bg-white w-8 h-8 rounded-full flex items-center justify-center">
                <span className="font-medium text-2xl">4</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl">Savor every bite!</span>
              <span className="text-xs text-gray-700 inline-block whitespace-normal wrap-break-word">Share your experience — leave a review today!</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default process;
