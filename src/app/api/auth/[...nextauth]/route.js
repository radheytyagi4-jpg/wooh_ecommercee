import { authOtpions } from "@/app/lib/authOtpions";
import NextAuth from "next-auth"

export default NextAuth(authOtpions);