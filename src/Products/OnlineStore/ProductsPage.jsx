import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Grid, List, Star } from 'lucide-react';
import { fetchProduct } from '../../Store/Features/product/productSlice.js';

// Backend origin - image URLs stored in the DB are relative (e.g. "/upload/xyz.jpg"),
// which only resolves correctly against the API server, not the Vite dev server.
const API_ORIGIN = 'http://localhost:7000';
const resolveImageUrl = (url) => {
  if (!url) return '/placeholder.png';
  return url.startsWith('http') ? url : `${API_ORIGIN}${url}`;
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector(state => state.products);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    inStock: false,
  });

  useEffect(() => {
    dispatch(fetchProduct({ limit: 20 }));
  }, [dispatch]);

  const categories = [...new Set(products.map(p => p.category))];
  const priceRanges = [
    { label: 'Under $25', value: '0-25' },
    { label: '$25 - $50', value: '25-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: '100-1000' },
  ];

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.inStock && product.quantity === 0) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (product.price < min || product.price > max) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">Discover our complete collection</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter size={20} />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Category</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio" name="category" value=""
                    checked={filters.category === ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-gray-700">All Categories</span>
                </label>
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio" name="category" value={category}
                      checked={filters.category === category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio" name="priceRange" value=""
                    checked={filters.priceRange === ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-gray-700">All Prices</span>
                </label>
                {priceRanges.map(range => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="radio" name="priceRange" value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="text-pink-600 focus:ring-pink-500 rounded"
                />
                <span className="ml-2 text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {sortedProducts.length} of {products.length} products
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Items Display */}
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedProducts.map(product => (
                <Link
                  key={product._id}
                  to={`/store/product/${product._id}`}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden block hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                  }`}
                >
                  {/* Image container */}
                  <div className={viewMode === 'list' ? 'sm:w-48 h-48 flex-shrink-0' : 'aspect-square relative'}>
                    <img
                      src={resolveImageUrl(product.images?.[0]?.url)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text details container */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-sm text-pink-600 font-medium mb-1">{product.category}</div>
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(product.rating || 0)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-gray-900">${product.price}</span>
                      {product.quantity === 0 && (
                        <span className="text-sm font-medium text-red-500">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}