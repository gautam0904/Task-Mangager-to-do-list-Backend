import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});