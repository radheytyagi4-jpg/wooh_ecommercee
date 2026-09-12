"use client"
import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOtp] = React.useState("");
    const router = useRouter();

    const handleVerify = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            router.push("/Auth");
        }
    };

    return (
        <div className="flex flex-col bg-white border h-82 w-70 rounded-3xl p-4 mx-auto mt-30">
            <div className="flex flex-col gap-10 justify-center">
                <input
                    className="border p-2 rounded"
                    type='email'
                    placeholder='Email'
                    value={email || ""}
                    readOnly
                />
                <input
                    className="border p-2 rounded"
                    type="text"
                    inputMode="numeric"
                    placeholder='OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button className="bg-black text-white p-2 rounded" onClick={handleVerify}>Verify</button>
            </div>
        </div>
    )
}

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyForm />
        </Suspense>
    );
}