"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);

  const image =
    product?.images?.[0] ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

  const addToCart = async () => {
    try {
      setAdding(true);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(data.error || "Unable to add product");
      }

      alert("Added to cart 🛒");
    } catch (error) {
      alert(error.message);
    } finally {
      setAdding(false);
    }
  };

  const discount =
    product?.discount ||
    (product?.originalPrice && product?.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0);

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#102820]/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* IMAGE */}
      <Link href={`/products/${product?._id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#EEE8DC]">

          {discount > 0 && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#FFA726] px-3 py-1.5 text-[11px] font-black text-[#102820]">
              {discount}% OFF
            </span>
          )}

          <img
            src={image}
            alt={product?.title || "Product"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4">

        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#102820]/40">
          {product?.brand || "Wooh"}
        </p>

        <Link href={`/products/${product?._id}`}>
          <h3 className="line-clamp-2 min-h-[48px] text-base font-extrabold leading-6 text-[#102820] hover:text-[#557A68]">
            {product?.title || "Product"}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-black text-[#102820]">
            ₹{product?.price || 0}
          </span>

          {product?.originalPrice > product?.price && (
            <span className="text-sm text-[#102820]/40 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">

          <button
            onClick={addToCart}
            disabled={adding || product?.stock === 0}
            className="flex-1 rounded-full bg-[#102820] px-4 py-3 text-sm font-bold text-[#F8F2E7] transition hover:bg-[#18382D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product?.stock === 0
              ? "Out of stock"
              : adding
              ? "Adding..."
              : "Add to cart"}
          </button>

          <Link
            href={`/products/${product?._id}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#102820]/10 text-lg transition hover:bg-[#F8F2E7]"
          >
            →
          </Link>

        </div>
      </div>
    </article>
  );
}