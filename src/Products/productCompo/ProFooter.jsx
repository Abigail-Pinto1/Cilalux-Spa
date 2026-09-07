import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const ProFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Cilalux<span className="text-pink-500">beauty</span>
          </h2>
          <p className="text-sm leading-relaxed">
            Redefining beauty with skincare, cosmetics, and premium self-care products for every glow.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Facebook className="w-5 h-5 hover:text-pink-500 cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-pink-500 cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-pink-500 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-pink-400">Home</a></li>
            <li><a href="/shop" className="hover:text-pink-400">Shop</a></li>
            <li><a href="/about" className="hover:text-pink-400">About</a></li>
            <li><a href="/contact" className="hover:text-pink-400">Contact</a></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-pink-400">FAQs</a></li>
            <li><a href="#" className="hover:text-pink-400">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-pink-400">Return Policy</a></li>
            <li><a href="#" className="hover:text-pink-400">Track Order</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Get in Touch</h4>
          <p className="text-sm">Email: support@glowify.com</p>
          <p className="text-sm mt-1">Phone: +1 234 567 890</p>
          <p className="text-sm mt-1">Address: 123 Beauty Ave, New York, USA</p>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Glowify. All Rights Reserved.
      </div>
    </footer>
  );
};

export default ProFooter