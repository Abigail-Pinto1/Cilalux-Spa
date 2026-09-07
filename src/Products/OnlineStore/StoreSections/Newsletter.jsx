import React from "react";
import { Mail } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900">

      <div className="max-w-4xl mx-auto px-6">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-10 md:p-16 text-center">

          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-5 rounded-full">
              <Mail className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-white text-4xl md:text-5xl font-bold">
            Join Our Community
          </h2>

          <p className="text-gray-300 mt-4 max-w-xl mx-auto">
            Subscribe for exclusive offers, product launches,
            early access sales and premium shopping benefits.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-10">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-300 outline-none"
            />

            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition">
              Subscribe
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}