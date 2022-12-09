import React, { useState, useEffect, useReducer } from "react";
import axios from "axios"
import Layout from "../../components/Layout";
import { useRouter } from 'next/router'
import { MdDelete } from "react-icons/md"


export default function IndexMembers() {
    const [user, setUser] = useState([]);
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        axios.get("/api/user/" + id)
            .then((response) => {
                setUser(response.data.result);
            });
    }, [id]);

    const handleDelete = async (id) => {
        axios.delete(`/api/user/${id}`)
        .then(_ => {
            router.push("/admin")
        })
    }

    return (
        <Layout>
            <main className="grow flex flex-col justify-center items-center bg-zinc-50 w-full">
                <section className="container px-12 mb-6 flex justify-center">
                    <div className="bg-white shadow-lg rounded-md p-8 grid grid-cols-3 gap-x-3 gap-y-1">
                        <span className="col-span-1">{user.name}</span>
                        <span className="col-span-2">{user.email}</span>
                        <span className="col-span-1">{user.role}</span>
                        <span className="col-span-2">{user.id}</span>
                        <div className="col-span-3 flex justify-end mt-2">
                        <button className="flex border-2 border-rose-600 text-rose-600 hover:text-rose-800 font-semibold rounded px-2 py-1">
                            <MdDelete className="text-xl" onClick={() => handleDelete(user.id)} />
                            Delete
                        </button>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    )
}
