import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'malaviyagautam0942@gmail.com',
        pass: 'sldr fhvw mple gpbv'
    }
});
