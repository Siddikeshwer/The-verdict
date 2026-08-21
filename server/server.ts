import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { runDebate } from "./debate/debateEngine";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
    });
});

app.post("/api/debate", async (req, res) => {
    try {
        const { topic } = req.body;

        console.log("\n==============================");
        console.log("DEBATE REQUEST");
        console.log("Topic:", topic);
        console.log("==============================\n");

        if (!topic || typeof topic !== "string") {
            return res.status(400).json({
                error: "Topic is required.",
            });
        }

        const result = await runDebate(topic.trim());

        console.log("\nDEBATE COMPLETED\n");

        res.json(result);
    } catch (error: any) {
        console.error("\n==============================");
        console.error("DEBATE ERROR");
        console.error("==============================");
        console.error(error);
        console.error("==============================\n");

        res.status(500).json({
            error: error?.message || "Debate failed.",
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`The Verdict server running on port ${PORT}`);
});