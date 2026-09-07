"use client"
import React, { useState } from 'react'
import Link from 'next/link'

function Hamburger() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleLinks = () => {
        setIsOpen((prev) => !prev)
    }

    return (
        <div className="relative">
            <button
                className="w-10 h-10 m-3 text-2xl text-[#1E3B2C] hover:text-[#B14A2A]"
                onClick={toggleLinks}
            >
                <b>≡</b>
            </button>

            <div
                className={`fixed top-0 h-screen w-64 max-w-[80vw] bg-[#1E3B2C] text-[#F7F1E4] p-6 pt-20 z-50 shadow-xl transition-all duration-300 ${
                    isOpen ? "left-0" : "-left-full"
                }`}
            >
                <ul className="flex flex-col gap-6 text-xl">
                    <Link href="/" onClick={toggleLinks}><li className="hover:text-[#E3A23D]">Home</li></Link>
                    <Link href="/Aboutus" onClick={toggleLinks}><li className="hover:text-[#E3A23D]">About us</li></Link>
                    <Link href="/Auth" onClick={toggleLinks}><li className="hover:text-[#E3A23D]">Login/Logout</li></Link>
                    <Link href="/Profile" onClick={toggleLinks}><li className="hover:text-[#E3A23D]">Profile</li></Link>
                    <Link href="/Orders" onClick={toggleLinks}><li className="hover:text-[#E3A23D]">Orders</li></Link>
                    <Link href="/Cart" onClick={toggleLinks}><li className="hover:text-[#E3A23D]">Cart</li></Link>
                    <Link href="/Sell" onClick={toggleLinks}><li className="hover:text-[#E3A23D]">+</li></Link>
                    <Link href="/Sold" onClick={toggleLinks}><li className="hover:text-[#E3A23D]">Sold</li></Link>
                </ul>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={toggleLinks}
                />
            )}
        </div>
    )
}

export default Hamburger