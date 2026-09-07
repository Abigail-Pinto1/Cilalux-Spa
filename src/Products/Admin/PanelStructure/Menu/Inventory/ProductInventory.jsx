/* eslint-disable react-hooks/exhaustive-deps */
// src/Pages/Admin/ProductInventory.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../../Store/Features/product/productSlice";
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';
import { Search, Package, AlertCircle } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const ProductInventory = () => {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products);
  const products = productsState?.items || [];
  const loading = productsState?.loading || false;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProduct({ limit: 100 }));
  }, [dispatch]);

  // Extract categories after products load
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const stockCount = p.quantity !== undefined ? Number(p.quantity) : 0;
    
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!p.name?.toLowerCase().includes(search) && 
          !p.category?.toLowerCase().includes(search) &&
          !p.sku?.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    // Category filter
    if (categoryFilter && p.category !== categoryFilter) {
      return false;
    }
    
    // Stock filter
    if (stockFilter === 'out_of_stock' && stockCount > 0) return false;
    if (stockFilter === 'low_stock' && (stockCount === 0 || stockCount > 10)) return false;
    if (stockFilter === 'in_stock' && stockCount === 0) return false;
    if (stockFilter === 'low_stock' && stockCount === 0) return false;
    
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
        { value: 'in_stock', label: 'In Stock (> 10)' },
        { value: 'low_stock', label: 'Low Stock (1-10)' },
        { value: 'out_of_stock', label: 'Out of Stock (0)' }
      ]
    }
  ];

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading live store inventory...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
          <p className="text-gray-500 text-sm">Real-time stock management from database</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm">
            Total: <span className="font-bold">{products.length}</span>
            {filteredProducts.length !== products.length && (
              <span className="text-gray-400 text-xs ml-1">
                (filtered: {filteredProducts.length})
              </span>
            )}
          </div>
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
        placeholder="Search by product name, SKU or category..."
      />

      {paginatedProducts.length > 0 ? (
        <>
          <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 font-medium text-sm">
                  <th className="p-4 text-left">SKU</th>
                  <th className="p-4 text-left">Product Name</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock Quantity</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                {paginatedProducts.map((p) => {
                  const stockCount = p.quantity !== undefined ? Number(p.quantity) : 0;
                  const isLowStock = stockCount > 0 && stockCount <= (p.lowStockAlert || 10);

                  return (
                    <tr key={p._id || p.sku} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4 font-mono text-xs text-gray-500">{p.sku || "N/A"}</td>
                      <td className="p-4 font-medium text-gray-900">{p.name}</td>
                      <td className="p-4 text-gray-500">{p.category || "General"}</td>
                      <td className="p-4 font-semibold">₵{p.price}</td>
                      <td className={`p-4 font-semibold ${stockCount === 0 ? "text-red-500" : isLowStock ? "text-amber-500" : "text-gray-700"}`}>
                        {stockCount} units
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                          stockCount === 0 
                            ? "bg-red-50 text-red-700" 
                            : isLowStock 
                            ? "bg-amber-50 text-amber-700" 
                            : "bg-green-50 text-green-700"
                        }`}>
                          {stockCount === 0 ? "Out of Stock" : isLowStock ? "Low Stock Alert" : "In Stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
          <p>No inventory assets found.</p>
          {(searchTerm || categoryFilter || stockFilter) && (
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

export default ProductInventory;