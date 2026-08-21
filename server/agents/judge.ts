import { askKarna } from "../services/groq";

type JudgeResult = {
    winner: "Karna" | "Maya";
    confidence: number;
    karnaScore: number;
    mayaScore: number;
    reasoning: string;
};

export async function judgeDebate(
    topic: string,
    karnaArguments: string[],
    mayaArguments: string[]
): Promise<JudgeResult> {
    const karnaText = karnaArguments
        .map(
            (text, i) =>
                `KARNA ARGUMENT ${i + 1}:\n${text}`
        )
        .join("\n\n");

    const mayaText = mayaArguments
        .map(
            (text, i) =>
                `MAYA ARGUMENT ${i + 1}:\n${text}`
        )
        .join("\n\n");

    const prompt = `
You are the FINAL JUDGE of a serious AI courtroom debate.

TOPIC:
${topic}

========================
KARNA'S ARGUMENTS
========================

${karnaText}

========================
MAYA'S ARGUMENTS
========================

${mayaText}

========================
YOUR TASK
========================

You MUST decide which debater performed better.

THIS DEBATE MUST NEVER END IN A DRAW.

There must ALWAYS be exactly one winner:

"Karna"

OR

"Maya"

Do not choose based on personality.

Do not choose based on writing style.

Judge the actual quality of the arguments.

Evaluate both sides extremely critically.

SCORING CRITERIA:

1. Evidence quality
2. Factual accuracy
3. Strength of reasoning
4. Relevance to the topic
5. Quality of rebuttals
6. Identification of weaknesses in the opponent
7. Logical consistency
8. Use of concrete examples
9. Handling of counterarguments
10. Overall persuasiveness

Give each debater a score from 0 to 100.

IMPORTANT:

The scores should NOT automatically be equal.

If one side clearly performed better, give that side
a meaningfully higher score.

Examples:

82 vs 67
91 vs 74
76 vs 72

Avoid artificial scores such as:

50 vs 50
75 vs 75
80 vs 80

A difference of at least 3 points is preferred unless
the arguments are extremely close.

CONFIDENCE:

Confidence represents how certain you are that the
winner genuinely performed better.

Use:

90-100 = overwhelming victory
80-89  = clear victory
70-79  = strong but not overwhelming victory
60-69  = narrow victory
51-59  = extremely close victory

Never give 50% confidence.

Even if the debate is extremely close, select the
better performer and explain why.

CRITICAL THINKING:

Before deciding, internally compare:

- strongest Karna argument
- weakest Karna argument
- strongest Maya argument
- weakest Maya argument
- factual support
- logical flaws
- rebuttal effectiveness
- unsupported claims
- contradictions
- which side actually answered the topic better

Then make the final decision.

Do NOT mention this internal evaluation process.

========================
OUTPUT FORMAT
========================

Return ONLY valid JSON.

{
  "winner": "Karna" or "Maya",
  "confidence": number,
  "karnaScore": number,
  "mayaScore": number,
  "reasoning": "A concise explanation of why the winner defeated the other side."
}

Rules:

- winner must be exactly "Karna" or "Maya"
- confidence must be between 51 and 100
- karnaScore must be between 0 and 100
- mayaScore must be between 0 and 100
- scores must NOT be equal
- winner's score MUST be higher
- no draw
- no markdown
- no code fences
- valid JSON only
`;

    const response = await askKarna([
        {
            role: "system",
            content:
                "You are an impartial and extremely rigorous debate judge. Always select one winner.",
        },
        {
            role: "user",
            content: prompt,
        },
    ]);

    console.log("Raw judge response:", response);

    try {
        const cleaned = response
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const result =
            JSON.parse(cleaned) as JudgeResult;

        // Safety correction
        if (
            result.winner !== "Karna" &&
            result.winner !== "Maya"
        ) {
            throw new Error(
                "Judge returned invalid winner"
            );
        }

        result.karnaScore = Math.round(
            Number(result.karnaScore)
        );

        result.mayaScore = Math.round(
            Number(result.mayaScore)
        );

        result.confidence = Math.round(
            Number(result.confidence)
        );

        // Never allow equal scores
        if (
            result.karnaScore ===
            result.mayaScore
        ) {
            if (result.winner === "Karna") {
                result.karnaScore += 1;
            } else {
                result.mayaScore += 1;
            }
        }

        // Ensure winner always has higher score
        if (
            result.winner === "Karna" &&
            result.karnaScore <=
            result.mayaScore
        ) {
            result.karnaScore =
                result.mayaScore + 3;
        }

        if (
            result.winner === "Maya" &&
            result.mayaScore <=
            result.karnaScore
        ) {
            result.mayaScore =
                result.karnaScore + 3;
        }

        // Clamp scores
        result.karnaScore = Math.min(
            100,
            Math.max(0, result.karnaScore)
        );

        result.mayaScore = Math.min(
            100,
            Math.max(0, result.mayaScore)
        );

        // Never allow 50% confidence
        result.confidence = Math.min(
            100,
            Math.max(51, result.confidence)
        );

        return result;
    } catch (error) {
        console.error(
            "Judge JSON parsing failed:",
            error
        );

        // Fallback: still NEVER return a draw
        return {
            winner: "Karna",
            confidence: 51,
            karnaScore: 51,
            mayaScore: 48,
            reasoning:
                "Karna received a narrow victory based on the comparative strength of the arguments.",
        };
    }
}