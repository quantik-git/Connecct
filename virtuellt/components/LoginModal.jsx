import Modal from "./Modal";
import { signIn } from 'next-auth/react';
import { useState } from "react";
import { Spinner } from "./Loader";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";


const LoginModal = ({ showModal, setShowModal }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(router.query?.error === "Password or Email doesn't match")

    useEffect(()    => {
        setShowModal(router.query?.error === "Password or Email doesn't match")
    }, [router.query?.error])

    const submitHandler = async event => {
        event.preventDefault();
        const { email, password } = event.target
        setLoading(true)
        setError(false)

        signIn('credentials', {
            email: email.value,
            password: password.value,
            callbackUrl: '/roleRouter'
        }).then(res => {
            setLoading(false)
            console.log(res);
        })
    }

    return (
        <Modal showModal={showModal} setShowModal={setShowModal}>
            <form onSubmit={submitHandler} className="flex flex-col">
                <div className="mb-6 flex flex-col items-start">
                    <label htmlFor="email" className="text-gray-600 font-bold text-sm leading-8">Email</label>
                    <input id="email" name="email" type="email" autoComplete="email" required autoFocus
                        placeholder="email@example.pt"
                        className="border rounded shadow-sm px-3 py-2 w-full appearance-none outline-none focus:ring-2"
                    />
                </div>
                <div className="mb-1 flex flex-col items-start">
                    <label htmlFor="password" className="text-gray-600 font-bold text-sm leading-8">Password</label>
                    <input id="password" name="password" type="password" autoComplete="password" required
                        placeholder="Password"
                        className="border rounded shadow-sm px-3 py-2 w-full appearance-none outline-none focus:ring-2"
                    />
                </div>

            <div className="flex flex-col items-start mb-3">
                    <label className="text-red-500/80 text-sm font-semibold">{error && "Email ou password errados"}</label>
                </div>
                <button type="submit"
                    className="rounded-md py-1 mt-2 font-bold text-sm leading-8 text-white bg-blue-500 hover:bg-blue-600 appearance-none outline-none focus:ring-2 flex justify-center items-center"
                >
                    {loading ? <Spinner className={"w-8 h-8 text-gray-200"}/> : "Log In"}
                </button>
                <div className="flex justify-center mt-2">
                    <Link href={"/reset_request"} legacyBehavior>
                        <a href="#" className="text-blue-500 text-sm font-semibold leading-8">Esqueceu-se da Password?</a>
                    </Link>
                </div>
            </form>
        </Modal>
    )
}

export default LoginModal