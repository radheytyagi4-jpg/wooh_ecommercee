import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import {connectDb} from "../config/db";
import User from "../model/user";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role || "customer",
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("wooh_token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    await connectDb();

    const user = await User.findById(decoded.id).select(
      "-password -otp"
    );

    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}