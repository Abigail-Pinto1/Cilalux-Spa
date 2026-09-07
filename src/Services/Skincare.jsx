import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "Chemical Peels",
    image: "/src/assets/chemical-peel.svg",
    description:
      "Used to exfoliate the skin and can address issues like hyperpigmentation and fine lines.",
  },
  {
    id: 2,
    title: "Microdermabrasion",
    image: "/src/assets/Microdermabrasion.svg",
    description:
      "A non-invasive exfoliation technique that uses a diamond tip to reveal brighter, more even-toned skin.",
  },
  {
    id: 3,
    title: "Laser Treatments",
    image: "/src/assets/laserTreatments.svg",
    description:
      "A manual exfoliation that removes dead skin cells and peach fuzz.",
  },
  {
    id: 4,
    title: "Skin Tag Removal",
    image: "/src/assets/2 (1).svg",
    description: "A procedure to safely remove skin tags and rejuvenate skin.",
  },
];

const Skincare = () => {
  return (
    <section className="bg-gray-50 min-h-screen py-16 px-6 md:px-20">
      {/* Banner Section */}
      <div className="relative mb-20">
        <img
          src="/src/assets/skincare7.svg"
          alt="skincare"
          className="w-full h-[300px] md:h-[400px] object-cover rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-black/30 rounded-t-3xl" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
          <h1 className="text-4xl font-bold mb-3">Professional Skincare</h1>
          <p className="text-lg max-w-2xl text-center">
            Indulge in our range of skincare treatments designed to refresh,
            renew, and restore your natural glow.
          </p>
        </div>
      </div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
      >
        Our Skincare Services
      </motion.h2>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 p-8 text-center relative"
          >
            {/* Icon/Image */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 p-4 object-fill contain rounded-xl shadow-md">
              <img
                src={service.image}
                alt={service.title}
                className="w-10 h-30 object-contain"
              />
            </div>

            {/* Service Content */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {service.description}
              </p>

              <NavLink to="/appointment">
                <button className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700 transition">
                  Book Appointment
                </button>
              </NavLink>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skincare;
