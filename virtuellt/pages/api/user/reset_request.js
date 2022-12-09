import { PrismaClient } from '@prisma/client';
import { createTransport } from "nodemailer";
import crypto from "crypto";

export default async function handler(req, res) {
    const token = await getToken({ req })
    if (token) {
        res.status(401).json({error: "Not authorized"});
        return;
    }
    const prisma = new PrismaClient();
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        res.status(200).json({ error: "User not found" });
        return;
    }

    const resetToken = crypto.randomBytes(48).toString("hex");

    const result = await prisma.token.create({
        data: {
            token: resetToken,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    });

    const transporter = createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
        secure: true,
    });

    const url = `${process.env.NEXTAUTH_URL}/reset_password?token=${resetToken}`;

    const mailData = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Password Reset - ConNECCt",
        text: "",
        html: `
            <div>
                <div>Hi <b>${user.name}</b>,</div>
                <div>You recently requested to reset your password for your <b>ConNECCt</b> account.</div>
                <div>Click here to <a href="${url}">reset</a> it.</div>
                <div>If you did not request a password reset, please ignore this email.</div>
                <div><b>This password reset is only valid for the next 10 minutes.</b></div>
            </div>
        `
    }

    const envio = await transporter.sendMail(mailData)
        .then(info => {
            console.log(info);
            return { message: "Email sent"};
        }).catch(error => {
            return { error: "Email not sent" };
        });

    console.log(result);

    res.status(200).json(envio)
}