"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SoldPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const fetchSoldOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/sold", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load sold products");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);

      const res = await fetch("/api/sold", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to update order");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: data.order.status }
            : order
        )
      );
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setUpdating("");
    }
  };

  const totalSales = orders.reduce((total, order) => {
    const price = Number(order.product?.price || 0);
    const quantity = Number(order.quantity || 0);

    return total + price * quantity;
  }, 0);

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  return (
    <main className="min-h-screen bg-[#F8F2E7] text-[#102820] pt-25">
      {/* PAGE HEADER */}
      <section className="border-b border-[#102820]/20 px-5 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFA726]">
                Seller Dashboard
              </p>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Sold Products
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#102820]/65 md:text-base">
                Manage products purchased by customers, check your sales,
                and update delivery status.
              </p>
            </div>

            <Link
              href="/Sell"
              className="inline-flex w-fit items-center rounded-full bg-[#102820] px-6 py-3 text-sm font-bold text-[#F8F2E7] transition hover:bg-[#0B1D17]"
            >
              + Sell a Product
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-5 py-7 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon="📦"
          />

          <StatCard
            title="Total Sales"
            value={`₹${totalSales.toLocaleString("en-IN")}`}
            icon="💰"
          />

          <StatCard
            title="Pending"
            value={pendingOrders}
            icon="⏳"
          />

          <StatCard
            title="Delivered"
            value={deliveredOrders}
            icon="✓"
          />
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 pb-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {loading && <LoadingState />}

          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <div className="mb-3 text-4xl">⚠️</div>

              <h2 className="text-xl font-bold text-red-700">
                Unable to load orders
              </h2>

              <p className="mt-2 text-sm text-red-600">{error}</p>

              <button
                onClick={fetchSoldOrders}
                className="mt-5 rounded-full bg-[#102820] px-6 py-3 text-sm font-bold text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <EmptyState />
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-5">
              {orders.map((order) => {
                const product = order.product;
                const buyer = order.orderedby;

                const price = Number(product?.price || 0);
                const quantity = Number(order.quantity || 0);
                const total = price * quantity;

                return (
                  <article
                    key={order._id}
                    className="overflow-hidden rounded-[28px] border border-[#102820]/10 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-6 p-5 md:p-6 lg:flex-row lg:items-center">
                      {/* PRODUCT IMAGE */}
                      <div className="h-32 w-full shrink-0 overflow-hidden rounded-2xl bg-[#F8F2E7] sm:h-36 sm:w-36">
                        {product?.image ? (
                          <img
                            src={product.image}
                            alt={product.title || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-5xl">
                            🛍️
                          </div>
                        )}
                      </div>

                      {/* PRODUCT INFO */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#102820]/45">
                              Product
                            </p>

                            <h2 className="mt-1 text-xl font-black md:text-2xl">
                              {product?.title || "Product unavailable"}
                            </h2>
                          </div>

                          <StatusBadge status={order.status} />
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#102820]/60">
                          {product?.detail || "No product description available."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                          <span>
                            <span className="text-[#102820]/45">Price: </span>
                            <strong>₹{price.toLocaleString("en-IN")}</strong>
                          </span>

                          <span>
                            <span className="text-[#102820]/45">
                              Quantity:{" "}
                            </span>
                            <strong>{quantity}</strong>
                          </span>

                          <span>
                            <span className="text-[#102820]/45">
                              Total:{" "}
                            </span>
                            <strong className="text-[#FFA726]">
                              ₹{total.toLocaleString("en-IN")}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* BUYER + STATUS */}
                      <div className="w-full border-t border-[#102820]/10 pt-5 lg:w-64 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#102820]/45">
                          Purchased By
                        </p>

                        <p className="mt-1 font-bold">
                          {buyer?.username || "Customer"}
                        </p>

                        {buyer?.email && (
                          <p className="mt-1 break-all text-xs text-[#102820]/55">
                            {buyer.email}
                          </p>
                        )}

                        <div className="mt-5">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#102820]/45">
                            Update Status
                          </label>

                          <select
                            value={order.status || "Pending"}
                            disabled={updating === order._id}
                            onChange={(e) =>
                              updateStatus(order._id, e.target.value)
                            }
                            className="w-full rounded-xl border border-[#102820]/15 bg-[#F8F2E7] px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#102820]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancel">Cancelled</option>
                          </select>
                        </div>

                        {order.createdAt && (
                          <p className="mt-3 text-xs text-[#102820]/45">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-3xl border border-[#102820]/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#102820]/45">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black md:text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F2E7] text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STATUS ---------------- */

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Delivered: "bg-green-100 text-green-800",
    Cancel: "bg-red-100 text-red-700",
  };

  const labels = {
    Pending: "Pending",
    Delivered: "Delivered",
    Cancel: "Cancelled",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[status] || status || "Pending"}
    </span>
  );
}

/* ---------------- LOADING ---------------- */

function LoadingState() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-[28px] bg-white p-6"
        >
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="h-36 w-full rounded-2xl bg-[#F8F2E7] md:w-36" />

            <div className="flex-1 space-y-4">
              <div className="h-5 w-2/3 rounded bg-[#F8F2E7]" />
              <div className="h-4 w-full rounded bg-[#F8F2E7]" />
              <div className="h-4 w-1/2 rounded bg-[#F8F2E7]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- EMPTY ---------------- */

function EmptyState() {
  return (
    <div className="rounded-[32px] border border-[#102820]/10 bg-white px-6 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F2E7] text-4xl">
        📦
      </div>

      <h2 className="mt-6 text-2xl font-black">
        No products sold yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#102820]/55">
        When customers purchase one of your products, their orders will
        appear here.
      </p>

      <Link
        href="/Sell"
        className="mt-6 inline-flex rounded-full bg-[#102820] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#0B1D17]"
      >
        Start Selling
      </Link>
    </div>
  );
}