import EventEmitter from "./";
import { sendMail, Mail } from "../services";

EventEmitter.on("signup", ({ email, subject, text, html }: Mail) =>
  sendMail({ email, subject, text, html })
);

EventEmitter.on("login", ({ email, subject, text, html }: Mail) =>
  sendMail({ email, subject, text, html })
);

EventEmitter.on("mail", ({ email, subject, text, html }: Mail) =>
  sendMail({ email, subject, text, html })
);
