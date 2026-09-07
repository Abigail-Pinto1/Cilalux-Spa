import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../../Store/Features/product/productSlice"; // Adjust level path if needed
import { Search, Edit2, AlertCircle, CheckCircle2, Loader2, Package } from "lucide-react";
import axios from "axios";

const EditProduct = () => {
  const dispatch = useDispatch();

  // 1. Pull current products catalog from Redux
  const productsState = useSelector((state) => state.products);
  const products = productsState?.items || [];
  const globalLoading = productsState?.loading || false;

  // Local component states
  const [searchId, setSearchId] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [actionLoading, setActionLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "", // Maps to backend schema field name 'quantity'
    description: "",
    category: "",
    status: "active"
  });

  // 2. Fetch all products automatically on page mount
  useEffect(() => {
    dispatch(fetchProduct({ limit: 100 }));
  }, [dispatch]);

  // Handle standard input fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Automated product filler when an ID is searched or selected
  const loadProductToForm = (productId) => {
    if (!productId.trim()) return;
    
    const matchedProduct = products.find((p) => p._id === productId.trim());
    
    if (matchedProduct) {
      setSearchId(productId);
      setFormData({
        name: matchedProduct.name || "",
        price: matchedProduct.price || "",
        quantity: matchedProduct.quantity || matchedProduct.stock || "",
        description: matchedProduct.description || "",
        category: matchedProduct.category || "",
        status: matchedProduct.status || "active"
      });
      setFeedback({ message: `Loaded product: ${matchedProduct.name}`, type: "success" });
    } else {
      setFeedback({ message: "Product ID not found in current inventory", type: "error" });
    }
  };

  // Search button submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProductToForm(searchId);
  };

  // 4. API PUT Request: Direct submission handler to update your MongoDB collection
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setFeedback({ message: "Please load a valid product using its ID first", type: "error" });
      return;
    }

    try {
      setActionLoading(true);
      setFeedback({ message: "", type: "" });
      const token = localStorage.getItem("token");

      // Build structured payload conversion variables explicitly
      const updatedPayload = {
        name: formData.name,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        description: formData.description,
        category: formData.category,
        status: formData.status
      };

      await axios.put(
        `http://localhost:7000/api/products/${searchId.trim()}`,
        updatedPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFeedback({ message: "Product synced and updated live across storefront!", type: "success" });
      
      // Refresh your global Redux store instantly so changes reflect immediately
      dispatch(fetchProduct({ limit: 100 }));
    } catch (err) {
      console.error("Update error:", err);
      setFeedback({ 
        message: err.response?.data?.message || "Failed to save data mutations to database", 
        type: "error" 
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 animate-fade-in">
      {/* Header Grid */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Inventory Modification Engine</h1>
        <p className="text-gray-500 text-sm">Search via document hashes, modify fields, or edit store variations instantly</p>
      </div>

      {/* Alert Notifications System Banner */}
      {feedback.message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
          feedback.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Split Display Interface Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL LEFT: DYNAMIC SYSTEM SEARCH ENGINE & INPUT FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Target Identity Lookup</h3>
            
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Paste object ID here (e.g. 64f1bc...)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-900 text-white px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-800 transition shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Core Fields Editor Form */}
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">Modification Properties</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Price (₵)</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Stock Units</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Product Visibility Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
              >
                <option value="active">Active (Visible on StoreHome)</option>
                <option value="draft">Draft (Hidden in Catalog Archive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Marketing Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading || !searchId}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 px-4 rounded-xl disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md shadow-pink-500/10"
            >
              {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />}
              Publish Variations to Live Store
            </button>
          </form>
        </div>

        {/* PANEL RIGHT: INTERACTIVE ITEMS LEDGER CATALOG LIST */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Active Inventory Index</h3>
            <p className="text-xs text-gray-500 mb-4">Click any card below to load it into the editor</p>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {globalLoading ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Loading product collection...
                </div>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => loadProductToForm(p._id)}
                    className={`p-3 border rounded-xl cursor-pointer text-left transition-all flex justify-between items-center group ${
                      searchId === p._id
                        ? "border-pink-500 bg-pink-50/20"
                        : "border-gray-100 hover:border-pink-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400 font-mono">ID: {p._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">₵{p.price}</p>
                      <p className={`text-xs font-medium ${p.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                        {p.quantity || 0} Stock
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No products available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
            