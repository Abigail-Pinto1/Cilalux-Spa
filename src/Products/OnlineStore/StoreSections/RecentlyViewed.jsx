import React from "react";
import ProductCard from "./ProductCard";

export default function RecentlyViewed({
  products,
  onAddToCart,
}) {
  if (!products?.length) return null;

  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold mb-10">
          Recently Viewed
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}

        </div>

      </div>

    </section>
  );
}