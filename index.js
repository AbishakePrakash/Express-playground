import express, { json, urlencoded } from "express";
import router from "./routes.js";
import connectDB from "./connectDB.js";
import Logger from "./utils/customLog.js";
import oflRouter from "./oflRoute.js";

const app = express();
const port = 4000;

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(router);
app.use(oflRouter);

app.listen(port, () => {
  Logger(`Server is listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Hola Amigos!!!" });
});
