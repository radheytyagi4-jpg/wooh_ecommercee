//data ayga
//validation hogi
//user find krna 
//password verify krna
//next auth use krna
//response dena login ka
//or tokens send krnw

import { connectDb } from "@/app/config/db";
import { User } from "@/app/model/user";
import bcrypt from "bcrypt";
import { ApiError } from "@/app/lib/ApiError";
import { ApiResponse } from "@/app/lib/ApiResponse";
import { sendResponse } from "@/app/lib/sendResponse";

async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return sendResponse(new ApiError(400, "Credentials are required"));
        }

        await connectDb();

        const user = await User.findOne({ username });
        if (!user) {
            return sendResponse(new ApiError(404, "User not found"));
        }

        if (!user.otpVerify) {
            return sendResponse(new ApiError(403, "Please verify your account first"));
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return sendResponse(new ApiError(401, "Invalid credentials"));
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        return sendResponse(new ApiResponse(200, { accessToken, refreshToken }, "User logged in successfully"));

    } catch (error) {
        console.log("error while logging in : ", error);
        return sendResponse(new ApiError(500, "Something went wrong"));
    }
}

export { POST };