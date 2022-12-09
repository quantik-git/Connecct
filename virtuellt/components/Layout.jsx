import Head from "next/head";
import Link from "next/link";
import { FaHeart } from 'react-icons/fa'
import { signOut, useSession } from 'next-auth/react';
import { FiMenu } from 'react-icons/fi';
import { VscClose } from 'react-icons/vsc';
import { useState } from "react";
import LoginModal from "./LoginModal";

const Layout = ({ title, children }) => {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="flex flex-col min-h-screen min-w-screen">
            <Head>
                <title>{!title ? "Virtuellt" : title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <LoginModal showModal={showModal} setShowModal={setShowModal} />

            <nav className="flex justify-center w-full px-6">
                <div className="flex flex-wrap justify-between w-full max-w-7xl">
                    <div className="flex items-center">
                        <button className="block sm:hidden py-1 rounded-md hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
                            {
                                (isOpen)
                                    ? <VscClose className="text-xl cursor-pointer text-slate-600 mx-2" />
                                    : <FiMenu className="text-xl cursor-pointer text-gray-600 mx-2" />
                            }
                        </button>
                        <Link href="/">
                            <p className="text-indigo-600 tracking-widest text-xl py-2">
                                <span className="text-3xl italic">V</span>irtuellt
                            </p>
                        </Link>
                    </div>

                    <div className="sm:order-2 flex items-center">
                        {(!session) ?
                            <button
                                onClick={() => setShowModal(true)}
                                className="text-blue-500 font-semibold">Log In</button>
                            :
                            <button
                                onClick={signOut}
                                className="text-blue-500 font-semibold">Log Out</button>
                        }
                    </div>

                    <ul className={`${isOpen ? "w-full px-2 py-4" : "hidden"} grow sm:flex items-center justify-center sm:order-1`}>
                        {
                            session && session.user.role == "MEMBER" &&
                            <li  className="block py-1 px-3 mx-1 rounded font-semibold text-slate-800 hover:bg-gray-100">
                                <Link href="/member" passHref>
                                    Profile
                                </Link>
                            </li>
                        }

                        {
                            session && session.user.role == "PARTNER" &&
                            <li  className="block py-1 px-3 mx-1 rounded font-semibold text-slate-800 hover:bg-gray-100">
                                <Link href="/partner" passHref>
                                    Scanner
                                </Link>
                            </li>
                        }

                        {
                            session && session.user.role == "ORGANIZATION" &&
                            <li  className="block py-1 px-3 mx-1 rounded font-semibold text-slate-800 hover:bg-gray-100">
                                <Link href="/admin" passHref>
                                    Dashboard
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </nav>

            {children}

            <footer className="flex h-24 w-full items-center justify-center border-t">
                Made with&nbsp;<FaHeart className="text-indigo-500 text-2xl mx-1" />
            </footer>
        </div>
    );
}

export default Layout