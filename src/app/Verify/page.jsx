"use client"
import React from 'react'
import { useSearchParams , useRouter } from 'next/navigation';

function page() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOtp] = React.useState("");
    const router = useRouter();

    const handleVerify = async (e)=>{
        e.preventDefault();

        const res = await fetch("/api/auth/verify",
            {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({email, otp})
            }
        );

        const data = await res.json();
        console.log(data)
        
            if(res.ok){
                router.push("/Auth");
            }
    }

    return (
        <>
            <div className="flex flex-col bg-white border h-82 w-70 rounded-3xl p-4 mx-auto mt-30">
                <div className="flex flex-col gap-10 justify-center">
                    <input
                        className="border p-2 rounded"
                        type='email'
                        placeholder='Email'
                        value={email}
                    />
                    <input
                        className="border p-2 rounded"
                        type="otp"
                        placeholder='OTP'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className="bg-black text-white p-2 rounded" onClick={handleVerify}>Verify</button>
                </div>
            </div>
        </>
    )
}

export default page
