import React from "react";
import { motion } from "framer-motion";
import Header from "../productCompo/Header.jsx";

const Home = () => {
  return (
    <>
    <Header/>
    <section className="relative bg-pink-50 py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Discover Your <span className="text-pink-600">Glow</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Transform your beauty routine with premium products. Shop now and
          embrace your radiance!
        </p>
        <button className="mt-6 bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition">
          Explore Products
        </button>
      </motion.div>

      <motion.img
        src="/images/hero-model.png"
        alt="Hero Model"
        className="mt-10 md:mt-0 w-72 md:w-96 rounded-lg object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </section>

    <section className="grid md:grid-cols-2 gap-6 px-6 md:px-20 py-10">
      <div className="bg-pink-100 rounded-xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Limited Time Offer</h2>
          <p className="text-gray-600 mb-4">Buy 2 Get 1 Free on all skincare essentials</p>
        </div>
        <button className="bg-pink-600 text-white px-5 py-2 rounded-full w-max hover:bg-pink-700 transition">
          Shop Now
        </button>
      </div>

      <div className="bg-pink-200 rounded-xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Special Offer</h2>
          <p className="text-gray-600 mb-4">Save 20% on selected beauty products</p>
        </div>
        <button className="bg-white text-pink-700 font-semibold px-5 py-2 rounded-full w-max hover:bg-pink-50 transition">
          View Offers
        </button>
      </div>
    </section>
    
    </>
  );
};

export default Home;
