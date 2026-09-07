import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Package
} from "lucide-react";

import { motion as Motion } from "framer-motion";

// Backend origin - image URLs stored in the DB are relative (e.g. "/upload/xyz.jpg"),
// which only resolves correctly against the API server, not the Vite dev server.
const API_ORIGIN = "http://localhost:7000";
const resolveImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
};

export default function ProductCard({
  product,
  onAddToCart
}) {
  const discount =
    product.comparePrice &&
    product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) /
            product.comparePrice) *
            100
        )
      : 0;

  // Schema field is `quantity` (with `trackQuantity` controlling whether
  // stock is even tracked) -- there is no `stock` field, so the old
  // `product.stock <= 0` check was always false and never triggered the
  // Sold Out badge/disabled button, regardless of real availability.
  const isTracked = product.trackQuantity !== false;
  const isAvailable = isTracked ? Number(product.quantity ?? 0) > 0 : true;

  return (
    <Motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-2xl"
    >
      <Link to={`/store/product/${product._id}`}>

        <div className="relative h-72 bg-pink-50 overflow-hidden">

          {product.images?.[0]?.url ? (
            <img
              src={resolveImageUrl(product.images[0].url)}
              alt={product.name}
              className="w-full h-full object-contain p-6 transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package
                size={50}
                className="text-gray-300"
              />
            </div>
          )}

          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              -{discount}%
            </div>
          )}

          {!isAvailable && (
            <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
              Sold Out
            </div>
          )}

          <div className="absolute right-4 top-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition">

            <button className="bg-white p-3 rounded-full shadow-lg hover:text-pink-600 transition-colors">
              <Heart size={18} />
            </button>

            <button className="bg-white p-3 rounded-full shadow-lg hover:text-pink-600 transition-colors">
              <Eye size={18} />
            </button>

          </div>
        </div>

      </Link>

      <div className="p-5">

        <span className="text-xs text-gray-500">
          {product.category}
        </span>

        <h3 className="font-semibold mt-2 line-clamp-2 text-gray-900">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">
            (24)
          </span>
        </div>

        <div className="flex items-center gap-2 mt-4">

          <span className="font-bold text-2xl text-pink-600">
            ₵{product.price}
          </span>

          {product.comparePrice > product.price && (
            <span className="line-through text-gray-400">
              ₵{product.comparePrice}
            </span>
          )}

        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={!isAvailable}
          className="w-full mt-5 bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg text-white py-3 rounded-xl flex justify-center items-center gap-2 shadow-md disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none disabled:cursor-not-allowed transition-all"
        >
          <ShoppingCart size={18} />
          {isAvailable ? "Add To Cart" : "Sold Out"}
        </button>

      </div>
    </Motion.div>
  );
}