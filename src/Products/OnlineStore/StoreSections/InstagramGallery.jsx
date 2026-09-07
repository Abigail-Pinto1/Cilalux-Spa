import React from "react";

const images = [
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
];

export default function InstagramGallery() {
  return (
    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">

          <h2 className="text-5xl font-bold">
            Follow Our Journey
          </h2>

          <p className="text-gray-500 mt-3">
            @yourstore
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {images.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl"
            >
              <img
                src={img}
                alt=""
                className="w-full h-80 object-cover hover:scale-110 transition duration-700"
              />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}