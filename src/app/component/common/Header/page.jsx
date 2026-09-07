import React from 'react'
import Homeburger from '../../home-components/Hamburger'
import Image from 'next/image'

function Header() {
    return (
        <>
            <nav className="bg-[#F8F2E7] fixed w-full z-20 top-0 start-0 border-b border-default">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div>
                        <Homeburger />
                    </div>
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image src="/logo.png" className="rounded-full" alt="Logo" width={80} height={80} />
                    </a>
                    <button><Image href="/" src="/user-profile.png" alt="User Profile" width={32} height={32} /></button>
                </div>
            </nav>

        </>
    )
}

export default Header
