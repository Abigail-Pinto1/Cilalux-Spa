/* eslint-disable no-unused-vars */
// src/components/HeroSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Clock,
  Truck,
  Shield,
  Headphones,
  Phone,
  Store,
  Package
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Hero Carousel Images
const HERO_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=600&fit=crop",
    title: "SHOPPING SPREE",
    subtitle: "Deals for Every Need",
    discount: "40%",
    cta: "Shop Now"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=600&fit=crop",
    title: "FLASH SALE",
    subtitle: "Limited Time Offers",
    discount: "50%",
    cta: "Grab Deals"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=600&fit=crop",
    title: "NEW ARRIVALS",
    subtitle: "Latest Collections",
    discount: "30%",
    cta: "Explore Now"
  }
];

// Categories
const CATEGORIES = [
  { id: 1, name: "Supermarket", icon: "🛒", slug: "supermarket" },
  { id: 2, name: "Phones & Tablets", icon: "📱", slug: "phones-tablets" },
  { id: 3, name: "Health & Beauty", icon: "💄", slug: "health-beauty" },
  { id: 4, name: "Home & Office", icon: "🏠", slug: "home-office" },
  { id: 5, name: "Appliances", icon: "🔌", slug: "appliances" },
  { id: 6, name: "Electronics", icon: "💻", slug: "electronics" },
  { id: 7, name: "Computing", icon: "🖥️", slug: "computing" },
  { id: 8, name: "Fashion", icon: "👗", slug: "fashion" },
  { id: 9, name: "Sporting Goods", icon: "⚽", slug: "sporting-goods" },
  { id: 10, name: "Baby Products", icon: "👶", slug: "baby-products" },
  { id: 11, name: "Gaming", icon: "🎮", slug: "gaming" },
  { id: 12, name: "Other categories", icon: "📦", slug: "other-categories" }
];

// Quick Links
const QUICK_LINKS = [
  { 
    id: 1, 
    icon: <Phone size={20} />, 
    text: "CALL / WHATSAPP", 
    subtext: "0302740642", 
    link: "tel:0302740642" 
  },
  { 
    id: 2, 
    icon: <Store size={20} />, 
    text: "SELL ON CILALUX", 
    subtext: "Make more money", 
    link: "/sell" 
  },
  { 
    id: 3, 
    icon: <Package size={20} />, 
    text: "TRACK YOUR ORDER", 
    subtext: "Stay up to date", 
    link: "/order-tracking" 
  }
];

// Service Features
const SERVICE_FEATURES = [
  { 
    id: 1, 
    icon: <Truck className="text-orange-500" size={24} />, 
    title: "Free Delivery", 
    subtitle: "On orders above GHS 100" 
  },
  { 
    id: 2, 
    icon: <Shield className="text-green-500" size={24} />, 
    title: "Secure Payment", 
    subtitle: "100% safe checkout" 
  },
  { 
    id: 3, 
    icon: <Headphones className="text-blue-500" size={24} />, 
    title: "24/7 Support", 
    subtitle: "Dedicated customer service" 
  },
  { 
    id: 4, 
    icon: <Zap className="text-yellow-500" size={24} />, 
    title: "Fast Delivery", 
    subtitle: "Within 2-5 business days" 
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideInterval = useRef(null);

  // Auto-slide carousel
  useEffect(() => {
    if (!isPaused) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
      }, 5000);
    }
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Hero Section with Carousel */}
      <section className="relative bg-gradient-to-r from-orange-500 to-pink-500 overflow-hidden pt-4">
        <div className="max-w-7xl mx-auto px-4 pb-8">
          {/* Hero Carousel */}
          <div 
            className="relative rounded-2xl overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden"
              >
                <img
                  src={HERO_IMAGES[currentSlide].url}
                  alt={HERO_IMAGES[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                  <div className="px-6 md:px-12 max-w-xl">
                    <h2 className="text-white text-4xl md:text-6xl font-bold leading-tight">
                      {HERO_IMAGES[currentSlide].title}
                    </h2>
                    <p className="text-white/90 text-lg md:text-xl mt-2">
                      {HERO_IMAGES[currentSlide].subtitle}
                    </p>
                    <div className="mt-4">
                      <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-2xl md:text-3xl font-bold">
                        UP TO -{HERO_IMAGES[currentSlide].discount}
                      </span>
                    </div>
                    <Link
                      to="/store/products"
                      className="inline-block mt-6 bg-white text-orange-600 px-6 md:px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg"
                    >
                      {HERO_IMAGES[currentSlide].cta}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {HERO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {CATEGORIES.slice(0, 12).map((category) => (
            <Link
              key={category.id}
              to={`/store/category/${category.slug}`}
              className="flex flex-col items-center p-3 md:p-4 rounded-xl hover:bg-orange-50 transition-colors group"
            >
              <span className="text-2xl md:text-3xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <span className="text-[10px] md:text-xs text-center text-gray-700 font-medium group-hover:text-orange-600 leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="max-w-7xl mx-auto px-4 mt-6 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.link}
              className="bg-white rounded-xl shadow-md p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="bg-orange-100 p-2 md:p-3 rounded-full text-orange-600 flex-shrink-0">
                {link.icon}
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">{link.text}</p>
                <p className="font-semibold text-gray-800 text-sm md:text-base">{link.subtext}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Service Features */}
      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 mb-6 md:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {SERVICE_FEATURES.map((feature) => (
            <div key={feature.id} className="bg-white rounded-xl shadow-md p-3 md:p-4 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-1 md:mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">{feature.title}</h3>
              <p className="text-[10px] md:text-xs text-gray-500">{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brands/Partners Section */}
      <div className="max-w-7xl mx-auto px-4 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">Top Brands</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Dell', 'HP', 'LG'].map((brand) => (
              <div key={brand} className="text-gray-600 font-medium hover:text-orange-500 cursor-pointer text-sm md:text-base">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}