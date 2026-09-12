//data{otp} ayaga form se
//check krna db mai otp same hai ya nhi
//agar same hai toh otpverify ko true
//or agar otpverify true hai toh create user
//agr otpverify false hai toh delete user
//send response

import { connectDb } from "@/app/config/db";
import User from "@/app/model/user";
import { ApiError } from "@/app/lib/ApiError";
import { ApiResponse } from "@/app/lib/ApiResponse";
import { sendResponse } from "@/app/lib/sendResponse";

async function POST(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return sendResponse(new ApiError(400, "Email and OTP are required"));
        }

        await connectDb();

        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(new ApiError(404, "User not found"));
        }

        if (Number(otp) !== user.otp) {
            await User.deleteOne({ _id: user._id });
            return sendResponse(new ApiError(400, "Invalid OTP, please register again"));
        }

        await User.updateOne(
            { _id: user._id },
            { $set: { otpVerify: true }, $unset: { otp: "" } }
        );


        return sendResponse(new ApiResponse(200, { email: user.email }, "User verified successfully"));

    } catch (error) {
        console.log("error while verifying otp : ", error);
        return sendResponse(new ApiError(500, "Something went wrong"));
    }
}

export { POST };