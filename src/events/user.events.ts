import EventEmitter from "./";
import { sendMail, Mail } from "../services";

EventEmitter.on("signup", ({ email, subject, text }: Mail) =>
  sendMail({ email, subject, text })
);
