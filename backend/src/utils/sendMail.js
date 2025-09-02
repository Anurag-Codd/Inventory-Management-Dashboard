import { createTransport } from "nodemailer";
import { EMAIL_TEMPLATE } from "./template.js";

const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (email, OTP) => {
  const mailOptions = {
    from: {
      name: "INV ADMIN",
      address: process.env.SMTP_EMAIL,
    },
    to: email,
    subject: "OTP - Forgot Password",
    html: EMAIL_TEMPLATE.replace("{OTP}", OTP),
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    throw new Error(`Email error: ${error.message}`);
  }
};
