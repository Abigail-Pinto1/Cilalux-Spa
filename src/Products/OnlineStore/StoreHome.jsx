import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../Store/Features/product/productSlice";
import { addToCart } from "../../Store/Features/cart/cartSlice"; // ← correct import
import HeroSection from "./StoreSections/heroSection";
// import TrustBar from "./StoreSections/TrustBar";
import CategorySection from "./StoreSections/CategorySection";
import FlashSale from "./StoreSections/FlashSale";
import PromoBanner from "./StoreSections/PromoBanner";
import FeaturedProducts from "./StoreSections/FeaturedProducts";
import Testimonials from "./StoreSections/Testimonials";
import RecentlyViewed from "./StoreSections/RecentlyViewed";
import Newsletter from "./StoreSections/Newsletter";
import FooterCTA from "./StoreSections/FooterCTA";
import BackToTop from "./StoreSections/BackToTop";
import StoreHeader from "./StoreSections/StoreHeader";


export default function StoreHome() {
  const dispatch = useDispatch();

  const productsState = useSelector((state) => state.products);
  const products = productsState?.items || [];
  const loading = productsState?.loading || false;

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProduct({ limit: 12 }));
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(products.slice(0, 8));

      const discounted = products.filter(
        (p) => p.comparePrice && p.comparePrice > p.price
      );
      setDiscountProducts(discounted);

      const uniqueCategories = [
        ...new Set(products.map((p) => p.category).filter(Boolean)),
      ].slice(0, 6);
      setCategories(uniqueCategories);
    }
  }, [products]);

  // ── Shared cart handler ───────────────────────────────────────────────────
  // cartSlice.addToCart expects: { product, name, image, price, qty }
  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: 1,
      })
    );
  };

  return (
    <div className="bg-white overflow-hidden">
      <StoreHeader/>
      <HeroSection />
      {/* <TrustBar /> */}
      <FlashSale
        products={discountProducts}
        onAddToCart={handleAddToCart}  // ← was missing
      />
      <CategorySection categories={categories} products={products} />


      <PromoBanner />

      <FeaturedProducts
        products={featuredProducts}
        loading={loading}
        onAddToCart={handleAddToCart}
      />

      <Testimonials />

      <RecentlyViewed
        products={featuredProducts.slice(0, 4)}
        onAddToCart={handleAddToCart}
      />

      <Newsletter />
      <FooterCTA />
      <BackToTop />
    </div>
  );
}