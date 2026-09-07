import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FooterCTA() {
  return (
    <section className="bg-black text-white py-24">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-5xl md:text-7xl font-bold">
          Ready To Shop?
        </h2>

        <p className="text-gray-400 mt-6 text-lg">
          Discover thousands of products with
          premium quality and exceptional value.
        </p>

        <Link
          to="/store/products"
          className="
          inline-flex
          items-center
          gap-3
          bg-white
          text-black
          px-8
          py-4
          rounded-full
          mt-8
          font-semibold
          "
        >
          Start Shopping
          <ArrowRight size={18} />
        </Link>

      </div>

    </section>
  );
}