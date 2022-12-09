import React, { useState, useEffect, useReducer } from "react";
import axios from "axios"
import Layout from "../../components/Layout";
import { MdDelete } from "react-icons/md"
import { Role } from "@prisma/client";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { Spinner } from "../../components/Loader";


export default function IndexMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, refresher] = useReducer((state) => state + 1, 0)

    useEffect(() => {
        setLoading(true);
        axios.get("/api/user/")
            .then((response) => {
                console.log(response.data);
                setMembers(response.data.users);
                setLoading(false);
            });
    }, [refreshKey]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const { name, email, role } = event.target

        axios.post("/api/user/",
            {
                name: name.value,
                email: email.value,
                role: role.value
            }
        ).then(_ => refresher())
    }

    return (
        <Layout>
            <main className="grow flex flex-col justify-center items-center bg-zinc-50 w-full">
                <section className="container px-12 mb-6 flex justify-center">
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-white p-6 text-slate-900 rounded-md shadow-md border">
                        <input type="text" name="name" id="name" placeholder="Nome" className="border bg-gray-50 rounded px-2 py-1 w-full max-w-xs outline-none focus:ring-2 ring-blue-500" />
                        <input type="email" name="email" id="email" placeholder="Email" className="border bg-gray-50 rounded px-2 py-1 w-full max-w-xs outline-none focus:ring-2 ring-blue-500" />
                        <select name="role" id="role" className="px-1 py-1 max-w-xs rounded outline-none focus:ring-2 ring-blue-500" defaultValue={"-1"}>
                            <option value="-1" disabled>Tipo</option>
                            {
                                Object.keys(Role).map((val, idx) =>
                                    <option key={idx} value={idx} className="lowercase">{val}</option>
                                )
                            }
                        </select>
                        <input type="submit" value="Criar" className="px-2 py-1 border-2 max-w-xs rounded font-semibold cursor-pointer hover:bg-slate-50 outline-none focus:ring-2 ring-blue-500" />
                    </form>
                </section>
                <section className="container px-12 flex justify-center">
                    {
                        loading
                        ? <Spinner className="w-16 h-16 text-blue-500 mt-8" />
                        : <MemberList members={members} refresher={refresher} />
                    }
                </section>
            </main>
        </Layout>
    )
}


const MemberList = ({ members, refresher }) => {
    const handleDelete = async (id) => {
        axios.delete(`/api/user/${id}`)
            .then(_ => refresher())
    }

    return (
        <div className="overflow-x-auto w-full border border-blue-500 bg-white">
            <table className={"w-full"}>
                <thead>
                    <tr className={"bg-blue-500"}>
                        <th className={"px-2 text-left text-white text-lg font-medium tracking-wide"}>Nome</th>
                        <th className={"px-2 text-left text-white text-lg font-medium tracking-wide"}>Email</th>
                        <th className={"px-2 text-left text-white text-lg font-medium tracking-wide"}>Role</th>
                        <th className={"px-2 text-left text-white text-lg font-medium tracking-wide"}>Actions</th>
                    </tr>
                </thead>
                <tbody className={"text-gray-700 whitespace-nowrap"}>
                    {members.map(({ id, email, name, role }, index) => {
                        return (

                            <tr className={"cursor-pointer hover:bg-blue-100 hover:text-gray-900 border-t border-blue-500"} key={index}>
                                <td className={"px-2 py-1"}>{name}</td>
                                <td className={"px-2 py-1"}>{email}</td>
                                <td className={"px-2 py-1"}>{role}</td>
                                <td className={"px-2 py-1 flex justify-around"}>
                                    <MdDelete className="cursor-pointer text-rose-600 text-xl active:text-rose-800" onClick={() => handleDelete(id)} />
                                    <Link href={`/admin/${id}`}>
                                        <FaPlus className="cursor-pointer text-emerald-600 text-xl active:text-emerald-800"/>
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

