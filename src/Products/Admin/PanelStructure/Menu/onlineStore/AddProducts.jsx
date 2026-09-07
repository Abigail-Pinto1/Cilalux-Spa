import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Package, DollarSign, Tag, BarChart3 } from 'lucide-react';
import { addProduct } from '../../../../../Store/Features/product/productSlice';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [submitLoading, setSubmitLoading] = useState(false);

  
  // Safe destructuring of Redux state
    const productsState = useSelector((state) => state.products || {});
  const { loading, error } = productsState;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    cost: '',
    category: '',
    subcategory: '',
    sku: '',
    barcode: '',
    brand: '',
    quantity: '',
    lowStockAlert: '10',
    weight: { value: '', unit: 'kg' },
    dimensions: { length: '', width: '', height: '', unit: 'cm' },
    status: 'active',
    tags: '',
    seo: { title: '', description: '' },
    vendor: { name: '', contact: '' },
  });

  const [images, setImages] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
 

  const categories = [
    { group: 'Furniture', items: ['Massage tables', 'Pedicure and spa chairs', 'Manicure tables', 'Salon chairs', 'Stools for technicians'] },
    { group: 'Facial and Skincare', items: ['Facial steamers', 'Facial machines', 'Magnifying lamps', 'Wax heaters'] },
    { group: 'Nail Care', items: ['Nail polishes', 'Tools for manicures and pedicures'] },
    { group: 'Hair Care', items: ['Hair dryers', 'Hair styling tools', 'Hair treatment equipment'] },
    { group: 'Spa Equipment', items: ['Steam rooms', 'Sauna equipment', 'Hydrotherapy tubs'] }
  ];

  // FIX 1: Support deeply nested fields like vendor.name or seo.title safely
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      
      setFormData(prev => {
        const updated = { ...prev };
        let current = updated;
        
        // Traverse down to the second-to-last key
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        
        // Set the ultimate value
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    setUploadLoading(true);

    const uploadPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            url: e.target.result, 
            alt: file.name,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(uploadPromises)
      .then(newImages => {
        setImages(prev => [...prev, ...newImages]);
        setUploadLoading(false);
      })
      .catch(error => {
        console.error('Image upload error:', error);
        setUploadLoading(false);
      });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToServer = async (images) => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    const token = adminInfo?.token;

    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }

    const uploadedUrls = [];

    for (const image of images) {
      if (!image.file) continue;

      const form = new FormData();
      form.append("image", image.file);

      const res = await fetch("http://localhost:7000/api/products/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (res.status === 401) {
        localStorage.removeItem("adminInfo");
        throw new Error("Session expired. Please log in again.");
      }

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      const data = await res.json();
      uploadedUrls.push({
        // Backend's productImgUpload returns `imageUrl`, not `url` --
        // this mismatch was why every saved product ended up with an
        // images array missing the actual url field.
        url: data.imageUrl,
        alt: image.alt || image.file.name,
      });
    }

    return uploadedUrls;
  };

  // FIX 2: Restructured data transformation to cleanly map to backend schemas
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      const serverImages = await uploadImagesToServer(images);

      const toNumber = (value) =>
        value === '' || value === null || value === undefined ? undefined : Number(value);

      // Map out clean payload structural values explicitly
      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category || undefined,
        subcategory: formData.subcategory || undefined,
        sku: formData.sku?.trim() ? formData.sku.trim() : undefined,
        barcode: formData.barcode?.trim() ? formData.barcode.trim() : undefined,
        brand: formData.brand || undefined,
        status: formData.status,
        
        price: toNumber(formData.price),
        comparePrice: toNumber(formData.comparePrice),
        cost: toNumber(formData.cost),
        quantity: toNumber(formData.quantity),
        lowStockAlert: toNumber(formData.lowStockAlert) ?? 10,

        weight: formData.weight.value
          ? { value: toNumber(formData.weight.value), unit: formData.weight.unit }
          : undefined,

        dimensions:
          formData.dimensions.length || formData.dimensions.width || formData.dimensions.height
            ? {
                length: toNumber(formData.dimensions.length),
                width: toNumber(formData.dimensions.width),
                height: toNumber(formData.dimensions.height),
                unit: formData.dimensions.unit,
              }
            : undefined,

        seo: formData.seo.title || formData.seo.description
          ? {
              title: formData.seo.title || undefined,
              description: formData.seo.description || undefined,
            }
          : undefined,

        vendor: formData.vendor.name || formData.vendor.contact
          ? {
              name: formData.vendor.name || undefined,
              contact: formData.vendor.contact || undefined,
            }
          : undefined,

        tags: formData.tags
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [],

        images: serverImages,
      };

      // Strip keys that have explicit undefined values cleanly without breaking sub-objects
      const cleanProductData = Object.fromEntries(
        Object.entries(productData).filter(([, value]) => value !== undefined)
      );

      const result = await dispatch(addProduct(cleanProductData));

      if (addProduct.fulfilled.match(result)) {
        navigate('/store/inventory');
      } else {
        // Log the exact error object returned from your backend payload reject
        console.error("Backend validation rejected request:", result.payload || result.error);
      }
    } catch (error) {
      console.error('Submission error:', error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-600">Add a new product to your store inventory</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {typeof error === 'string' ? error : 'An error occurred'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-indigo-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((categoryGroup) => (
                    <optgroup key={categoryGroup.group} label={categoryGroup.group}>
                      {categoryGroup.items.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter subcategory"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-green-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Pricing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₵</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₵</span>
                  <input
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₵</span>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Auto-generated if empty"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  name="lowStockAlert"
                  value={formData.lowStockAlert}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="text-purple-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Product Images</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-600 mb-2">Click to upload images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadLoading}
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-indigo-700 ${
                    uploadLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadLoading ? 'Uploading...' : 'Choose Files'}
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="text-orange-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Organization</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter brand name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || uploadLoading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {(loading || uploadLoading) ? 'Processing...' : 'Add Product'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={uploadLoading}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;