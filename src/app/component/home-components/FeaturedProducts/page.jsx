"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../../common/ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true&limit=8");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data.products || data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <section className="bg-[#102820] px-4 py-16 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 flex items-end justify-between">

          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#FFA726]">
              Handpicked for you
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[#F8F2E7] sm:text-4xl">
              Featured products
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#F8F2E7]/60">
              Everyday favourites and premium picks that deserve a spot
              in your kitchen.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden rounded-full border border-[#F8F2E7]/20 px-5 py-2.5 text-sm font-bold text-[#F8F2E7] transition hover:bg-[#F8F2E7]/10 sm:block"
          >
            Shop all →
          </Link>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-[0.8] animate-pulse rounded-3xl bg-[#F8F2E7]/10"
              />
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && products.length === 0 && (
          <div className="rounded-3xl border border-[#F8F2E7]/10 bg-[#F8F2E7]/5 px-6 py-16 text-center">

            <div className="text-5xl">🛒</div>

            <h3 className="mt-5 text-xl font-black text-[#F8F2E7]">
              Products coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#F8F2E7]/50">
              Our shelves are getting stocked. Check back soon for
              fresh products and amazing deals.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-full bg-[#FFA726] px-6 py-3 text-sm font-bold text-[#102820]"
            >
              Browse products
            </Link>

          </div>
        )}

        {/* MOBILE BUTTON */}
        <Link
          href="/products"
          className="mt-8 block rounded-full border border-[#F8F2E7]/20 px-5 py-3 text-center text-sm font-bold text-[#F8F2E7] sm:hidden"
        >
          Shop all products →
        </Link>

      </div>
    </section>
  );
}