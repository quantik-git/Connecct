import { PrismaClient, Role } from "@prisma/client";

export default async function handler(req, res) {
    const token = await getToken({ req })
    const prisma = new PrismaClient();
    const {
        query: { id },
        method,
    } = req

    let result = "erro"
    console.log(req.query);

    switch (method) {
        // Delete
        case "DELETE":
            if (!(token && token.user.role === "ORGANIZATION")) {
                res.status(401).json({error: "Not authorized"});
                return;
            }
            result = await prisma.user.delete({
                where: {
                    id: id,
                },
            }).catch(err => {
                console.log(id);
                return "error the record does not exist"
            })
            break;

        // Show
        case "GET":
            if (!token) {
                res.status(401).json({error: "Not authorized"});
                return;
            }
            result = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true
                }
            })
            break;

        // Update
        case "PUT":
            if (!(token && token.user.role === "ORGANIZATION")) {
                res.status(401).json({error: "Not authorized"});
                return;
            }
            const { email, name, role } = req.query;
            result = await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    email: email,
                    name: name,
                    role: Object.keys(Role)[parseInt(role)]
                }
            })
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
            break;
    }

    res.status(200).json({ result: result, query: req.query });
}

