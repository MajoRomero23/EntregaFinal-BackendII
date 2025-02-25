import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templatesPath = resolve(__dirname, '../../views/emails/');

console.log('HOST:', process.env.NODEMAILER_HOST);
console.log('PORT:', process.env.NODEMAILER_PORT);
console.log('USER:', process.env.NODEMAILER_USER);
console.log('PASSWORD:', process.env.NODEMAILER_PASSWORD ? 'EXISTS' : 'NOT SET');


const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,  
  port: Number(process.env.NODEMAILER_PORT),  
  secure: false, 
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: templatesPath,
    defaultLayout: false,
  },
  viewPath: templatesPath,
};

transporter.use('compile', hbs(handlebarOptions));

export const sendEmail = async ({ to, subject, template, context }) => {
  try {
    console.log('Enviando correo a:', to);
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to,
      subject,
      template, 
      context,  
    });
    console.log('Correo enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};
