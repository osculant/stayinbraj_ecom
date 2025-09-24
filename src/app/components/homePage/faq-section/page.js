"use client";
import React, { useState } from "react";

const faqs = [
  {
    question: "What is your return policy?",
    answer: "You can return any item within 30 days of purchase for a full refund.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship worldwide. Delivery times vary based on location.",
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking number via email.",
  },
  {
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled within 12 hours of placement from your account dashboard.",
  },
];

const AccordionFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="lg:mx-32 mx-4 mb-8">
      <h4 className="lg:text-4xl text-2xl font-semibold mb-4 text-center">Frequently Asked Questions</h4>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div onClick={() => toggleAccordion(index)} key={index} className={`border border-gray-200 rounded-lg ${activeIndex === index ? "bg-red-100 border-red-200" : ""}`}>
            <button className="w-full flex text-lg justify-between items-center px-4 py-2 text-left font-medium text-gray-800 focus:outline-none">
              {faq.question}
              <span className="text-2xl">{activeIndex === index ? <i className="ri-arrow-up-s-line"></i> : <i className="ri-arrow-down-s-line"></i>}</span>
            </button>
            <div className={`px-4 pb-4 text-gray-600 text-lg transition-all duration-300  ${activeIndex === index ? "max-h-40 opacity-200 rounded-b-lg" : "hidden max-h-0 overflow-hidden opacity-0"}`}>{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccordionFAQ;
