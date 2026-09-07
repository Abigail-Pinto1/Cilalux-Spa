// src/Pages/Admin/Analytics.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Zap, AlertTriangle, TrendingUp, BarChart3, Package, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAllOrders } from '../../../../../Store/Features/orders/orderSlice';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';

const ITEMS_PER_PAGE = 5;

const Analytics = () => {
  const dispatch = useDispatch();
  const { items: sales = [], loading } = useSelector((state) => state.orders || {});
  
  // Pagination state for fast selling items
  const [fastPage, setFastPage] = useState(1);
  const [slowPage, setSlowPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => { 
    dispatch(fetchAllOrders()); 
  }, [dispatch]);

  // Data processing engine
  const getProductVelocityMetrics = () => {
    const productMap = {};

    sales.forEach((sale) => {
      const itemsList = sale.products || [{ 
        productName: sale.productName, 
        quantity: sale.quantity || 1, 
        price: sale.amount 
      }];
      
      itemsList.forEach((item) => {
        const name = item.productName || 'Unknown Product';
        const qty = Number(item.quantity || 1);
        const revenue = Number(item.price || 0) * qty;

        if (!productMap[name]) {
          productMap[name] = { 
            name, 
            totalUnitsSold: 0, 
            totalRevenue: 0, 
            orderCount: 0 
          };
        }

        productMap[name].totalUnitsSold += qty;
        productMap[name].totalRevenue += revenue;
        productMap[name].orderCount += 1;
      });
    });

    const productVelocityArray = Object.values(productMap);

    // Filter by search term
    let filteredProducts = productVelocityArray;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filteredProducts = productVelocityArray.filter(p => 
        p.name.toLowerCase().includes(search)
      );
    }

    const fastSelling = [...filteredProducts]
      .sort((a, b) => b.totalUnitsSold - a.totalUnitsSold);

    const slowSelling = [...filteredProducts]
      .sort((a, b) => a.totalUnitsSold - b.totalUnitsSold);

    return { 
      fastSelling, 
      slowSelling, 
      totalUniqueItems: productVelocityArray.length,
      filteredCount: filteredProducts.length
    };
  };

  const { fastSelling, slowSelling, totalUniqueItems, filteredCount } = getProductVelocityMetrics();

  // Pagination for fast selling
  const fastTotalPages = Math.ceil(fastSelling.length / itemsPerPage);
  const fastStartIndex = (fastPage - 1) * itemsPerPage;
  const paginatedFast = fastSelling.slice(fastStartIndex, fastStartIndex + itemsPerPage);

  // Pagination for slow selling
  const slowTotalPages = Math.ceil(slowSelling.length / itemsPerPage);
  const slowStartIndex = (slowPage - 1) * itemsPerPage;
  const paginatedSlow = slowSelling.slice(slowStartIndex, slowStartIndex + itemsPerPage);

  const handleFastPageChange = (page) => {
    setFastPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSlowPageChange = (page) => {
    setSlowPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFastPage(1);
    setSlowPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500 font-medium text-sm">Processing catalog matrix sales data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Velocity Performance Analytics</h1>
          <p className="text-sm text-gray-500">Monitor turnover rate metrics to optimize procurement and marketing strategies.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-xs font-semibold text-gray-500">
            Tracking Items: <span className="text-indigo-600 font-bold">{totalUniqueItems}</span>
            {searchTerm && (
              <span className="text-gray-400 text-xs ml-1">
                (filtered: {filteredCount})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setFastPage(1);
            setSlowPage(1);
          }}
          filters={[]}
          onFilterChange={() => {}}
          onClearFilters={clearSearch}
          placeholder="Search by product name..."
        />
      </div>

      {sales.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Fast Selling Products Panel */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><Zap size={18} /></div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Top Performing Catalogs</h3>
                  <p className="text-xs text-gray-400">High turnover items driving highest storage velocity.</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                High Velocity
              </span>
            </div>

            <div className="space-y-3">
              {paginatedFast.length > 0 ? (
                paginatedFast.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3.5 bg-gray-50/40 border border-gray-100 rounded-xl hover:border-emerald-200 transition-colors group">
                    <div className="flex items-center gap-3 max-w-[70%]">
                      <span className="font-mono text-sm font-bold text-gray-300 group-hover:text-emerald-500 transition-colors w-5">
                        {String(fastStartIndex + index + 1).padStart(2, '0')}
                      </span>
                      <div className="truncate">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-400">{item.orderCount} unique checkouts</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-emerald-600 block">
                        {item.totalUnitsSold} units sold
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        ₵{item.totalRevenue.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">No products found matching your search.</div>
              )}
            </div>

            {fastTotalPages > 1 && (
              <Pagination
                currentPage={fastPage}
                totalPages={fastTotalPages}
                onPageChange={handleFastPageChange}
                totalItems={fastSelling.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>

          {/* Slow Selling Products Panel */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-50 p-2 rounded-xl text-amber-600"><AlertTriangle size={18} /></div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Stagnant Stock Inventory</h3>
                  <p className="text-xs text-gray-400">Low demand variants tied up in storage capital.</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                Low Velocity
              </span>
            </div>

            <div className="space-y-3">
              {paginatedSlow.length > 0 ? (
                paginatedSlow.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3.5 bg-gray-50/40 border border-gray-100 rounded-xl hover:border-amber-200 transition-colors group">
                    <div className="flex items-center gap-3 max-w-[70%]">
                      <span className="font-mono text-sm font-bold text-gray-300 group-hover:text-amber-500 transition-colors w-5">
                        {String(slowStartIndex + index + 1).padStart(2, '0')}
                      </span>
                      <div className="truncate">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-400">Last item tracking threshold</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-amber-600 block">
                        {item.totalUnitsSold} units sold
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        ₵{item.totalRevenue.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">No products found matching your search.</div>
              )}
            </div>

            {slowTotalPages > 1 && (
              <Pagination
                currentPage={slowPage}
                totalPages={slowTotalPages}
                onPageChange={handleSlowPageChange}
                totalItems={slowSelling.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>

        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><ShoppingBag size={24} /></div>
          <div>
            <p className="font-semibold text-gray-800">No Sales Records Traced</p>
            <p className="text-xs text-gray-400 mt-0.5">Please generate order checkout transactions to populate velocity metrics.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;