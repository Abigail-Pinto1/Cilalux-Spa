import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle } from "lucide-react";
import ProductCard from "./ProductCard";

const SALE_DURATION = { hours: 12, minutes: 59, seconds: 59 };

function toSeconds({ hours, minutes, seconds }) {
  return hours * 3600 + minutes * 60 + seconds;
}

function fromSeconds(total) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { hours, minutes, seconds };
}

export default function FlashSale({ products = [], onAddToCart }) {
  const navigate = useNavigate();
  const BATCH_SIZE = 4;

  const [timeLeft, setTimeLeft] = useState(SALE_DURATION);
  const [batchIndex, setBatchIndex] = useState(0);
  const [addedIds, setAddedIds] = useState(new Set());

  const totalBatches = Math.ceil(products.length / BATCH_SIZE);
  const currentProducts = products.slice(
    batchIndex * BATCH_SIZE,
    batchIndex * BATCH_SIZE + BATCH_SIZE
  );

  // ── Countdown + rotation ─────────────────────────────────────────────────
  useEffect(() => {
    let remaining = toSeconds(SALE_DURATION);

    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        setBatchIndex((prev) => (prev + 1) % (totalBatches || 1));
        setAddedIds(new Set());
        remaining = toSeconds(SALE_DURATION);
      }
      setTimeLeft(fromSeconds(remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [totalBatches]);

  // ── Add to cart → navigate ───────────────────────────────────────────────
  const handleAddToCart = useCallback(
    (product) => {
      if (typeof onAddToCart === "function") {
        onAddToCart(product); // dispatches Redux addToCart in StoreHome
      }

      // Flash the "Added!" badge briefly
      setAddedIds((prev) => new Set(prev).add(product._id));
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(product._id);
          return next;
        });
      }, 800);

      // Navigate to cart after badge is visible
      setTimeout(() => {
        navigate("/store/cart");
      }, 900);
    },
    [onAddToCart, navigate]
  );

  if (!products.length) return null;

  const pad = (n) => String(n).padStart(2, "0");
  const isUrgent = toSeconds(timeLeft) <= 60;

  return (
    <section className="py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              <Clock size={16} />
              Flash Sale
            </span>
            <h2 className="text-5xl text-white font-bold mt-4">
              Limited Time Deals
            </h2>
            {totalBatches > 1 && (
              <p className="text-white/50 text-sm mt-2">
                Batch {batchIndex + 1} of {totalBatches} · next batch when timer resets
              </p>
            )}
          </div>

          {/* ── Countdown ── */}
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            {[
              { label: "HRS", value: timeLeft.hours },
              { label: "MIN", value: timeLeft.minutes },
              { label: "SEC", value: timeLeft.seconds },
            ].map(({ label, value }, i) => (
              <React.Fragment key={label}>
                {i !== 0 && (
                  <span className={`text-2xl font-bold pb-4 ${isUrgent ? "text-red-400 animate-pulse" : "text-white/40"}`}>
                    :
                  </span>
                )}
                <div className={`backdrop-blur-lg rounded-2xl px-5 py-4 text-center min-w-[80px] transition-colors duration-500 ${isUrgent ? "bg-red-500/30 ring-1 ring-red-400" : "bg-white/10"}`}>
                  <div className={`text-3xl font-bold tabular-nums ${isUrgent ? "text-red-300" : "text-white"}`}>
                    {pad(value)}
                  </div>
                  <div className="text-[10px] tracking-widest text-white/40 mt-1">
                    {label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Product grid ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
              {addedIds.has(product._id) && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                  <CheckCircle size={13} />
                  Added!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Batch dots ── */}
        {totalBatches > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalBatches }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === batchIndex ? "bg-white scale-125" : "bg-white/30"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}