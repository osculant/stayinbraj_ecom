"use client";

import React from "react";

const services = () => {
  return (
    <>
      <div className="mb-8 text-white flex lg:flex-row flex-col items-center justify-between gap-4">
        {[
          {
            title: "80+ Stores",
            message: "All Arround Braj",
            icon: "ri-store-2-line",
          },
          {
            title: "Fresh Foods",
            message: "We guarntee quality",
            icon: "ri-cake-3-line",
          },
          {
            title: "Fast delivery",
            message: "Fastest on the market",
            icon: "ri-truck-line",
          },
          {
            title: "Live Tracking",
            message: "Track your order in real time",
            icon: "ri-eye-line",
          },
        ].map((service, index) => {
          return (
            <div className="lg:w-1/4 w-full bg-gradient-to-r to-red-400 from-red-700 p-4 flex flex-col items-center justify-between rounded-md" key={index}>
              <i className={`${service.icon} text-5xl mb-4`}></i>
              <p className="text-lg">{service.title}</p>
              <p className="text-xs">{service.message}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default services;
