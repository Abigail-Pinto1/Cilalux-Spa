import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProduct,
} from "../../Store/Features/product/productSlice";
import ProductCard from "./ProductCard";

const ProductList = ({ keyword = "" }) => {
  const dispatch = useDispatch();

  const {
    items: products = [],
    status,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProduct(
        keyword
          ? { keyword }
          : {}
      )
    );
  }, [dispatch, keyword]);

  if (status === "loading") {
    return (
      <div className="p-6 text-center">
        Loading products...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-6 text-center text-red-500">
        <p className="font-semibold">
          Failed to load products.
        </p>

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
      <div className="p-6 text-center text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductList;