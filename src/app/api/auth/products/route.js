import { connectDb } from "@/app/config/db";
import Product from "@/app/model/product";
import { ApiError } from "@/app/lib/ApiError";
import { ApiResponse } from "@/app/lib/ApiResponse";
import { sendResponse } from "@/app/lib/sendResponse";

export async function GET(request) {
    try {
        await connectDb();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        const query = {};
        if (category) query.category = category;
        if (search) query.title = { $regex: escapeRegex(search), $options: "i" };

        const products = await Product.find(query).sort({ createdAt: -1 });

        return sendResponse(new ApiResponse(200, products, "Products fetched successfully"));

    } catch (error) {
        console.error(error);
        return sendResponse(new ApiError(500, "Failed to fetch products"));
    }
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}