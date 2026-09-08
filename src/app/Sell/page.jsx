"use client"
import { useState } from "react"
import { Fraunces, Karla } from "next/font/google"

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"] })
const karla = Karla({ subsets: ["latin"], weight: ["400", "500"] })

export default function page() {
    const [images, setImages] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState("")

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const previews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }))
        setImages((prev) => [...prev, ...previews].slice(0, 5))
    }

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("price", price)
        formData.append("category", category)
        formData.append("stock", stock)
        images.forEach((img) => formData.append("images", img.file))

        const res = await fetch("/api/products/create", {
            method: "POST",
            body: formData,
        })
        const data = await res.json()
        console.log(data)
    }

    return (
        <main className={`${karla.className} bg-[#F7F1E4] min-h-screen px-6 py-16`}>
            <div className="max-w-3xl mx-auto">
                <h1 className={`${fraunces.className} text-4xl text-[#1E3B2C]`}>List a new product</h1>
                <p className="mt-2 text-[#6B6355]">Add a few photos and details — buyers will see this exactly as you fill it in.</p>

                <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8">

                    <div>
                        <label className="block text-sm font-medium text-[#1E3B2C] mb-3">Photos</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {images.map((img, i) => (
                                <div key={i} className="relative aspect-square border border-[#D9CFB8] bg-[#FFFDF8]">
                                    <img src={img.url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 bg-[#1E3B2C] text-[#F7F1E4] w-5 h-5 text-xs leading-none"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            {images.length < 5 && (
                                <label className="aspect-square border border-dashed border-[#B14A2A] flex items-center justify-center text-2xl text-[#B14A2A] cursor-pointer hover:bg-[#FFFDF8]">
                                    +
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-[#6B6355] mt-2">Up to 5 photos. First photo is the cover.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1E3B2C] mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Hand-stitched cotton kurta"
                            className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:outline-none focus:border-[#1E3B2C]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1E3B2C] mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is it, what's it made of, what should a buyer know before ordering?"
                            rows={4}
                            className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:outline-none focus:border-[#1E3B2C] resize-none"
                            required
                        />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#1E3B2C] mb-2">Price (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="499"
                                min="0"
                                className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:outline-none focus:border-[#1E3B2C]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1E3B2C] mb-2">Stock</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="10"
                                min="0"
                                className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:outline-none focus:border-[#1E3B2C]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1E3B2C] mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-[#D9CFB8] bg-[#FFFDF8] px-4 py-3 focus:outline-none focus:border-[#1E3B2C]"
                                required
                            >
                                <option value="">Select</option>
                                <option value="clothing">Clothing</option>
                                <option value="food">Food</option>
                                <option value="jewelry">Jewelry</option>
                                <option value="home">Home & decor</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="self-start bg-[#1E3B2C] text-[#F7F1E4] px-8 py-3 text-sm font-medium hover:bg-[#16301F] transition-colors"
                    >
                        List product
                    </button>
                </form>
            </div>
        </main>
    )
}