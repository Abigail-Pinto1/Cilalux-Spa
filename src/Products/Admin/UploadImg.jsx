import React, { useState } from "react";
import axios from "axios";

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:7000/api/upload", formData);
      setImageUrl(res.data.imageUrl);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">Upload Product Image</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button
          type="submit"
          className="bg-pink-600 text-white py-2 px-6 rounded-lg"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {imageUrl && (
        <div className="mt-6">
          <p className="text-green-600">✅ Uploaded Successfully!</p>
          <img src={imageUrl} alt="Uploaded" className="w-64 mt-2 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default AdminUpload;
