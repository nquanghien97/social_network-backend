import nodemailer from 'nodemailer';

interface Email {
  email: string;
  subject: string;
  text: string;
}

const sendEmail = async ({ email, subject, text } : Email) => {
  try {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 587,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text,
    });

} catch (error) {
    console.log(error, "email not sent");
}
}

export default sendEmail;