import React from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function FloatingCart({
  cartCount = 0,
}) {
  return (
    <Link
      to="/cart"
      className="
      fixed
      bottom-24
      right-6
      z-50
      "
    >
      <div className="relative bg-black text-white p-4 rounded-full shadow-2xl">

        <ShoppingBag size={24} />

        {cartCount > 0 && (
          <span
            className="
            absolute
            -top-2
            -right-2
            bg-red-500
            text-white
            text-xs
            px-2
            py-1
            rounded-full
            "
          >
            {cartCount}
          </span>
        )}

      </div>
    </Link>
  );
}