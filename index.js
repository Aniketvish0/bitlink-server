import express from "express";
import connectToDatabase from "./DBconnection/connection.js";
import { authenticateToken } from "./middlewares/auth.js";
import { seedZookeeper } from "./Zookeeper/zookeeper.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

import urlRouter from "./router/url.js";
import redirectRouter from "./router/redirect.js";
import userRouter from "./router/user.js";
app.use("/", redirectRouter);
app.use("/url", urlRouter);
app.use("/user", userRouter);


connectToDatabase("mongodb://localhost:27017/linkshortner")
    .then(() => {
        console.log("Connected to DB");
        return seedZookeeper();
    })
    .catch(console.error);

app.listen(PORT, () => console.log("Server started on port " + PORT));
