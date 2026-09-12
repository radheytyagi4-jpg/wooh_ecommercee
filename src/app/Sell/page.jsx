"use client";

import { useState } from "react";
import { Fraunces, Karla } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function Page() {
  // -----------------------------
  // FORM STATES
  // -----------------------------

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  // -----------------------------
  // UI STATES
  // -----------------------------

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // IMAGE SELECT
  // -----------------------------

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const remainingSlots = 5 - images.length;

    const selectedFiles = files.slice(0, remainingSlots);

    const previews = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previews]);

    // Reset input so same image can be selected again
    e.target.value = "";
  };

  // -----------------------------
  // REMOVE IMAGE
  // -----------------------------

  const removeImage = (index) => {
    setImages((prev) => {
      const imageToRemove = prev[index];

      if (imageToRemove?.url) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // -----------------------------
  // SUBMIT PRODUCT
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    // Basic validation
    if (images.length === 0) {
      setError("Please upload at least one product image.");
      setLoading(false);
      return;
    }

    if (images.length > 5) {
      setError("You can upload maximum 5 images.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);

      // Add every selected image
      images.forEach((img) => {
        formData.append("images", img.file);
      });

      console.log("Sending product...");

      const res = await fetch("/api/products/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      console.log("API response:", data);

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to list product"
        );
      }

      // -----------------------------
      // SUCCESS
      // -----------------------------

      setMessage("Product listed successfully!");

      // Clear form
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setStock("");

      // Remove image preview URLs
      images.forEach((img) => {
        if (img.url) {
          URL.revokeObjectURL(img.url);
        }
      });

      setImages([]);

      /*
        Redirect after a short delay.

        Change this to "/products" when your
        products page is ready.
      */

      setTimeout(() => {
        window.location.href = "/products";
      }, 1000);
    } catch (error) {
      console.error("LIST PRODUCT ERROR:", error);

      setError(
        error.message || "Something went wrong while listing product."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <main
      className={`${karla.className} min-h-screen bg-[#F7F1E4] px-6 py-16`}
    >
      <div className="mx-auto max-w-3xl">

        {/* HEADING */}

        <h1
          className={`${fraunces.className} text-4xl text-[#1E3B2C]`}
        >
          List a new product
        </h1>

        <p className="mt-2 text-[#6B6355]">
          Add a few photos and details — buyers will see this
          exactly as you fill it in.
        </p>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            ✓ {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            ⚠ {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-8"
        >

          {/* -----------------------------
              PHOTOS
          ----------------------------- */}

          <div>
            <label className="mb-3 block text-sm font-medium text-[#1E3B2C]">
              Photos
            </label>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">

              {/* IMAGE PREVIEWS */}

              {images.map((img, i) => (
                <div
                  key={`${img.url}-${i}`}
                  className="relative aspect-square overflow-hidden border border-[#D9CFB8] bg-[#FFFDF8]"
                >
                  <img
                    src={img.url}
                    alt={`Product ${i + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1E3B2C] text-xs text-[#F7F1E4] hover:bg-[#B14A2A]"
                  >
                    ✕
                  </button>

                  {/* COVER LABEL */}

                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-[#1E3B2C] px-2 py-1 text-[10px] font-medium text-white">
                      COVER
                    </span>
                  )}
                </div>
              ))}

              {/* ADD IMAGE */}

              {images.length < 5 && (
                <label className="flex aspect-square cursor-pointer items-center justify-center border border-dashed border-[#B14A2A] text-3xl text-[#B14A2A] transition hover:bg-[#FFFDF8]">
                  +

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <p className="mt-2 text-xs text-[#6B6355]">
              Up to 5 photos. First photo is the cover.
            </p>
          </div>

          {/* -----------------------------
              TITLE
          ----------------------------- */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1E3B2C]">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hand-stitched cotton kurta"
              className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:border-[#1E3B2C] focus:outline-none"
              required
            />
          </div>

          {/* -----------------------------
              DESCRIPTION
          ----------------------------- */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1E3B2C]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is it, what's it made of, what should a buyer know before ordering?"
              rows={4}
              className="w-full resize-none border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:border-[#1E3B2C] focus:outline-none"
              required
            />
          </div>

          {/* -----------------------------
              PRICE / STOCK / CATEGORY
          ----------------------------- */}

          <div className="grid gap-6 sm:grid-cols-3">

            {/* PRICE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1E3B2C]">
                Price (₹)
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="499"
                min="0"
                className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:border-[#1E3B2C] focus:outline-none"
                required
              />
            </div>

            {/* STOCK */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1E3B2C]">
                Stock
              </label>

              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                min="0"
                className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:border-[#1E3B2C] focus:outline-none"
                required
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#1E3B2C]">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:border-[#1E3B2C] focus:outline-none"
                required
              >
                <option value="">
                  Select
                </option>

                <option value="clothing">
                  Clothing
                </option>

                <option value="food">
                  Food
                </option>

                <option value="jewelry">
                  Jewelry
                </option>

                <option value="home">
                  Home & decor
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>
          </div>

          {/* -----------------------------
              SUBMIT
          ----------------------------- */}

          <button
            type="submit"
            disabled={loading}
            className="self-start bg-[#1E3B2C] px-8 py-3 text-sm font-medium text-[#F7F1E4] transition-colors hover:bg-[#16301F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Listing product..."
              : "List product"}
          </button>

        </form>
      </div>
    </main>
  );
}