import express from "express";
import connectToDatabase from "./Config/connection.js";
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
import analyticsRouter from "./router/useranalytics.js";
app.use("/", redirectRouter);
app.use("/url", urlRouter);
app.use("/user", userRouter);
app.use("/user-analytics", analyticsRouter);


connectToDatabase(process.env.MONGO_URI);

app.listen(PORT, () => console.log("Server started on port " + PORT));
