/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../../Store/Features/product/productSlice';
import { addToCart } from '../../Store/Features/cart/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentProduct: product, loading, error } = useSelector((state) => state.products || {});
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (loading || !product) return <div className="p-6 text-center">Loading product...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error loading product: {error}</div>;

  // ✅ Get stock from product
  const stock = product.quantity || product.countInStock || product.stock || 0;
  const isInStock = stock > 0;
  const imageUrl = product.images?.[0]?.url || product.images?.[0] || product.image || 'https://via.placeholder.com/800';

  const onAdd = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: imageUrl,
      price: product.price,
      qty
    }));
    navigate('/store/cart');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-gray-700">{product.description}</p>
        <div className="mt-4">
          <p className="text-xl font-semibold">${product.price}</p>
          
          {/* ✅ FIXED: Show stock status */}
          <p className={`text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
            {isInStock ? `✅ In Stock (${stock} available)` : '❌ Out of Stock'}
          </p>
          
          {isInStock && (
            <>
              <div className="mt-3">
                <label className="mr-2">Qty</label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border p-1 rounded"
                >
                  {[...Array(Math.min(stock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={onAdd} 
                className="mt-4 bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
              >
                Add to Cart
              </button>
            </>
          )}
          
          {!isInStock && (
            <button 
              disabled 
              className="mt-4 bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;