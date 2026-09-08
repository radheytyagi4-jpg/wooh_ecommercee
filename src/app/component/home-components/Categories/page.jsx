"use client";

import Link from "next/link";

const categories = [
  {
    name: "Atta & Flours",
    emoji: "🌾",
    color: "bg-[#E9E0C9]",
  },
  {
    name: "Dry Fruits",
    emoji: "🥜",
    color: "bg-[#E8D5C4]",
  },
  {
    name: "Snacks",
    emoji: "🍿",
    color: "bg-[#F3D7B5]",
  },
  {
    name: "Beverages",
    emoji: "🥤",
    color: "bg-[#D9E4D5]",
  },
  {
    name: "Dairy",
    emoji: "🥛",
    color: "bg-[#E4E8DC]",
  },
  {
    name: "Personal Care",
    emoji: "🧴",
    color: "bg-[#E9DDE5]",
  },
  {
    name: "Household",
    emoji: "🧹",
    color: "bg-[#DDE5E0]",
  },
  {
    name: "Instant Food",
    emoji: "🍜",
    color: "bg-[#F0D9C9]",
  },
];

export default function page() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#FFA726]">
            Explore
          </p>

          <h2 className="text-3xl font-black tracking-tight text-[#102820] sm:text-4xl">
            Shop by category
          </h2>
        </div>

        <Link
          href="/products"
          className="hidden text-sm font-bold text-[#102820] underline underline-offset-4 sm:block"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <Link
            href={`/products?category=${encodeURIComponent(category.name)}`}
            key={category.name}
            className="group"
          >
            <div
              className={`${category.color} flex aspect-square items-center justify-center rounded-3xl transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}
            >
              <span className="text-5xl transition duration-300 group-hover:scale-110">
                {category.emoji}
              </span>
            </div>

            <p className="mt-3 text-center text-sm font-bold text-[#102820]">
              {category.name}
            </p>
          </Link>
        ))}
      </div>

      <Link
        href="/products"
        className="mt-7 block text-center text-sm font-bold text-[#102820] underline underline-offset-4 sm:hidden"
      >
        View all categories →
      </Link>
    </section>
  );
}