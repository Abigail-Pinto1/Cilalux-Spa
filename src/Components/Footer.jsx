import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-pink-900 via-yellow-950 to-black text-gray-300 py-16 relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="absolute -top-20 -left-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative container mx-auto px-6 md:px-16 grid md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4 font-serif">Cilalux Beauty Empire</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Experience ultimate relaxation and rejuvenation with our luxury spa treatments designed just for you.
          </p>
          
          <Link to="/adminregister" className="hover:text-rose-300 transition">Admin</Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-rose-300 transition">Home</a></li>
            <li><a href="/services" className="hover:text-rose-300 transition">Services</a></li>
            <li><a href="/contact" className="hover:text-rose-300 transition">Contact</a></li>
            <li><a href="/products" className="hover:text-rose-300 transition">Store</a></li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-rose-300" />
              123 Serenity Lane, Accra, Ghana
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-rose-300" />
              +233 555 123 456
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-rose-300" />
              info@cilalux.com
            </li>
          </ul>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-rose-400/20 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-rose-400/20 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-rose-400/20 transition">
              <Twitter size={20} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="relative mt-12 border-t border-gray-700/40 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-rose-300">Cilalux Empire</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
