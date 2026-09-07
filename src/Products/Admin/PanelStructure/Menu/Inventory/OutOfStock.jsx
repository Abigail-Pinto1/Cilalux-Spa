// src/Pages/Admin/OutOfStock.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../../../../Store/Features/product/productSlice';
import { AlertTriangle, Plus, RefreshCw, Package, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';


const ITEMS_PER_PAGE = 10;

const OutOfStock = () => {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products);
  const products = productsState?.items || [];
  const loading = productsState?.loading || false;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProduct({ limit: 100 }));
  }, [dispatch]);

  const soldOutItems = products.filter(p => (p.quantity !== undefined ? Number(p.quantity) : 0) <= 0);

  const filteredItems = soldOutItems.filter((item) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!item.name?.toLowerCase().includes(search) && 
          !item.sku?.toLowerCase().includes(search) &&
          !item.category?.toLowerCase().includes(search)) {
        return false;
      }
    }
    return true;
  });

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500 font-medium text-sm">Scanning stock sheets for empty inventory items...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Restock Radar</h1>
          <p className="text-sm text-gray-500">Monitor out-of-stock inventory variations that require vendor procurement replenishment</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-red-50 text-red-700 border border-red-100 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2">
            <AlertTriangle size={16} className="animate-bounce" />
            Critical Alert Items: {soldOutItems.length}
          </div>
        </div>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        filters={[]}
        onFilterChange={() => {}}
        onClearFilters={clearFilters}
        placeholder="Search by product name, SKU or category..."
      />

      {paginatedItems.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-3.5 px-4">SKU Reference</th>
                    <th className="py-3.5 px-4">Product Identity Name</th>
                    <th className="py-3.5 px-4">Category Group</th>
                    <th className="py-3.5 px-4">Unit Value</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4 text-center">Procurement Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedItems.map((item) => (
                    <tr key={item._id} className="hover:bg-red-50/10 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs text-gray-500 uppercase">
                        {item.sku || "N/A"}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {item._id}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-500 font-medium">
                        {item.category || "General Spa"}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">
                        ₵{Number(item.price).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-100 text-red-800 animate-pulse">
                          Sold Out
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Link
                          to={`/admin/edit-product/${item._id}`}
                          className="inline-flex items-center gap-1.5 text-xs bg-gray-900 text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                        >
                          <RefreshCw size={12} />
                          Update Stock
                        </Link>
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
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="p-3.5 bg-green-50 rounded-xl text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-base">Inventory Matrix Fully Hydrated</p>
            <p className="text-xs text-gray-400 mt-0.5">Excellent! All products listed inside your catalog database have active stock units.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutOfStock;