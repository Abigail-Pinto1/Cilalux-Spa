import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="relative overflow-hidden rounded-[40px]">

          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
            alt="promo"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 py-24 px-10 md:px-20">

            <span className="bg-white/10 border border-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-white">
              New Season Collection
            </span>

            <h2 className="text-white text-5xl md:text-7xl font-bold mt-8 max-w-3xl">
              Premium Products
              For Modern Living
            </h2>

            <p className="text-gray-300 max-w-xl mt-6 text-lg">
              Discover curated collections designed to elevate
              your lifestyle and shopping experience.
            </p>

            <Link
              to="/store/products"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full mt-8 font-semibold"
            >
              Explore Collection
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}