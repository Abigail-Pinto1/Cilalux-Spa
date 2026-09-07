import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", toggle);

    return () =>
      window.removeEventListener("scroll", toggle);
  }, []);

  const scrollTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  if (!visible) return null;

  return (
    <button
      onClick={scrollTop}
      className="
      fixed
      bottom-6
      right-6
      z-50
      bg-indigo-600
      text-white
      p-4
      rounded-full
      shadow-xl
      hover:scale-110
      transition
      "
    >
      <ChevronUp size={22} />
    </button>
  );
}