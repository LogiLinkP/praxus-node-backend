require('dotenv').config();
const nodemailer = require('nodemailer');

export function sendMail(to: string, subject: string, text: string, name: string | null) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_PASSWORD
        },
        tls : { rejectUnauthorized: false }
    });
    const mailOptions = {
        from: `Praxus Team <${process.env.EMAIL_ACCOUNT}>`,
        to: `${name || to} <${to}>`,
        subject: `${subject}`,
        text: `${text}`
    };
    transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}