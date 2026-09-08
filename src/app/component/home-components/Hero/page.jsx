"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    tag: "FRESH PICKS",
    title: "Everything fresh.",
    highlight: "Everything Wooh.",
    description:
      "Your everyday groceries, snacks and essentials delivered straight to your door.",
    button: "Shop groceries",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    tag: "EVERYDAY ESSENTIALS",
    title: "Stock up.",
    highlight: "Save more.",
    description:
      "From atta and dals to beverages and snacks — everything you need in one place.",
    button: "Explore essentials",
    image:
      "https://images.unsplash.com/photo-1601598851547-4302969d6a3b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    tag: "SNACK TIME",
    title: "Your cravings.",
    highlight: "Sorted.",
    description:
      "Grab your favourite drinks, coffee, Maggi and snacks whenever you want.",
    button: "Shop snacks",
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2aa55345?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function page() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="px-4 pt-35 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#102820]">
        <div className="grid min-h-[520px] lg:grid-cols-2">

          {/* LEFT */}
          <div className="relative z-10 flex flex-col justify-center px-7 py-14 sm:px-12 lg:px-16">

            <span className="mb-5 w-fit rounded-full bg-[#F8F2E7]/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#FFA726]">
              {slide.tag}
            </span>

            <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-tight text-[#F8F2E7] sm:text-6xl lg:text-7xl">
              {slide.title}
              <br />
              <span className="text-[#FFA726]">
                {slide.highlight}
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-[#F8F2E7]/70 sm:text-lg">
              {slide.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-[#FFA726] px-7 py-3.5 text-sm font-bold text-[#102820] transition hover:-translate-y-0.5 hover:bg-[#ffb74d]"
              >
                {slide.button} →
              </Link>

              <Link
                href="/products"
                className="rounded-full border border-[#F8F2E7]/20 px-7 py-3.5 text-sm font-bold text-[#F8F2E7] transition hover:bg-[#F8F2E7]/10"
              >
                View all
              </Link>
            </div>

            {/* Slider dots */}
            <div className="mt-10 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    current === index
                      ? "w-8 bg-[#FFA726]"
                      : "w-2 bg-[#F8F2E7]/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative min-h-[300px] lg:min-h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#102820] via-[#102820]/20 to-transparent" />

            <div className="absolute bottom-7 right-7 rounded-2xl bg-[#F8F2E7]/90 px-5 py-4 shadow-xl backdrop-blur">
              <p className="text-xs font-semibold text-[#102820]/60">
                DELIVERY
              </p>
              <p className="text-xl font-black text-[#102820]">
                In 20 mins
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}