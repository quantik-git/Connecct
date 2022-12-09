import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout"
import { Spinner } from "../components/Loader";

const Reset = () => {
    const [response, setResponse] = useState({status: 0, message: ""})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!router.query.token) {
            router.push("/reset_request")
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { password, password_confirm } = event.target;
        setResponse({status: 0, message: ""})
        setLoading(true)

        if (password.value != password_confirm.value) {
            setResponse({status: -1, message: "The passwords don't match"})
            setLoading(false)
            return;
        }

        const res = await axios.post("/api/user/reset", { token: router.query.token, password: password.value })
        if (res.data.error) {
            setResponse({status: -1, message: res.data.error})
        } else {
            setResponse({status: 1, message: res.data.message})
        }
        setLoading(false)
        console.log(res.data);
    }

    return (
        <Layout>
            <main className="max-w-7xl w-full mx-auto flex justify-center items-center grow">
                <form onSubmit={handleSubmit} className="grid grid-flow-row gap-y-2">
                    <header>
                        <h1 className="text-xl font-semibold text-slate-900 mb-2">Nova Password</h1>
                    </header>
                    <input className="appearance-none outline-none focus:ring-2 rounded-md py-2 px-2 border bg-gray-50 text-slate-900 font-semibold w-72" type="password" name="password" placeholder="password" />
                    <input className="appearance-none outline-none focus:ring-2 rounded-md py-2 px-2 border bg-gray-50 text-slate-900 font-semibold w-72" type="password" name="password_confirm" placeholder="confirmar password" />
                    {response.status == -1 && <p className="text-red-500 text-sm font-semibold">{response.message}</p>}
                    {response.status ==  1 && <p className="text-green-500 text-sm font-semibold">{response.message}</p>}
                    <button
                        className="appearance-none outline-none focus:ring-2 rounded-md py-2 px-2 border text-white text-sm font-semibold bg-blue-500 hover:bg-blue-600 flex justify-center items-center"
                        role="submit"
                    >{loading ? <Spinner className={"w-8 h-8 text-gray-200"}/> : "Guardar Password"}</button>
                </form>
            </main>
        </Layout>
    )
}

export default Reset