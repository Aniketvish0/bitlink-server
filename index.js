import express from "express";
import connectToDatabase from "./Config/connection.js";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
        "http://localhost:5173", 
        "https://bitlink-client.vercel.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); 
    } else {
        callback(new Error("Not allowed by CORS")); 
    }
}, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
  }));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import staticrouter from "./router/staticrouter.js"; 
import urlRouter from "./router/url.js";
import redirectRouter from "./router/redirect.js";
import userRouter from "./router/user.js";
import analyticsRouter from "./router/useranalytics.js";
app.use("/test",staticrouter);
app.use("/", redirectRouter);
app.use("/url", urlRouter);
app.use("/user", userRouter);
app.use("/user-analytics", analyticsRouter);


connectToDatabase(process.env.MONGO_URI);

app.listen(PORT, () => console.log("Server started on port " + PORT));
