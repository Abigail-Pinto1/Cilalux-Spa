import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../Store/Features/cart/cartSlice";
import { Star, Check } from "lucide-react";
import { fetchProduct } from "../../Store/Features/product/productSlice";

const FeaturedProducts = () => {
  const dispatch = useDispatch();

  const {
    items: products = [],
    status,
    error,
  } = useSelector((state) => state.products);

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProduct({ limit: 20 }));
    }
  }, [dispatch, status]);

  const getStock = (product) => {
    return Number(
      product?.quantity ??
      product?.countInStock ??
      product?.stock ??
      product?.stockQuantity ??
      0
    );
  };

  const handleQtyChange = (id, value) => {
    const quantity = Number(value);

    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, quantity || 1),
    }));
  };

  const handleAddToCart = (product) => {
    const stock = getStock(product);

    if (stock <= 0) {
      return;
    }

    const requestedQty = quantities[product._id] || 1;

    const qty = Math.min(
      requestedQty,
      stock
    );

    const imageUrl =
      product?.images?.[0]?.url ||
      product?.images?.[0] ||
      product?.image ||
      "";

    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: imageUrl,
        price: product.price,
        qty,
      })
    );
  };

  if (status === "loading") {
    return (
      <p className="text-center py-10">
        Loading products...
      </p>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Failed to load products.</p>

        {error && (
          <p className="text-sm mt-2">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (!products.length) {
    return (
      <p className="text-center py-10 text-gray-500">
        No products available.
      </p>
    );
  }

  return (
    <section className="py-14 px-6 md:px-20 bg-white">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Featured Products
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {products.map((product) => {

          const stock = getStock(product);

          const isInStock = stock > 0;

          const quantity =
            quantities[product._id] || 1;

          const imageUrl =
            product?.images?.[0]?.url ||
            product?.images?.[0] ||
            product?.image ||
            "https://via.placeholder.com/400";

          return (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition"
            >

              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              <div className="p-4">

                <h3 className="font-semibold text-gray-800">
                  {product.name}
                </h3>

                <div className="flex items-center my-2">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={
                        index < (product.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <p
                  className={`flex items-center text-sm ${
                    isInStock
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <Check
                    size={16}
                    className="mr-1"
                  />

                  {isInStock
                    ? `In stock (${stock})`
                    : "Out of stock"}
                </p>

                <p className="text-lg font-semibold text-pink-700 mt-2">
                  ${Number(product.price || 0).toFixed(2)}
                </p>

                <div className="flex justify-between items-center mt-3">

                  <div className="flex items-center border rounded">

                    <button
                      type="button"
                      className="px-2 py-1 text-gray-500"
                      disabled={!isInStock}
                      onClick={() =>
                        handleQtyChange(
                          product._id,
                          quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={stock || 1}
                      value={quantity}
                      disabled={!isInStock}
                      onChange={(e) =>
                        handleQtyChange(
                          product._id,
                          e.target.value
                        )
                      }
                      className="w-12 text-center border-l border-r outline-none"
                    />

                    <button
                      type="button"
                      className="px-2 py-1 text-gray-500"
                      disabled={
                        !isInStock ||
                        quantity >= stock
                      }
                      onClick={() =>
                        handleQtyChange(
                          product._id,
                          quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                    disabled={!isInStock}
                    className="bg-pink-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isInStock
                      ? "ADD TO CART"
                      : "OUT OF STOCK"}
                  </button>

                </div>

              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default FeaturedProducts;