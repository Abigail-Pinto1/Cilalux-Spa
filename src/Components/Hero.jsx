 import React from 'react'
 import { motion } from 'framer-motion'
 import { useState, useEffect } from 'react'
 import { AnimatePresence } from 'framer-motion'
 import '../App.css'
 import { Users, Smile, Sparkles, Leaf, Scissors, Crown, Gem} from "lucide-react";
 
  
 
 const Hero = () => {
  const images = [
  "/src/assets/spa16hero.svg",
  "/src/assets/spa17blackhero.svg",
  "/src/assets/spa15hero.svg",
];
    const [currentIndex, setCurrentIndex] = useState(0);
    
  // Switch background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
  {
    icon: <Leaf size={32} className="text-rose-400" />,
    title: "Manicure & Pedicure",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ipsum mut.",
  },
  {
    icon: <Scissors size={32} className="text-rose-400" />,
    title: "Haircut & Styling",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ipsum mut.",
  },
  {
    icon: <Sparkles size={32} className="text-rose-400" />,
    title: "Supreme Skincare",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ipsum mut.",
  },
   {
    icon: <Leaf size={32} className="text-rose-400" />,
    title: "Body Treatments",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ipsum mut.",
  },
   {
    icon: < Leaf size={32} className="text-rose-400" />,
    title: "Relaxing Massages",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ipsum mut.",
  },
   {
    icon: <Leaf size={32} className="text-rose-400" />,
    title: "Therapeutic Baths",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ipsum mut.",
  },
];

const plans = [
  {
    name: "Basic Bliss",
    icon: <Sparkles size={28} className="text-rose-400" />,
    price: "GHS590",
    description: "Perfect for quick rejuvenation and essential spa treatments.",
    features: [
      "30 min Massage",
      "Manicure & Pedicure",
      "Basic Skincare",
      "Aromatherapy Oils",
    ],
    button: "Get Started",
  },
  {
    name: "Luxury Touch",
    icon: <Crown size={28} className="text-purple-400" />,
    price: "GHS890",
    description: "Our most popular plan for full relaxation and beauty care.",
    features: [
      "60 min Massage",
      "Facial & Hair Spa",
      "Premium Oils & Products",
      "Sauna + Aromatherapy",
    ],
    button: "Choose Plan",
    highlight: true,
  },
  {
    name: "Royal Glow",
    icon: <Gem size={28} className="text-rose-400" />,
    price: "GHS1290",
    description: "A luxurious experience crafted for total body rejuvenation.",
    features: [
      "90 min Full-Body Massage",
      "Luxury Skincare & Hair Spa",
      "Hot Stone Therapy",
      "Free Consultation",
    ],
    button: "Book Now",
  },
];

const teamMembers = [
  {
    name: "Stephen Asmah",
    role: "Massage Therapist",
    image: "/src/assets/mass-therapist.svg",
  },
  {
    name: "Ava Amankona",
    role: "Skincare Specialist",
    image: "/src/assets/estcian.svg",
  },
  {
    name: "Ella Aryee",
    role: "Hair Stylist",
    image: "/src/assets/hairstylist.jpg",
  },
  {
    name: "Mia Mensah",
    role: "Nail Technician",
    image: "/src/assets/nailtechy.svg",
  },
];

   return (
     <div> 
      <motion.section
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 1 }}
  style={{ clipPath: "ellipse(75% 60% at 50% 40%)" }} 
