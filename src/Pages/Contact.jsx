import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react";


const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:7000/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Message sent successfully! 🎉");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(result.message || "Failed to send message.");
      }
    } catch (error) {
      alert("Error connecting to the server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-16 px-6 md:px-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-pink-600 mb-4"
        >
          Get in Touch
        </motion.h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Have questions, bookings, or special requests?  
          We’d love to hear from you. Reach out and let us pamper you!
        </p>
      </div>

      {/* Contact Content */}
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Contact Information
          </h2>

          <div className="space-y-5 text-gray-700">
            <p className="flex items-center gap-3">
              <MapPin className="text-pink-500" />  
              123 Serenity Street, Lashibi 
            </p>
            <p className="flex items-center gap-3">
              <Phone className="text-pink-500" />  
              +233 553 138 7334
            </p>
            <p className="flex items-center gap-3">
              <Mail className="text-pink-500" />  
              info@cilalux.com
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-gray-800 font-semibold mb-3">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/CilaluxBeautyEmpire/"
                target="_blank"
                className="p-3 bg-pink-100 rounded-full hover:bg-pink-200 transition"
              >
                <Facebook className="text-pink-600" />
              </a>
              <a
                href="https://www.instagram.com/microblading_spa_lashproduct/?hl=en"
                target="_blank"
                className="p-3 bg-pink-100 rounded-full hover:bg-pink-200 transition"
              >
                <Instagram className="text-pink-600" />
              </a>
             
            </div>
          </div>

          <div className="mt-10">
            <iframe
              title="Spa Location"
              src= "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5615.244887377234!2d-0.07083894823671362!3d5.629176440507313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf87480b67edb9%3A0xffe93eeb1e6dc882!2sCILALUX%20BEAUTY%20EMPIRE!5e0!3m2!1sen!2sgh!4v1761300021868!5m2!1sen!2sgh" 
              width="100%"
              height="250"
              allowFullScreen=""
              loading="lazy"
              className="rounded-xl border-0"
            ></iframe>
          </div>
        </motion.div>

        {/* Contact Form */}
         <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-[0_4px_30px_rgba(255,182,193,0.25)]"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>

          <div className="space-y-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full p-3 border border-pink-100 rounded-xl bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full p-3 border border-pink-100 rounded-xl bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition"
            />
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="w-full p-3 border border-pink-100 rounded-xl bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition"
            ></textarea>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition duration-300"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
