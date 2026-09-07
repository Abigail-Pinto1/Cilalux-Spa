// src/Pages/Admin/Products.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Package, AlertCircle } from "lucide-react";
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';


const ITEMS_PER_PAGE = 10;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:7000/api/admin/products");
      setProducts(data);
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!product.name?.toLowerCase().includes(search) && 
          !product.category?.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    // Category filter
    if (categoryFilter && product.category !== categoryFilter) {
      return false;
    }
    
    // Stock filter
    if (stockFilter === 'out_of_stock' && product.quantity > 0) return false;
    if (stockFilter === 'low_stock' && (product.quantity === 0 || product.quantity > 10)) return false;
    if (stockFilter === 'in_stock' && product.quantity === 0) return false;
    
    return true;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStockFilter('');
    setCurrentPage(1);
  };

  const filters = [
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      value: categoryFilter,
      options: categories.map(c => ({ value: c, label: c }))
    },
    {
      key: 'stock',
      label: 'Stock Status',
      type: 'select',
      value: stockFilter,
      options: [
        { value: 'in_stock', label: 'In Stock' },
        { value: 'low_stock', label: 'Low Stock (< 10)' },
        { value: 'out_of_stock', label: 'Out of Stock' }
      ]
    }
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-gray-500 font-medium text-sm">Loading products...</div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-sm">
      <AlertCircle size={18} />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
          <p className="text-sm text-gray-500">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
            Total: <span className="text-indigo-600 font-bold">{products.length}</span>
            {filteredProducts.length !== products.length && (
              <span className="text-gray-400 text-xs ml-2">
                (filtered: {filteredProducts.length})
              </span>
            )}
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        filters={filters}
        onFilterChange={(key, value) => {
          if (key === 'category') setCategoryFilter(value);
          if (key === 'stock') setStockFilter(value);
          setCurrentPage(1);
        }}
        onClearFilters={clearFilters}
        placeholder="Search by product name or category..."
      />

      {paginatedProducts.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {p.images?.[0]?.url ? (
                              <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-full h-full p-2 text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{p.category || 'Uncategorized'}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {p.currency || 'GHS'} {Number(p.price || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={p.quantity > 10 ? 'text-green-600' : p.quantity > 0 ? 'text-amber-600' : 'text-red-600'}>
                          {p.quantity || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.quantity === 0 ? 'bg-red-100 text-red-700' :
                          p.quantity < 10 ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {p.quantity === 0 ? 'Out of Stock' :
                           p.quantity < 10 ? 'Low Stock' :
                           'In Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Package size={24} /></div>
          <p className="text-sm font-medium">No products found.</p>
          {(searchTerm || categoryFilter || stockFilter) && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;