>

  {/* Hero Section with Slideshow */}
      <section className="relative h-[90vh] w-full flex items-center justify-start text-left overflow-hidden">
        {/* Background Slideshow */}
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images[currentIndex]})`,
            }}
          />
        </AnimatePresence>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 px-6 max-w-3xl">
          <motion.p
            className="uppercase tracking-[.2em] text-gray-200 text-sm mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Glamour and Care
          </motion.p>

          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Enjoy The Best <span className="text-purple-300">Spa & Salon Wellness</span>
          </motion.h1>

          <motion.p
            className="text-gray-200 text-lg mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Relax, recharge, and rejuvenate your body and soul with our luxurious spa and salon treatments.
          </motion.p>

          <motion.button
            className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition"
            whileHover={{ scale: 1.05 }}
          >
            Discover More
          </motion.button>
        </div>
      </section>
</motion.section>

 <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Images */}
        <div className="relative flex justify-center">
          {/* Main Image */}
          <motion.img
            src="/src/assets/facials4.svg"
            alt="Spa Treatment"
            className="rounded-2xl shadow-xl w-80 h-96 object-cover"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Top Left Image */}
          <motion.img
            src="/src/assets/wax3.svg"
            alt="Spa Small"
            className="absolute -top-8 -left-10 w-32 h-32 rounded-xl shadow-md object-cover border-4 border-white"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Bottom Right Image */}
          <motion.img
            src="/src/assets/nails5.svg"
            alt="Spa Small"
            className="absolute -bottom-8 -right-10 w-32 h-32 rounded-xl shadow-md object-cover border-4 border-white"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Right Text */}
        <div className="text-gray-700">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center md:text-left mb-4 text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Us
          </motion.h2>

          <motion.ul
            className="space-y-3 mb-8 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <li>✨ Expert therapists with years of experience</li>
            <li>🌿 100% natural spa products</li>
            <li>💆 Relaxing environment with aromatherapy</li>
            <li>🕯️ Personalized wellness plans</li>
            <li>🌸 Exceptional care and attention to detail</li>
          </motion.ul>

          {/* Stats Section */}
          <div className="flex justify-center md:justify-start gap-8">
            <div className="text-center">
              <Users className="mx-auto text-purple-500" size={28} />
              <p className="text-2xl font-bold text-gray-900">58</p>
              <p className="text-gray-500 text-sm">Therapists</p>
            </div>

            <div className="text-center">
              <Smile className="mx-auto text-purple-500" size={28} />
              <p className="text-2xl font-bold text-gray-900">100+</p>
              <p className="text-gray-500 text-sm">Clients</p>
            </div>

            <div className="text-center">
              <Sparkles className="mx-auto text-purple-500" size={28} />
              <p className="text-2xl font-bold text-gray-900">75</p>
              <p className="text-gray-500 text-sm">Treatments</p>
            </div>
          </div>
        </div>
      </div>
    </section>

 <section className="relative py-24 bg-[#fffaf9] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-rose-100 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-100 rounded-full opacity-40 blur-2xl" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-rose-50 rounded-full opacity-20 blur-3xl" />

      <div className="relative container mx-auto px-6 text-center">
        {/* Section Header */}
        <motion.p
          className="uppercase text-gray-500 tracking-widest mb-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Services
        </motion.p>

        <motion.h2
          className="text-4xl font-serif font-semibold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          The best for you
        </motion.h2>

        <motion.p
          className="text-gray-500 max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </motion.p>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white p-10 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 relative z-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-rose-50 rounded-full">{service.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 font-serif">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm">{service.description}</p>

              {/* Leaf decorative element */}
              <div className="absolute bottom-0 right-4 text-rose-100 text-[100px] select-none pointer-events-none">
                ❁
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

<section className="relative py-24 bg-gradient-to-b from-rose-50 via-white to-purple-50 overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-rose-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 text-center">
        {/* Section Header */}
        <motion.p
          className="uppercase text-gray-500 tracking-widest mb-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pricing
        </motion.p>

        <motion.h2
          className="text-4xl font-serif font-semibold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Choose Your Perfect Plan
        </motion.h2>

        <motion.p
          className="text-gray-500 max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Pamper yourself with packages designed for beauty, wellness, and
          tranquility. Select the plan that fits your needs.
        </motion.p>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-10 transition-transform transform hover:-translate-y-2 hover:shadow-2xl ${
                plan.highlight
                  ? "border-t-8 border-purple-400 scale-105 bg-gradient-to-b from-white to-purple-50"
                  : ""
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex justify-center mb-6">{plan.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 font-serif">
                {plan.name}
              </h3>
              <p className="text-gray-500 mb-6 text-sm">{plan.description}</p>
              <p className="text-4xl font-bold text-purple-600 mb-6">
                {plan.price}
                <span className="text-gray-400 text-base font-normal">/session</span>
              </p>
              <ul className="text-gray-600 mb-8 space-y-3 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i}>🌿 {feature}</li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`w-full py-3 rounded-full font-semibold transition ${
                  plan.highlight
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-rose-100 text-purple-700 hover:bg-rose-200"
                }`}
              >
                {plan.button}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

<section className="relative py-24 bg-gradient-to-b from-white via-rose-50 to-purple-50 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 text-center">
        <motion.p
          className="uppercase text-gray-500 tracking-widest mb-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Experts
        </motion.p>

        <motion.h2
          className="text-4xl font-serif font-semibold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Meet Our Team of Professionals
        </motion.h2>

        <motion.p
          className="text-gray-500 max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our experienced team is dedicated to providing top-tier spa and salon
          services that help you relax, rejuvenate, and radiate confidence.
        </motion.p>

        {/* Team Members Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-2xl shadow-md overflow-hidden group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Image */}
              <div className="relative w-full h-72 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </div>

              {/* Text */}
              <div className="absolute bottom-6 left-6 text-left text-white opacity-0 group-hover:opacity-100 transition duration-500">
                <h3 className="text-xl font-semibold font-serif">{member.name}</h3>
                <p className="text-sm text-gray-200">{member.role}</p>
              </div>

              {/* Static info for non-hover (mobile view) */}
              <div className="p-6 text-center md:hidden">
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

     </div>
   )
 }
 
 export default Hero