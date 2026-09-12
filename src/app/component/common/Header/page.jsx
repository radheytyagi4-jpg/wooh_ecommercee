"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Homeburger from "../../home-components/Hamburger";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Check whether user is logged in
  const checkUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("User check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      // Remove user from Header immediately
      setUser(null);

      // Optional: send user to home
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert(error.message || "Unable to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#102820]/20 bg-[#F8F2E7]">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-4 md:px-8">
        
        {/* LEFT */}
        <div>
          <Homeburger />
        </div>

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Wooh"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </Link>

        {/* RIGHT AUTH BUTTON */}
        <div className="min-w-[90px] text-right">
          {loading ? (
            <div className="inline-block h-9 w-20 animate-pulse rounded-full bg-[#102820]/10" />
          ) : user ? (
            <button
              onClick={logout}
              disabled={loggingOut}
              className="rounded-full border border-[#102820] px-5 py-2 text-sm font-semibold text-[#102820] transition hover:bg-[#102820] hover:text-[#F8F2E7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link
              href="/Auth"
              className="inline-block rounded-full border border-[#102820] px-5 py-2 text-sm font-semibold text-[#102820] transition hover:bg-[#102820] hover:text-[#F8F2E7]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}