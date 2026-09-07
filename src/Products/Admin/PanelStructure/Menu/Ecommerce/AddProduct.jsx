// /* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AddProduct = ({ onClose, onSubmit, product }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: product?.name || "",
//     category: product?.category || "",
//     price: product?.price || "",
//     quantity: product?.quantity || "", // matches schema field name (not "stock")
//     description: product?.description || "",
//     images: product?.images || [], // matches schema: array of { url, alt }
//   });

//   const [preview, setPreview] = useState(product?.images?.[0]?.url || "");
//   const [loading, setLoading] = useState(false);

//   // Admin token is stored under "adminInfo" elsewhere in this app (see productSlice.js),
//   // not a bare "token" key — use the same source everywhere so auth headers actually work.
//   const getAdminToken = () => {
//     const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "null");
//     return adminInfo?.token || "";
//   };

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   // Upload image to backend -> local disk (see Config/fileUpload.js + productImgUpload controller)
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const uploadFormData = new FormData();
//     uploadFormData.append("image", file);

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:7000/api/products/upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${getAdminToken()}`,
//         },
//         body: uploadFormData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         // Store as an array entry matching the Product schema's `images` field
//         setFormData((prev) => ({
//           ...prev,
//           images: [{ url: data.imageUrl, alt: data.alt || file.name }],
//         }));
//         setPreview(data.imageUrl);
//       } else {
//         console.error("Upload failed:", data.message);
//         alert(`Upload failed: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Error sending image to server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   console.log('formData about to submit:', JSON.stringify(formData, null, 2)); // TEMP DEBUG

//   if (!formData.name || !formData.price || !formData.category) {
//     ...}

//   // Submit product
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('SUBMIT DEBUG:', JSON.stringify(formData.images));

//     if (!formData.name || !formData.price || !formData.category) {
//       alert("Please fill all required fields!");
//       return;
//     }

//     const isEdit = Boolean(product?._id);
//     const url = isEdit
//       ? `http://localhost:7000/api/products/${product._id}`
//       : `http://localhost:7000/api/products`;

//     try {
//       const res = await fetch(url, {
//         method: isEdit ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getAdminToken()}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(errData.error || "Failed to save product");
//       }

//       alert("✅ Product saved successfully!");
//       onSubmit?.(formData);
//       onClose?.();
//       navigate("/admin/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert(`❌ Failed to save product: ${err.message}`);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
//           {product ? "Edit Product" : "Add New Product"}
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <input
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Product Name"
//               className="w-full p-3 border rounded-lg"
//               required
//             />

//             {/* Category Dropdown */}
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg bg-white"
//               required
//             >
//               <option value="">Select Category</option>

//               <optgroup label="Furniture">
//                 <option value="Massage tables">Massage tables</option>
//                 <option value="Pedicure and spa chairs">Pedicure and spa chairs</option>
//                 <option value="Manicure tables">Manicure tables</option>
//                 <option value="Salon chairs">Salon chairs</option>
//                 <option value="Stools for technicians">Stools for technicians</option>
//               </optgroup>

//               <optgroup label="Facial and Skincare">
//                 <option value="Facial steamers">Facial steamers</option>
//                 <option value="Facial machines">Facial machines</option>
//                 <option value="Magnifying lamps">Magnifying lamps</option>
//                 <option value="Wax heaters">Wax heaters</option>
//               </optgroup>

//               <optgroup label="Nail Care">
//                 <option value="Nail polishes">Nail polishes</option>
//                 <option value="Tools for manicures and pedicures">
//                   Tools for manicures and pedicures
//                 </option>
//               </optgroup>
//             </select>

//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Short Description"
//               className="w-full p-3 border rounded-lg"
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 name="price"
//                 type="number"
//                 value={formData.price}
//                 onChange={handleChange}
//                 placeholder="Price"
//                 className="w-full p-3 border rounded-lg"
//                 required
//               />
//               <input
//                 name="quantity"
//                 type="number"
//                 value={formData.quantity}
//                 onChange={handleChange}
//                 placeholder="Stock Quantity"
//                 className="w-full p-3 border rounded-lg"
//                 required
//               />
//             </div>

//             <div className="flex flex-col items-center border-2 border-dashed border-pink-300 rounded-lg p-4">
//               {preview ? (
//                 <img
//                   src={preview.startsWith("http") ? preview : `http://localhost:7000${preview}`}
//                   alt="Preview"
//                   className="w-32 h-32 object-cover rounded-lg mb-3"
//                 />
//               ) : (
//                 <p className="text-gray-500 mb-2">No image selected</p>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="text-sm"
//               />
//               {loading && <p className="text-xs text-gray-400 mt-2">Uploading...</p>}
//             </div>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 transition"
//               >
//                 {product ? "Save Changes" : "Add Product"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;