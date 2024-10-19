// email.service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. smtp.example.com
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // votre adresse e-mail
    pass: process.env.SMTP_PASS, // votre mot de passe
  },
});

export const sendVerificationEmail = async (to: string, verificationCode: string) => {
  const verificationUrl = `https://localhost:3000/subscribe/verify-email?code=${verificationCode}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: 'Vérifiez votre adresse e-mail',
    text: `Cliquez sur ce lien pour vérifier votre adresse e-mail : ${verificationUrl}`,
    html: `<p>Cliquez sur ce lien pour vérifier votre adresse e-mail : <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`); // Log email send status
  } catch (error) {
    console.error('Error sending email:', error); // Log errors for debugging
  }
};