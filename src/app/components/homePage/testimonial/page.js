import React, { useState } from "react";
// Make sure Remix Icon is globally available for `ri-star-line`

const testimonials = [
  {
    name: "Sarah Johnson",
    message: "Amazing grocery delivery service! Fresh vegetables and fruits delivered right to my doorstep. The app is so easy to use and the delivery is always on time. Highly recommend!",
    star: 5,
  },
  {
    name: "Mike Chen",
    message: "Best grocery shopping experience ever! The variety of products is incredible and the prices are very competitive. The delivery guys are always professional and friendly.",
    star: 4,
  },
  {
    name: "Emily Rodriguez",
    message: "I love how convenient this service is. As a busy mom, being able to order groceries online and have them delivered saves me so much time. The quality is always excellent!",
    star: 3,
  },
  {
    name: "David Thompson",
    message: "Fast delivery, fresh products, and great customer service. I've been using this app for months and never had a bad experience. It's become an essential part of my routine.",
    star: 4,
  },
  {
    name: "Lisa Wang",
    message: "The app interface is user-friendly and the product selection is amazing. I can find everything I need for my weekly shopping. The delivery tracking feature is also very helpful!",
    star: 3,
  },
];

const TestimonialCard = ({ name, message, star = 5, isCenter = false }) => {
  return (
    <div className={`rounded-lg p-6 shadow-lg border flex flex-col justify-between transition-all duration-400 ${isCenter ? "shadow-xl border-red-100 bg-red-50" : "shadow-md border-gray-200"}`}>
      <div className="flex flex-col items-center text-center h-full">
        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => {
            // Show filled stars up to 'star', outline after
            const starClass = i < star ? "ri-star-fill" : "ri-star-line";
            return <i key={i} className={`${starClass} text-yellow-400 text-lg`}></i>;
          })}
        </div>

        {/* Avatar */}
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>

        <p className="text-gray-600 leading-relaxed mb-4 italic text-sm sm:text-base line-clamp-8">"{message}"</p>
        <h5 className="text-red-500 font-semibold text-base  sm:text-lg">{name}</h5>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({
        ...testimonials[index],
        position: i,
      });
    }
    return visible;
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="mb-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-4">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">What Our Customers Say</h3>
          <p className="text-sm sm:text-base text-gray-500">Real experiences from real customers</p>
        </div>

        {/* MOBILE: horizontal scroll row */}
        <div className="flex gap-4 overflow-x-auto pb-4 sm:hidden scrollbar-none">
          {testimonials.map((testimonial, idx) => (
            <div key={`${testimonial.name}-${idx}`} className="w-72 flex-shrink-0">
              <TestimonialCard name={testimonial.name} message={testimonial.message} star={testimonial.star} />
            </div>
          ))}
        </div>

        {/* DESKTOP carousel */}
        <div className="hidden sm:flex items-center justify-center gap-6 mb-8">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${currentIndex}`}
              className="w-full sm:max-w-sm transition-all duration-500 ease-in-out transform"
              style={{
                transform: `scale(${index === 1 ? 1 : 0.95})`,
              }}
            >
              <TestimonialCard name={testimonial.name} message={testimonial.message} star={testimonial.star} isCenter={index === 1} />
            </div>
          ))}
        </div>

        {/* Dots for desktop only */}
        <div className="hidden sm:flex justify-center gap-2 mt-2">
          {testimonials.map((_, index) => (
            <button key={index} onClick={() => handleDotClick(index)} className={`focus:outline-none cursor-pointer w-3 h-1 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-red-500 scale-110" : "bg-red-300 hover:bg-red-400"}`} aria-label={`Go to testimonial ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
