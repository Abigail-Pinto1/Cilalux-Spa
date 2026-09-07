import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    if (isRegister && !formData.name) newErrors.name = "Name is required";
    if (isRegister && !formData.phone) newErrors.phone = "Phone is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  // ✅ Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  setServerError("");
  const validationErrors = validate();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length !== 0) return;

  setIsSubmitting(true);

  const url = isRegister
    ? "http://localhost:7000/api/admin/register"
    : "http://localhost:7000/api/admin/login";

  try {
    const payload = isRegister
      ? {
          username: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Authentication failed");

    // ✅ store the shape AdminNavbar.jsx actually expects
    const adminInfo = {
      username: data.admin?.username || formData.name,
      email: data.admin?.email || formData.email,
      phone: data.admin?.phone || formData.phone,
      role: data.admin?.role || 'admin',
    };

    localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
    localStorage.setItem("adminToken", data.token);   // ✅ token stored separately only
    navigate("/admin/dashboard");
  } catch (err) {
    setServerError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};

  // ✅ Forgot password submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setForgotLoading(true);

    try {
      const res = await fetch(
        "http://localhost:7000/api/admin/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error sending reset email");

      setForgotMessage(data.message);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-center text-pink-600 mb-6">
          {isRegister ? "Admin Registration" : "Admin Login"}
        </h2>

        {serverError && (
          <p className="text-red-500 text-center mb-4 text-sm">{serverError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name (register only) */}
          {isRegister && (
            <div>
              <label className="block text-gray-700 text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-pink-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Phone (register only) */}
          {isRegister && (
            <div>
              <label className="block text-gray-700 text-sm mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-pink-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-pink-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-pink-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              className="absolute right-3 top-9 text-sm cursor-pointer text-gray-500 select-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password (login only) */}
          {!isRegister && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-pink-600 hover:underline"
                onClick={() => setForgotModalOpen(true)}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition"
          >
            {isSubmitting
              ? isRegister
                ? "Registering..."
                : "Logging in..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>

        {/* Toggle link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setErrors({});
              setServerError("");
            }}
            className="text-pink-600 hover:underline font-medium"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>

        {/* ✅ Forgot Password Modal */}
        {forgotModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-pink-600"
                onClick={() => setForgotModalOpen(false)}
              >
                X
              </button>
              <h3 className="text-lg font-semibold text-center mb-4 text-pink-600">
                Reset Password
              </h3>
              {forgotError && (
                <p className="text-red-500 text-center mb-2">{forgotError}</p>
              )}
              {forgotMessage && (
                <p className="text-green-500 text-center mb-2">{forgotMessage}</p>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-pink-500"
                  required
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegister;
