import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function askKarna(
    messages: {
        role: "system" | "user" | "assistant";
        content: string;
    }[]
) {
    const model =
        process.env.GROQ_MODEL ||
        "openai/gpt-oss-120b";

    console.log("Karna model:", model);

    const response = await groq.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 700,
    });

    return response.choices[0]?.message?.content || "";
}