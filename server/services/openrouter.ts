import dotenv from "dotenv";

dotenv.config();

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function askMaya(
  messages: Message[]
) {
  const model =
    process.env.OPENROUTER_MODEL ||
    "qwen/qwen3-next-80b-a3b-instruct:free";

  console.log("Maya model:", model);

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

        "Content-Type":
          "application/json",

        "HTTP-Referer":
          process.env.APP_URL ||
          "http://localhost:5173",

        "X-Title":
          "The Verdict",
      },

      body: JSON.stringify({
        model,

        messages,

        temperature: 0.7,

        // Reduced from 1800
        max_tokens: 950,
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      "OpenRouter error:",
      errorText
    );

    throw new Error(
      `Maya/OpenRouter error: ${errorText}`
    );
  }

  const data =
    await response.json();

  const content =
    data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "OpenRouter returned an empty response."
    );
  }

  console.log(
    `Maya generated ${content.length} characters`
  );

  return content;
}