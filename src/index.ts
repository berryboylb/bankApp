import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./database";
import cors from "cors";
import limiter from "./middleware/ratelimiter";
import routes from "./routes";
import { logger, errorResponder, invalidPathHandler } from "./middleware";
import { engine } from "express-handlebars";

dotenv.config();
const port = process.env.PORT || 8000;
const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false } as any));
app.use(limiter());
app.use(logger);
app.engine("handlebars", engine({ layoutsDir: __dirname + "/views/layouts" }));
app.set("view engine", "handlebars");

//connect to db
connectDB(() => console.log("check anything"));
//these are our routes
app.use("/api/v1", routes);
app.get("/", (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render("main", { layout: "index" });
});


app.use(errorResponder);
app.use(invalidPathHandler);

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
 
export default app;