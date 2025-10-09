"use client"; // Only needed if you plan to add interactivity (e.g., useState, onClick)

import React from "react";
import { ENV } from '@/config/env'; 

const Footer = () => {
  return (
    <>
      <footer className="bg-black p-2 lg:hidden block">
        <aside className="text-center text-white">
          <p className="font-bold">
            <a href={ENV.links.company} className="text-lg">
              Osculant Technologies Pvt Ltd
            </a>
            <br />
          </p>
          <p className="text-sm">Copyright © 2025 - All right reserved</p>
        </aside>
      </footer>

      <footer className="px-5 py-10 hidden lg:block bg-white text-black">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="flex flex-wrap py-6 lg:py-8">
            {/* Left Section: Logo and Company Information */}
            <div className="basis-full lg:basis-1/4 flex flex-col justify-center items-start gap-4 mb-6 lg:mb-0">
              <a href={ENV.links.web}>
                <img src={ENV.imageLinks.logo} className="h-16" alt="Stayinbraj Logo" style={{ filter: "none" }} />
              </a>
              <p className="font-semibold text-xs">
                Created By:{" "}
                <a href={ENV.links.company} className="hover:underline">
                  OsculantTechnologies Pvt Ltd
                </a>
              </p>
              <p className="font-semibold text-xs">Providing reliable tech since 2020</p>
              <p className=" text-xs">Copyright © Stayinbraj 2025. All rights reserved.</p>

              {/* Social Media Links */}
              <div className="flex gap-4 mt-2">
                <a href="#" className="text-xl">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#" className="text-xl">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="#" className="text-xl">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
              </div>
            </div>

            {/* StayinBraj Section */}
            <div className="basis-full lg:basis-1/4 sm:px-8 mb-6 lg:mb-0">
              <h2 className="mb-6 text-sm font-bold uppercase">StayinBraj</h2>
              <ul className=" font-medium">
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.aboutUs} className="hover:underline">
                    Who we are?
                  </a>
                </li>
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.aboutUs} className="hover:underline">
                    About
                  </a>
                </li>
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.channelManager} className="hover:underline">
                    Channel Manager
                  </a>
                </li>
              </ul>
            </div>

            {/* Help Center Section */}
            <div className="basis-full lg:basis-1/4 sm:px-8 mb-6 lg:mb-0">
              <h2 className="mb-6 text-sm font-bold uppercase">Help center</h2>
              <ul className=" font-medium">
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.contactUs} className="hover:underline">
                    Customer Care
                  </a>
                </li>
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.contactUs} className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.vendorListing} className="hover:underline">
                    List As Service Partner
                  </a>
                </li>
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.travelAgentListing} className="hover:underline">
                    List As Service Travel Agent
                  </a>
                </li>
              </ul>
            </div>

            {/* Consumer Policy Section */}
            <div className="basis-full lg:basis-1/4 sm:px-8">
              <h2 className="mb-6 text-sm font-bold uppercase">Consumer Policy</h2>
              <ul className=" font-medium">
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.privacyPolicy} className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.terms} className="hover:underline">
                    Terms & Conditions
                  </a>
                </li>
                <li className="mb-4 text-gray-600">
                  <a href={ENV.links.refund} className="hover:underline">
                    Return & Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
