import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Truck, Shield, Heart, Share2, Package } from 'lucide-react';
import { fetchProductById } from '../../Store/Features/product/productSlice';
import { addToCart } from '../../Store/Features/cart/cartSlice.js';

// Backend origin - image URLs stored in the DB are relative (e.g. "/upload/xyz.jpg"),
// which only resolves correctly against the API server, not the Vite dev server.
const API_ORIGIN = 'http://localhost:7000';
const resolveImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_ORIGIN}${url}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentProduct: product, loading, error } = useSelector(state => state.products);
  const user = useSelector(state => state.auth.user);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [product?._id]);

  const getProductStock = () => {
    if (!product) return 0;
    return Number(product.quantity ?? 0);
  };

  const productStock = getProductStock();
  const isTracked = product?.trackQuantity !== false;
  const isAvailable = isTracked ? productStock > 0 : true;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/store/login', { state: { from: location } });
      return;
    }

    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.price,
        qty: quantity,
      })
    );

    navigate('/store/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-300 h-96 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Link to="/store/products" className="text-pink-600 hover:text-pink-700">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/store" className="hover:text-pink-600">Home</Link>
        <span>/</span>
        <Link to="/store/products" className="hover:text-pink-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-2xl p-8 mb-4">
            {product.images && product.images.length > 0 ? (
              <img
                src={resolveImageUrl(product.images[selectedImage].url)}
                alt={product.images[selectedImage].alt || product.name}
                className="w-full h-96 object-contain"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Package size={64} />
                  <p className="mt-2">No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-gray-100 rounded-lg p-2 border-2 ${
                    selectedImage === index ? 'border-pink-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={resolveImageUrl(image.url)}
                    alt={image.alt || `thumbnail-${index}`}
                    className="w-full h-20 object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Heart size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating || 4)}
              <span className="text-gray-600 ml-1">({product.numReviews || 24} reviews)</span>
            </div>
            <span className={`${isAvailable ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline space-x-3 mb-2">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              {product.comparePrice && (
                <span className="text-2xl text-gray-500 line-through">${product.comparePrice}</span>
              )}
              {product.comparePrice && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  Save ${(product.comparePrice - product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-gray mb-8">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            {product.sku && (
              <div>
                <span className="font-medium text-gray-900">SKU:</span>
                <span className="ml-2 text-gray-600">{product.sku}</span>
              </div>
            )}
            {product.brand && (
              <div>
                <span className="font-medium text-gray-900">Brand:</span>
                <span className="ml-2 text-gray-600">{product.brand}</span>
              </div>
            )}
            {product.weight?.value != null && (
              <div>
                <span className="font-medium text-gray-900">Weight:</span>
                <span className="ml-2 text-gray-600">{product.weight.value} {product.weight.unit}</span>
              </div>
            )}
            {isTracked && (
              <div>
                <span className="font-medium text-gray-900">Stock:</span>
                <span className="ml-2 text-gray-600">{productStock} units</span>
              </div>
            )}
          </div>

          {/* Add to Cart Actions Block */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={!isAvailable}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                    {!isAvailable ? 0 : quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(prev => (isTracked ? Math.min(productStock, prev + 1) : prev + 1))
                    }
                    disabled={!isAvailable}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isAvailable ? 'Add to Cart' : 'Sold Out'}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <button className="text-pink-600 hover:text-pink-700 font-medium">
              Add to Wishlist
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Truck className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">Free Shipping</span>
              <span className="text-xs text-gray-600">On orders over $50</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium">2-Year Warranty</span>
              <span className="text-xs text-gray-600">Quality guaranteed</span>
            </div>
            <div className="flex flex-col items-center">
              <Star className="text-yellow-600 mb-2" size={24} />
              <span className="text-sm font-medium">5-Star Support</span>
              <span className="text-xs text-gray-600">Dedicated help</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}