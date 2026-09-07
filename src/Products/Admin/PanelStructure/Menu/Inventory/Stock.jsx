// src/Pages/Admin/Stock.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../../../../Store/Features/product/productSlice';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';
import { Package } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const Stock = () => {
  const dispatch = useDispatch();
  const { items: products = [], loading } = useSelector((state) => state.products || {});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  const inStockProducts = products.filter(p => (p.quantity !== undefined ? Number(p.quantity) : 0) > 0);

  const filteredProducts = inStockProducts.filter((p) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!p.name?.toLowerCase().includes(search) && 
          !p.sku?.toLowerCase().includes(search) &&
          !p.category?.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    if (categoryFilter && p.category !== categoryFilter) {
      return false;
    }
    
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
    setCurrentPage(1);
  };

  const filters = [
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      value: categoryFilter,
      options: categories.map(c => ({ value: c, label: c }))
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500 font-medium text-sm">Loading stock...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stock Management</h1>
          <p className="text-sm text-gray-500">Current inventory levels for all in-stock products</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
          In Stock: <span className="text-green-600 font-bold">{inStockProducts.length}</span>
          {filteredProducts.length !== inStockProducts.length && (
            <span className="text-gray-400 text-xs ml-1">
              (filtered: {filteredProducts.length})
            </span>
          )}
        </div>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        filters={filters}
        onFilterChange={(key, value) => {
          if (key === 'category') setCategoryFilter(value);
          setCurrentPage(1);
        }}
        onClearFilters={clearFilters}
        placeholder="Search by product name, SKU or category..."
      />

      {paginatedProducts.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
                    <th className="p-4">SKU</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                  {paginatedProducts.map((p) => {
                    const stockCount = Number(p.quantity);
                    const isLowStock = stockCount <= (p.lowStockAlert || 10);
                    return (
                      <tr key={p._id || p.sku} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-4 font-mono text-xs text-gray-500">{p.sku || 'N/A'}</td>
                        <td className="p-4 font-medium text-gray-900">{p.name}</td>
                        <td className="p-4 text-gray-500">{p.category || 'General'}</td>
                        <td className="p-4 font-semibold">₵{p.price}</td>
                        <td className={`p-4 font-semibold ${isLowStock ? 'text-amber-500' : 'text-gray-700'}`}>
                          {stockCount} units
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                            isLowStock ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                          }`}>
                            {isLowStock ? 'Low Stock Alert' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
        <div className="text-center py-16 bg-white border border-dashed rounded-xl text-gray-400">
          <Package className="mx-auto mb-3" size={48} />
          <p>No in-stock products found.</p>
          {(searchTerm || categoryFilter) && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Stock;