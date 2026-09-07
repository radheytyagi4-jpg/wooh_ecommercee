import { connectDb } from "@/app/config/db";
import { ApiError } from "@/app/lib/ApiError";
import { ApiResponse } from "@/app/lib/ApiResponse";
import { sendResponse } from "@/app/lib/sendResponse";
import { transporter } from "@/app/lib/emailSender";
import { User } from "@/app/model/user";

async function POST(request) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return sendResponse(new ApiError(400, "All fields are required"));
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        await connectDb();

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            return sendResponse(new ApiError(409, "User already exists"));
        }

            await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: "OTP verification",
            text: `Six digit verification OTP is ${otp}.`
        });
    
        const user = await User.create({ username, email, password, otp, otpVerify: false });

        if (!user) {
            return sendResponse(new ApiError(500, "User is not registered"));
        }

        return sendResponse(new ApiResponse(201, { username: user.username, email: user.email }, "User registered successfully"));

    } catch (error) {
        console.log("error in registration : ", error);
        return sendResponse(new ApiError(500, "Something went wrong while registering"));
    }
}

export { POST,
 };