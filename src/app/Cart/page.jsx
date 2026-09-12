"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function page() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/cart");

      if (res.status === 401) {
        window.location.href = "/Auth";
        return;
      }

      const data = await res.json();

      setCart(data.cart || data.data || data);
    } catch (error) {
      console.error("Cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      setUpdating(productId);

      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to update cart");
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(productId);

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to remove item");
      }

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove everything from your cart?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await fetch("/api/cart", {
        method: "DELETE",
      });

      await fetchCart();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F2E7]">
        <CartHeader />

        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-[#102820]/10" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-3xl bg-white"
                />
              ))}
            </div>

            <div className="h-80 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];

  const subtotal =
    cart?.subtotal ??
    items.reduce((total, item) => {
      const price =
        item.product?.price ??
        item.price ??
        0;

      return total + price * item.quantity;
    }, 0);

  const delivery = subtotal >= 499 || subtotal === 0 ? 0 : 40;

  const total = subtotal + delivery;

  return (
    <main className="min-h-screen bg-[#F8F2E7]">
      <CartHeader />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE TITLE */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFA726]">
              Wooh cart
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102820] sm:text-5xl">
              Your cart
            </h1>

            <p className="mt-2 text-sm text-[#102820]/50">
              {items.length === 0
                ? "Your cart is waiting for something good."
                : `${items.length} ${
                    items.length === 1 ? "item" : "items"
                  } ready to go.`}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="w-fit rounded-full border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Clear cart
            </button>
          )}
        </div>

        {/* EMPTY CART */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">

            {/* CART ITEMS */}
            <div className="space-y-4">

              {items.map((item, index) => {
                const product = item.product || item;

                const productId =
                  product._id ||
                  item.productId;

                const image =
                  product.images?.[0] ||
                  product.image ||
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80";

                const price =
                  product.price ??
                  item.price ??
                  0;

                const quantity = item.quantity || 1;

                return (
                  <div
                    key={productId || index}
                    className="group rounded-[1.75rem] border border-[#102820]/10 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">

                      {/* PRODUCT IMAGE */}
                      <Link
                        href={`/products/${productId}`}
                        className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#EEE8DC] sm:h-36 sm:w-36"
                      >
                        <img
                          src={image}
                          alt={product.title || "Product"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* DETAILS */}
                      <div className="min-w-0 flex-1">

                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#102820]/40">
                              {product.brand || "Wooh"}
                            </p>

                            <Link
                              href={`/products/${productId}`}
                            >
                              <h2 className="mt-1 line-clamp-2 text-base font-black leading-6 text-[#102820] hover:text-[#557A68] sm:text-lg">
                                {product.title || "Product"}
                              </h2>
                            </Link>
                          </div>

                          {/* REMOVE */}
                          <button
                            onClick={() => removeItem(productId)}
                            disabled={updating === productId}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#102820]/30 transition hover:bg-red-50 hover:text-red-500"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                          {/* PRICE */}
                          <div>
                            <span className="text-xl font-black text-[#102820]">
                              ₹{price}
                            </span>

                            {product.originalPrice > price && (
                              <span className="ml-2 text-sm text-[#102820]/30 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>

                          {/* QUANTITY */}
                          <div className="flex items-center rounded-full border border-[#102820]/10 bg-[#F8F2E7]">

                            <button
                              onClick={() =>
                                updateQuantity(
                                  productId,
                                  quantity - 1
                                )
                              }
                              disabled={updating === productId}
                              className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-[#102820] transition hover:bg-[#102820] hover:text-white disabled:opacity-50"
                            >
                              −
                            </button>

                            <span className="w-8 text-center text-sm font-black text-[#102820]">
                              {quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  productId,
                                  quantity + 1
                                )
                              }
                              disabled={updating === productId}
                              className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-[#102820] transition hover:bg-[#102820] hover:text-white disabled:opacity-50"
                            >
                              +
                            </button>

                          </div>

                        </div>

                        {/* ITEM TOTAL */}
                        <p className="mt-3 text-xs font-semibold text-[#102820]/40">
                          Item total:{" "}
                          <span className="font-black text-[#102820]">
                            ₹{price * quantity}
                          </span>
                        </p>

                      </div>
                    </div>
                  </div>
                );
              })}

              {/* CONTINUE SHOPPING */}
              <Link
                href="/products"
                className="flex items-center justify-center rounded-3xl border border-[#102820]/10 bg-white py-4 text-sm font-black text-[#102820] transition hover:bg-[#102820] hover:text-white"
              >
                ← Continue shopping
              </Link>
            </div>

            {/* SUMMARY */}
            <aside className="lg:sticky lg:top-6">

              <div className="rounded-[2rem] bg-[#102820] p-6 text-[#F8F2E7] shadow-xl sm:p-7">

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black">
                    Order summary
                  </h2>

                  <span className="rounded-full bg-[#F8F2E7]/10 px-3 py-1 text-xs font-bold">
                    {items.length} items
                  </span>
                </div>

                <div className="my-6 h-px bg-[#F8F2E7]/10" />

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between">
                    <span className="text-[#F8F2E7]/50">
                      Subtotal
                    </span>

                    <span className="font-bold">
                      ₹{subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#F8F2E7]/50">
                      Delivery
                    </span>

                    <span className="font-bold">
                      {delivery === 0 ? (
                        <span className="text-[#FFA726]">
                          FREE
                        </span>
                      ) : (
                        `₹${delivery}`
                      )}
                    </span>
                  </div>

                  {subtotal > 0 && subtotal < 499 && (
                    <div className="rounded-2xl bg-[#F8F2E7]/10 p-3 text-xs leading-5 text-[#F8F2E7]/60">
                      Add ₹{499 - subtotal} more to unlock
                      <span className="font-black text-[#FFA726]">
                        {" "}
                        free delivery
                      </span>
                      .
                    </div>
                  )}

                </div>

                <div className="my-6 h-px bg-[#F8F2E7]/10" />

                <div className="flex items-end justify-between">

                  <span className="text-sm font-semibold text-[#F8F2E7]/50">
                    Total
                  </span>

                  <span className="text-3xl font-black text-[#FFA726]">
                    ₹{total}
                  </span>

                </div>

                <Link
                  href="/checkout"
                  className="mt-7 flex w-full items-center justify-center rounded-full bg-[#FFA726] px-6 py-4 text-sm font-black text-[#102820] transition hover:-translate-y-0.5 hover:bg-[#ffb74d]"
                >
                  Proceed to checkout →
                </Link>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#F8F2E7]/40">
                  <span>🔒</span>
                  Secure checkout
                </div>

              </div>

              {/* DELIVERY CARD */}
              <div className="mt-4 rounded-[2rem] border border-[#102820]/10 bg-white p-5">

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#DDE8D9] text-xl">
                    🚚
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#102820]">
                      Fast delivery
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#102820]/50">
                      Get your groceries delivered fresh
                      and fast.
                    </p>
                  </div>
                </div>

              </div>

            </aside>
          </div>
        )}
      </section>
    </main>
  );
}


/* ---------------- HEADER ---------------- */

function CartHeader() {
  return (
    <header className="border-b border-[#102820]/10 bg-[#F8F2E7]/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link
          href="/"
          className="text-3xl font-black tracking-[-0.08em] text-[#102820]"
        >
          wo<span className="text-[#FFA726]">o</span>h
        </Link>

        <Link
          href="/products"
          className="rounded-full bg-[#102820] px-5 py-2.5 text-sm font-bold text-[#F8F2E7] transition hover:bg-[#18382D]"
        >
          Continue shopping
        </Link>

      </div>
    </header>
  );
}


/* ---------------- EMPTY CART ---------------- */

function EmptyCart() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[2rem] border border-[#102820]/10 bg-white px-6 text-center">

      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DDE8D9] text-5xl">
        🛒
      </div>

      <h2 className="mt-7 text-2xl font-black text-[#102820]">
        Your cart is empty
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#102820]/50">
        Looks like you haven't added anything yet.
        Discover fresh groceries, snacks and everyday
        essentials.
      </p>

      <Link
        href="/products"
        className="mt-7 rounded-full bg-[#102820] px-7 py-3.5 text-sm font-black text-[#F8F2E7] transition hover:-translate-y-0.5 hover:bg-[#18382D]"
      >
        Start shopping →
      </Link>

    </div>
  );
}