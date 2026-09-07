import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Verified Customer",
    text:
      "Absolutely amazing quality. The products exceeded my expectations."
  },

  {
    name: "Michael Lee",
    role: "Verified Customer",
    text:
      "Fast delivery, premium packaging and outstanding customer service."
  },

  {
    name: "Emily Roberts",
    role: "Verified Customer",
    text:
      "One of the best online shopping experiences I've ever had."
  },

  {
    name: "David Brown",
    role: "Verified Customer",
    text:
      "Everything arrived perfectly and exactly as described."
  }
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24">

      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-14">

          <span className="text-indigo-600 font-semibold uppercase tracking-wider">
            Testimonials
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Loved By Customers
          </h2>

        </div>

        <Swiper
          spaceBetween={30}
          breakpoints={{
            640: {
              slidesPerView: 1
            },
            768: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            }
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>

              <div className="bg-white rounded-3xl p-8 shadow-sm h-full">

                <div className="text-yellow-500 text-xl mb-4">
                  ★★★★★
                </div>

                <p className="text-gray-600 leading-relaxed">
                  "{item.text}"
                </p>

                <div className="mt-6">

                  <h4 className="font-bold">
                    {item.name}
                  </h4>

                  <p className="text-gray-500 text-sm">
                    {item.role}
                  </p>

                </div>

              </div>

            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}