/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({
  products,
  loading,
  onAddToCart,
}) {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-indigo-600 font-semibold uppercase tracking-widest">
            Featured Collection
          </span>

          <h2 className="text-5xl font-bold mt-4">
            Best Selling Products
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Explore our most loved products carefully selected
            for quality, style and value.
          </p>

        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse"
              >
                <div className="h-72 bg-gray-200 rounded-3xl"></div>

                <div className="h-4 bg-gray-200 mt-4 rounded"></div>

                <div className="h-4 bg-gray-200 mt-2 w-2/3 rounded"></div>

                <div className="h-10 bg-gray-200 mt-4 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}