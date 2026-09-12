import React from 'react'
import Link from 'next/link'

function Footer() {
    return (
        <>
            <footer className="bg-neutral-primary-soft rounded-base shadow-xs border border-default m-4">
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                    <span className="text-sm text-body sm:text-center">
                        Wooh © 2023{" "}
                        . All Rights Reserved.
                    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-body sm:mt-0">
                        <li>
                            <Link href="/Aboutus" className="hover:underline me-4 md:me-6">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/Privacy" className="hover:underline me-4 md:me-6">
                            </Link> 
                        </li>
                        <li>
                            <Link href="/Licensing" className="hover:underline me-4 md:me-6">
                                Licensing
                            </Link>
                        </li>
                        <li>
                            <Link href="/Contact" className="hover:underline">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </footer>

        </>
    )
}

export default Footer
