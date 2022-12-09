import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
    const token = await getToken({ req })
    if (token) {
        res.status(401).json({error: "Not authorized"});
        return;
    }
    const prisma = new PrismaClient();
    const method = req.method;


    switch (method) {
        case "GET":
            res.status(200).json({error: "Not implemented" });
            break;

        case "POST":
            const { token, password } = req.body;
            const tokenEntry = await prisma.token.findUnique({
                where: { token: token },
                include: { user: true },
            });

            if (!tokenEntry) {
                res.status(200).json({ error: "Invalid token, try again later" });
                return;
            }

            await prisma.token.delete({
                where: { token: token }
            });

            console.log(tokenEntry);

            await prisma.user.update({
                where: { id: tokenEntry.user.id },
                data: {
                    password: await hash(password, 10)
                }
            }).catch((err) => {
                res.status(200).json({ error: "Error updating password, try again later" });
                return;
            });

            res.status(200).json({message: "Password updated"});
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
            break;
    }
}