// components/BannerCarousel.js
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { ENV } from '@/config/env'; 

export default function BannerCarousel() {
  const [banner, setBanner] = useState([]);

  // Fetch banner from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${ENV.baseUrl}ecommerce-advertisement`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            access: "stayinbraj2025osculant",
          },
        });
        const data = await res.json();
        setBanner(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full mb-8">
      <div className="relative w-full overflow-hidden rounded-xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 3000 }}
          loop
          pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[320px]"
        >
          {banner.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src.link}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "https://e7.pngegg.com/pngimages/948/610/png-clipart-hotels-foreign-creative-material-vector-illustration.png";
                }}
                className="w-full h-full object-cover"
                alt={`Banner ${index + 1}`}
              />
            </SwiperSlide>
          ))}

          {/* Custom Arrows */}
          <button ref={prevRef} className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 flex items-center justify-center outline-none focus:outline-none hover:bg-red-300 hover:text-white bg-white text-black p-2 sm:p-1 h-8 cursor-pointer w-8 rounded-full shadow transition">
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <button ref={nextRef} className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 flex items-center justify-center outline-none focus:outline-none hover:bg-red-300 hover:text-white bg-white text-black p-2 sm:p-1 h-8 cursor-pointer w-8 rounded-full shadow transition">
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </Swiper>
      </div>

      {/* Move dots below the image */}
      <div className="custom-swiper-pagination mt-4 flex justify-center gap-2 cursor-pointer"></div>
    </div>
  );
}
