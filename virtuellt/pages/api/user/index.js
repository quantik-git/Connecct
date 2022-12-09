import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { getToken } from "next-auth/jwt"


export default async function handler(req, res) {
    const token = await getToken({ req })
    if (!(token && token.user.role === "ORGANIZATION")) {
        res.status(401).json({error: "Not authorized"});
        return;
    }

    const prisma = new PrismaClient();
    const method = req.method;

    switch (method) {
        case "GET":
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true
                }
            });

            res.status(200).json({ users: users });
            break;

        case "POST":
            const { email, name, role } = req.body;
            const pass = await hash(Math.random().toString(36).substring(2, 10), 10)

            const user = await prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    password: pass,
                    role: Object.keys(Role)[parseInt(role)]
                }
            })

            if (user) {
                res.status(200).json({email, name, role, user});
            } else {
                res.status(200).json({error: user});
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
            break;
    }
}

