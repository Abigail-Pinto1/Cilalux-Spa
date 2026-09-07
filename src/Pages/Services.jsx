import React from "react";
import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";

const Services = () => {
  const services = [
    {
      title: "Skin Care",
      image: "/src/assets/2 (1).svg",
      description:
        "Revitalize your skin with our deep hydration and anti-aging treatments designed for all skin types.",
      link: "skincare", 
    },
    {
      title: "Facials & Masking",
      image: "/src/assets/2.svg",
      description:
        "Pamper your face with nutrient-rich masks for glowing, youthful skin and deep relaxation.",
      link: "facials",
    },
    {
      title: "Body Treatment",
      image: "/src/assets/bodytreat2.svg",
      description:
        "Detoxify and relax your body through a soothing steam bath that opens pores and boosts circulation.",
      link: "body",
    },
    {
      title: "Facial Therapy",
      image: "/src/assets/facials1.svg",
      description:
        "Cleanse, exfoliate, and rejuvenate your skin with our expert facial therapies.",
      link: "facials",
    },
    {
      title: "Waxing ",
      image: "src/assets/wax1.svg",
      description:
        "Ease tension and relax muscles with our full-body treatment and  massage using essential oils and gentle pressure.",
      link: "waxing",
    },
    {
      title: "Massage Therapy",
      image: "/src/assets/massage.svg",
      description:
        "Immerse yourself in calming scents to balance your mind, body, and soul.",
      link: "massage",
    },
    {
      title: "Nails ",
      image: "/src/assets/nails2.svg",
      description:
        "Buff your nails and foot with a variety of healthy nails procedure to elaborate nail art .",
      link: "nails",
    },
    {
      title: "Make Up",
      image: "/src/assets/makeup.svg",
      description:
        "Feel stress melt away with our warm stone therapy that promotes deep muscle relaxation.",
      link: "makeup",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white text-gray-800">
      
      <section
        className="relative h-[70vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/spa13.svg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Luxury Treatment
          </motion.h1>
          <p className="text-white max-w-2xl mx-auto mb-6">
            Experience deep relaxation and rejuvenation with our expert
            treatments designed to soothe your body and mind.
          </p>
          <div className="space-x-4">
            <button className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition">
              Learn More
            </button>
            <Link to="/appointment">
              <button className="bg-white text-pink-600 px-6 py-3 rounded-full hover:bg-pink-100 transition">
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 md:px-16">
        <div className="text-center mb-12">
          <p className="text-pink-500 uppercase tracking-widest mb-2">
            Our Services
          </p>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Spa & Beauty Services
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Indulge in luxurious treatments designed to relax your body,
            rejuvenate your spirit, and enhance your natural beauty.
          </p>
        </div>

        {/* Two-column Service Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-1/3 object-cover"
              />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link to={service.link}>
                    <button className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm hover:bg-pink-200 transition">
                      More Services
                    </button>
                  </Link>

                 
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
     
    </div>
  );
};

export default Services;
