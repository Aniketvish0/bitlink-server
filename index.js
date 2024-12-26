import express from "express";
import connectToDatabase from "./DBconnection/connection.js";
import urlRouter from "./router/url.js";
import Zookeeper from "./models/zookeeper.js";
import redirectRouter from "./router/redirect.js";
const app = express();
const PORT = 3001;

app.use(express.json());
app.use("/", redirectRouter);
app.use("/url", urlRouter);
async function seedZookeeper() {
    const existing = await Zookeeper.findOne();
    if (!existing) {
        const newZookeeper = new Zookeeper({
            ranges: [
                { start: 262144, end: 400000 },
                { start: 400001, end: 600000 },
                { start: 600001, end: 800000 },
                { start: 800001, end: 1000000 },
            ],
        });
        await newZookeeper.save();
        console.log("Zookeeper seeded with default ranges.");
    }
}

connectToDatabase("mongodb://localhost:27017/linkshortner")
    .then(() => {
        console.log("Connected to DB");
        return seedZookeeper();
    })
    .catch(console.error);

app.listen(PORT, () => console.log("Server started on port " + PORT));
