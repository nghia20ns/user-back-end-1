import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import routes from "./routes/index.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.static("upload"));
//connect MongoDB
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db success");
  })
  .catch((err) => {
    console.log(err);
  });

app.use((_, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE, PATCH`);
  res.header(`Access-Control-Allow-Headers`, `*`);
  next();
});
routes(app);
app.listen(port, () => {
  console.log("Server running in port: ", port);
});
