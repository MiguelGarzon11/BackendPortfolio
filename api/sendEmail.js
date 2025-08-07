import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta POST para enviar correo
app.post('/api/contact', async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MY_EMAIL,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Correo enviado con éxito' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Exportar como handler para Vercel
export default app;
