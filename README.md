# ⚖️ The Verdict

> An AI-powered courtroom where two AI debaters argue opposing sides of a topic and an AI judge delivers the final verdict.

## 🎮 Overview

**The Verdict** is an experimental AI debate agent designed as a game-like courtroom experience.

Give it a topic. Two AI agents — **Maya** and **Karna** — take opposing positions, argue against each other, and present their reasoning. A separate **AI Judge** evaluates the debate and selects a winner based on argument quality, reasoning, evidence, rebuttals, and overall persuasiveness.

The entire experience is presented through a **Minecraft-inspired courtroom UI** with animated characters, live debate logs, generation output, evidence panels, and scoring.

## ✨ Features

- ⚔️ AI vs AI debates
- 👩 **Maya** — argues AGAINST the topic
- 👨 **Karna** — argues FOR the topic
- ⚖️ **AI Judge** — evaluates both sides
- 🧠 Comparative scoring and confidence
- 🏆 Always produces a single winner
- 🎙️ Live speaker indication
- 💻 Live AI generation terminal
- 📜 Debate history and round tracking
- 📊 Maya vs Karna scoreboard
- 🧱 Minecraft-inspired courtroom interface
- 🔌 Separate Groq and OpenRouter models

## 🏛️ How It Works

``
                    USER
                      │
                      ▼
              Enter Debate Topic
                      │
                      ▼
              ┌───────────────┐
              │ Debate Engine │
              └───────┬───────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
          KARNA              MAYA
           FOR              AGAINST
             │                 │
             ▼                 ▼
           Groq            OpenRouter
             │                 │
             └────────┬────────┘
                      ▼
                 AI DEBATE
              3 Debate Rounds
                      │
                      ▼
                   JUDGE
                      │
                      ▼
             Score + Confidence
                      │
                      ▼
                FINAL VERDICT

🤖 AI Agents
Karna

Position: FOR

Karna is powered by Groq and acts as the aggressive, analytical debater.

Groq
└── GPT-OSS 120B
Maya

Position: AGAINST

Maya is powered through OpenRouter and is instructed to challenge Karna's reasoning, identify weaknesses, and build counterarguments.

OpenRouter
└── Gemini 2.5 Flash
Judge

The judge receives the arguments from both sides and evaluates them independently.

It considers:

Evidence quality
Factual accuracy
Logical reasoning
Rebuttal quality
Relevance
Counterarguments
Logical consistency
Overall persuasiveness

The judge produces:

Winner
Maya Score
Karna Score
Confidence
Reasoning

A draw is not allowed.

🖥️ Interface

The courtroom is designed around a Minecraft-inspired visual style:

Maya on the left
Judge in the center
Karna on the right
Wooden courtroom environment
Pixel-style characters
Lantern lighting
Courtroom podiums
Live generation terminal
Debate log
Evidence board
Scoreboard
Screenshots

Add your screenshots here:

![Courtroom](screenshots/courtroom.png)
![Live Debate](screenshots/live-debate.png)
![Final Verdict](screenshots/verdict.png)
🛠️ Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Framer Motion
Lucide React
Backend
Node.js
Express
TypeScript
Groq SDK
OpenRouter API
dotenv
AI
Groq — Karna
OpenRouter — Maya
Groq — Judge
📁 Project Structure
The-verdict/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Courtroom.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── agents/
│   │   ├── karna.ts
│   │   ├── maya.ts
│   │   └── judge.ts
│   │
│   ├── debate/
│   │   └── debateEngine.ts
│   │
│   ├── services/
│   │   ├── groq.ts
│   │   └── openrouter.ts
│   │
│   ├── server.ts
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
🚀 Getting Started
1. Clone the repository
git clone https://github.com/Siddikeshwer/The-verdict.git
cd The-verdict
2. Install frontend dependencies
cd client
npm install
3. Install backend dependencies

Open another terminal:

cd server
npm install
4. Configure environment variables

Create:

server/.env

Add:

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b


OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemini-2.5-flash


APP_URL=http://localhost:5173
PORT=5000
5. Start the backend
cd server
npm run dev

Backend:

http://localhost:5000
6. Start the frontend

In another terminal:

cd client
npm run dev

Frontend:

http://localhost:5173
