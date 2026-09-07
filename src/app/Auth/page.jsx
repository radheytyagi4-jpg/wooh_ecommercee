"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

function Page() {
    const [mode, setMode] = React.useState("login")
    const [username, setUsername] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        console.log(data);

        if(res.ok){
            router.push("/Verify")
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        console.log(data);
    };


    return (
        <div className="flex flex-col bg-white border h-82 w-70 rounded-3xl p-4 mx-auto mt-30">
            <div className="flex flex-row gap-10 justify-center">
                <button className='hover:text-gray-700' onClick={() => setMode("signup")}>Signup</button>
                <button className='hover:text-gray-700' onClick={() => setMode("login")}>Login</button>
            </div>

            {mode === "login" ? (
                <div className='flex flex-col gap-2 justify-center pt-15'>
                    <input
                        className="border p-2 rounded"
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border p-2 rounded"
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="bg-black text-white p-2 rounded" onClick={handleLogin}>Login</button>
                    <div className='mt-5'>
                        <p>don't have an account? <button className="text-blue-500 underline" onClick={() => setMode("signup")}>Signup</button></p>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col gap-2 justify-center pt-10'>
                    <input
                        className="border p-2 rounded"
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border p-2 rounded"
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border p-2 rounded"
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="bg-black text-white p-2 rounded" onClick={handleRegister}>Signup</button>
                    <div className='mt-3'>
                        <p className=''>already have an account? <button className="text-blue-500 underline" onClick={() => setMode("login")}>Login</button></p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page