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

```text
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
