import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  /*
   * IMPORTANT:
   * Change this to the actual field used by your Product model
   * once we confirm your backend schema.
   */
  const stock = Number(
    product?.quantity ??
    product?.countInStock ??
    product?.stock ??
    product?.stockQuantity ??
    0
  );

  const isInStock = stock > 0;

  const imageUrl =
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    product?.image ||
    "https://via.placeholder.com/400";

  return (
    <div className="border rounded-lg p-4 flex flex-col bg-white shadow-sm hover:shadow-md transition">

      <img
        src={imageUrl}
        alt={product?.name || "Product"}
        className="w-full h-48 object-cover mb-3 rounded"
      />

      <h3 className="font-semibold text-lg text-gray-800">
        {product?.name}
      </h3>

      <p className="mt-1 text-gray-600">
        ${Number(product?.price || 0).toFixed(2)}
      </p>

      <p
        className={`text-sm mt-2 font-medium ${
          isInStock
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {isInStock
          ? `✅ In Stock (${stock} available)`
          : "❌ Out of Stock"}
      </p>

      <div className="mt-auto pt-4">

        <Link
          to={`/store/product/${product?._id}`}
          className={`inline-block px-4 py-2 rounded ${
            isInStock
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!isInStock) {
              e.preventDefault();
            }
          }}
        >
          {isInStock ? "View Product" : "Out of Stock"}
        </Link>

      </div>
    </div>
  );
};

export default ProductCard;