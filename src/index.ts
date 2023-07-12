import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./database";
import cors from "cors";
import limiter from "./middleware/ratelimiter";
import routes from "./routes";
import { logger, errorResponder, invalidPathHandler } from "./middleware";
import { engine } from "express-handlebars";
import morgan, { Options } from "morgan";
import fs from "fs";
import path from "path";
import { logFormat } from "./constants";

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
dotenv.config();
const port = process.env.PORT || 8000;
const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false } as any));
app.use(limiter());
app.use(logger);
app.use(morgan(logFormat, { stream: accessLogStream }));
app.engine("handlebars", engine({ layoutsDir: __dirname + "/views/layouts" }));
app.set("view engine", "handlebars");

//connect to db
connectDB(() => console.log("check anything"));
//these are our routes
app.use("/api/v1", routes);
app.get("/", (req: Request, res: Response) => {
  console.log(__dirname + "access.log");
  res.send("Hello from express + ts");
});

//swagger documentation

//error handlers
app.use(errorResponder);
app.use(invalidPathHandler);

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});

export default app;
