import React from "react";
import { Link } from "react-router-dom";

// Backend origin - image URLs stored in the DB are relative (e.g. "/upload/xyz.jpg"),
// which only resolves correctly against the API server, not the Vite dev server.
const API_ORIGIN = "http://localhost:7000";
const resolveImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
};

export default function CategorySection({ categories, products }) {
  const icons = {
    Electronics: "📱",
    Clothing: "👕",
    Beauty: "💄",
    Sports: "⚽",
    Wellness: "🧘",
    Accessories: "👜",
  };

  const getCategoryProducts = (category) =>
    products.filter((p) => p.category === category);

  const getCount = (category) => getCategoryProducts(category).length;

  // Use the first available image from any product in this category
  // (source.unsplash.com's keyword endpoint was shut down in 2023 --
  // it will always fail now, so we use real product images instead).
  const getCategoryImage = (category) => {
    const categoryProducts = getCategoryProducts(category);
    const withImage = categoryProducts.find((p) => p.images?.[0]?.url);
    return withImage ? resolveImageUrl(withImage.images[0].url) : null;
  };

  if (!categories.length) return null;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-5xl font-bold">Shop Categories</h2>
            <p className="text-gray-500 mt-2">Discover products by category</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const imageUrl = getCategoryImage(category);

            return (
              <Link key={category} to={`/store/category/${category}`} className="group">
                <div className="relative h-72 rounded-3xl overflow-hidden bg-gray-200">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    // Fallback tile when no product in this category has an image yet
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-400">
                      <span className="text-7xl opacity-70">{icons[category] || "✨"}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40" />

                  <div className="absolute bottom-6 left-6">
                    <div className="text-4xl mb-2">{icons[category] || "✨"}</div>
                    <h3 className="text-white text-2xl font-bold">{category}</h3>
                    <span className="text-white/80">{getCount(category)} Products</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}