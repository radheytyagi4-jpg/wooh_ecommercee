import { NextResponse } from "next/server";
import { connectDb } from "@/app/config/db";
import User from "@/app/model/user";
import { signToken } from "@/app/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      username,
      password,
    } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDb();

    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        {
          status: 401,
        }
      );
    }

    const validPassword =
      await user.comparePassword(password);

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        {
          status: 401,
        }
      );
    }

    if (!user.otpVerify) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email first",
        },
        {
          status: 403,
        }
      );
    }

    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(
      "wooh_token",
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}