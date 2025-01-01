import express from "express";

const router = express.Router();
router.get("/", (req, res) => {
    res.send("Welcome to Link Shortener API!");
});

export default Router;