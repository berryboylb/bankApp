// import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";
export type Mail = {
  email: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendMail({ email, subject, text, html }: Mail) {
  try {
    let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    let info = await transport.sendMail({
      from: "no-reply@phemmynesce@gmail.com",
      to: email,
      subject,
      text,
      html,
    });

    console.log("mesage sent", info.messageId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An Unknown error occured";
    console.log(`Error sending email: ${message}`);
  }
}
