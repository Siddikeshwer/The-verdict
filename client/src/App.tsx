import { useState } from "react";
import {
  ExternalLink,
  Terminal,
  ScrollText,
  FileText,
  Radio,
  Trophy,
} from "lucide-react";

import Courtroom from "./components/Courtroom";

export type DebateMessage = {
  speaker: "Karna" | "Maya" | "Judge";
  side?: "FOR" | "AGAINST" | "JUDGE";
  text: string;
  round?: number;
};

export type Evidence = {
  speaker: string;
  title: string;
  url: string;
  snippet: string;
};

export type VerdictData = {
  winner: string;
  confidence: number;
  reasoning: string;
  karnaScore: number;
  mayaScore: number;
};

function App() {
  const [topic, setTopic] = useState("");

  const [debating, setDebating] = useState(false);

  const [messages, setMessages] = useState<
    DebateMessage[]
  >([]);

  const [evidence, setEvidence] = useState<
    Evidence[]
  >([]);

  const [verdict, setVerdict] =
    useState<VerdictData | null>(null);

  const [activeSpeaker, setActiveSpeaker] =
    useState<
      "Karna" | "Maya" | "Judge" | null
    >(null);

  const [currentText, setCurrentText] =
    useState("");

  const [error, setError] = useState("");

  const [showSetup, setShowSetup] =
    useState(true);

  const wait = (ms: number) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms)
    );

  const typeMessage = async (
    text: string,
    speaker: string
  ) => {
    setCurrentText("");

    const speed =
      speaker === "Maya" ||
        speaker === "Karna"
        ? 8
        : 15;

    for (
      let i = 0;
      i <= text.length;
      i += 2
    ) {
      setCurrentText(text.slice(0, i));
      await wait(speed);
    }
  };

  const startDebate = async () => {
    if (!topic.trim() || debating) return;

    setDebating(true);
    setShowSetup(false);
    setMessages([]);
    setEvidence([]);
    setVerdict(null);
    setCurrentText("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/debate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            topic: topic.trim(),
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response.json().catch(
            () => null
          );

        throw new Error(
          data?.error ||
          "Debate request failed"
        );
      }

      const data = await response.json();

      for (
        const message of
        data.messages as DebateMessage[]
      ) {
        setActiveSpeaker(
          message.speaker
        );

        await typeMessage(
          message.text,
          message.speaker
        );

        setMessages((previous) => [
          ...previous,
          message,
        ]);

        setCurrentText("");

        await wait(700);
      }

      setEvidence(data.evidence || []);

      if (data.verdict) {
        setActiveSpeaker("Judge");

        setCurrentText(
          "Judge is evaluating the arguments..."
        );

        await wait(1800);

        setVerdict(data.verdict);

        setCurrentText(
          "VERDICT READY"
        );
      }

      setActiveSpeaker(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Debate failed."
      );

      setShowSetup(true);
    } finally {
      setDebating(false);
    }
  };

  const newDebate = () => {
    setTopic("");
    setMessages([]);
    setEvidence([]);
    setVerdict(null);
    setCurrentText("");
    setActiveSpeaker(null);
    setError("");
    setShowSetup(true);
  };

  const currentRound =
    messages.length === 0
      ? 1
      : Math.min(
        3,
        Math.floor(
          messages.length / 2
        ) + 1
      );

  return (
    <main className="min-h-screen bg-[#080807] text-white">

      <div className="max-w-[1800px] mx-auto p-3 md:p-5">

        {/* =====================================================
            DEBATE TOPIC SETUP
            ===================================================== */}

        {showSetup &&
          !debating &&
          !verdict && (
            <div className="max-w-4xl mx-auto mb-5">

              <div className="minecraft-terminal p-5">

                <div className="flex items-center justify-between mb-4">

                  <div>
                    <div className="text-yellow-500 text-xs tracking-[0.35em]">
                      COURTROOM SETUP
                    </div>

                    <div className="text-gray-500 text-xs mt-2">
                      Enter a topic for Maya and
                      Karna to debate.
                    </div>
                  </div>

                  <div className="text-yellow-500 text-3xl">
                    ⚖
                  </div>

                </div>

                <div className="text-[10px] text-yellow-600 tracking-[0.25em] mb-2">
                  DEBATE TOPIC
                </div>

                <textarea
                  value={topic}
                  onChange={(e) =>
                    setTopic(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      e.ctrlKey
                    ) {
                      startDebate();
                    }
                  }}
                  placeholder="Example: Should AI replace human workers?"
                  rows={3}
                  className="
                    w-full
                    bg-[#080807]
                    border-2
                    border-[#49361e]
                    focus:border-yellow-700
                    outline-none
                    p-4
                    text-white
                    text-sm
                    font-mono
                    resize-none
                    placeholder:text-gray-700
                  "
                />

                <div className="flex justify-between items-center mt-3">

                  <div className="text-[10px] text-gray-600">
                    CTRL + ENTER TO START
                  </div>

                  <div className="text-[10px] text-gray-600">
                    {topic.length} characters
                  </div>

                </div>

                <button
                  onClick={startDebate}
                  disabled={!topic.trim()}
                  className="
                    mt-3
                    w-full
                    py-3
                    bg-[#6b461c]
                    border-2
                    border-[#9b6b2a]
                    hover:bg-[#80531f]
                    disabled:opacity-30
                    disabled:cursor-not-allowed
                    text-yellow-100
                    font-bold
                    tracking-[0.2em]
                    transition
                  "
                >
                  ⚔ START DEBATE
                </button>

              </div>
            </div>
          )}

        {/* =====================================================
            COURTROOM
            ===================================================== */}

        <Courtroom
          activeSpeaker={activeSpeaker}
          debating={debating}
          topic={
            topic ||
            "NO TOPIC SELECTED"
          }
          round={currentRound}
        />

        {/* =====================================================
            LOWER PANELS
            ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[250px_1fr_300px] gap-3 mt-3">

          {/* ================= DEBATE LOG ================= */}

          <section className="minecraft-terminal min-h-[300px]">

            <div className="border-b border-[#3d3a32] p-3 flex items-center gap-2">

              <ScrollText
                size={16}
                className="text-yellow-500"
              />

              <span className="text-xs font-bold tracking-widest">
                DEBATE LOG
              </span>

            </div>

            <div className="p-3 space-y-3 max-h-[350px] overflow-y-auto">

              {messages.length === 0 && (
                <div className="text-xs text-gray-600">
                  Waiting for debate...
                </div>
              )}

              {messages.map(
                (message, index) => (
                  <div
                    key={index}
                    className="text-xs"
                  >

                    <div className="flex gap-2">

                      <span className="text-gray-600">
                        {new Date().toLocaleTimeString()}
                      </span>

                      <span
                        className={
                          message.speaker ===
                            "Maya"
                            ? "text-blue-400"
                            : message.speaker ===
                              "Karna"
                              ? "text-red-400"
                              : "text-yellow-400"
                        }
                      >
                        {message.speaker}
                      </span>

                    </div>

                    <div className="text-gray-500 ml-16 mt-1">
                      {message.round
                        ? `Round ${message.round}`
                        : "Statement"}
                    </div>

                  </div>
                )
              )}

              {activeSpeaker && (
                <div className="border-t border-gray-800 pt-3">

                  <span
                    className={
                      activeSpeaker ===
                        "Maya"
                        ? "text-blue-400"
                        : activeSpeaker ===
                          "Karna"
                          ? "text-red-400"
                          : "text-yellow-400"
                    }
                  >
                    ● {activeSpeaker}
                  </span>

                  <span className="text-gray-600">
                    {" "}
                    GENERATING...
                  </span>

                </div>
              )}

            </div>
          </section>

          {/* ================= LIVE TERMINAL ================= */}

          <section className="minecraft-terminal">

            <div className="border-b border-[#3d3a32] p-3 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Terminal
                  size={16}
                  className="text-green-500"
                />

                <span className="text-xs font-bold tracking-widest">
                  LIVE GENERATION TERMINAL
                </span>

              </div>

              <div className="flex items-center gap-2 text-[10px] text-green-400">

                <Radio size={12} />

                LIVE

              </div>

            </div>

            <div className="p-3">

              <div className="text-xs mb-4 text-green-500">

                courtroom@verdict:~$

                <span className="text-gray-400">

                  {" "}
                  generate_statement
                  {" "}
                  --agent=
                  {activeSpeaker
                    ?.toLowerCase() ||
                    "system"}
                  {" "}
                  --round=
                  {currentRound}

                </span>

              </div>

              <div className="border-b border-gray-900 pb-4 mb-4 space-y-1 text-xs text-gray-500">

                <div>
                  {activeSpeaker
                    ? `Initializing ${activeSpeaker} reasoning engine...`
                    : "Courtroom engine ready..."}
                </div>

                {activeSpeaker && (
                  <>
                    <div>
                      Loading debate context...
                    </div>

                    <div>
                      Analyzing opposing argument...
                    </div>

                    <div>
                      Formulating response...
                    </div>
                  </>
                )}

              </div>

              <div className="min-h-[260px] max-h-[360px] overflow-y-auto">

                {activeSpeaker && (
                  <div
                    className={`font-bold mb-3 ${activeSpeaker ===
                        "Maya"
                        ? "text-blue-400"
                        : activeSpeaker ===
                          "Karna"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                  >
                    {activeSpeaker.toUpperCase()}:
                  </div>
                )}

                <div className="text-sm leading-7 text-gray-300 whitespace-pre-wrap">

                  {currentText}

                  {activeSpeaker && (
                    <span className="terminal-cursor ml-1" />
                  )}

                </div>

              </div>

              <div className="border-t border-gray-800 pt-3 mt-3 text-xs text-green-500">

                courtroom@verdict:~$

                <span className="terminal-cursor ml-2" />

              </div>

            </div>
          </section>

          {/* ================= RIGHT PANEL ================= */}

          <section className="space-y-3">

            {/* EVIDENCE */}

            <div className="minecraft-terminal">

              <div className="border-b border-gray-800 p-3 flex gap-2 items-center">

                <FileText
                  size={15}
                  className="text-yellow-500"
                />

                <span className="text-xs font-bold tracking-widest">
                  EVIDENCE BOARD
                </span>

              </div>

              <div className="p-3 space-y-3">

                {evidence.length === 0 ? (
                  <div className="text-xs text-gray-600">
                    Evidence will appear here
                    when web research is enabled.
                  </div>
                ) : (
                  evidence
                    .slice(0, 5)
                    .map(
                      (item, index) => (
                        <a
                          key={index}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block border-b border-gray-800 pb-2"
                        >
                          <div className="flex gap-2">

                            <FileText
                              size={14}
                              className="text-blue-400 shrink-0"
                            />

                            <span className="text-xs text-gray-300">
                              {item.title}
                            </span>

                            <ExternalLink
                              size={12}
                              className="text-gray-600"
                            />

                          </div>
                        </a>
                      )
                    )
                )}

              </div>
            </div>

            {/* SCORE BOARD */}

            <div className="minecraft-terminal">

              <div className="border-b border-gray-800 p-3 flex gap-2 items-center">

                <Trophy
                  size={15}
                  className="text-yellow-500"
                />

                <span className="text-xs font-bold tracking-widest">
                  SCORE BOARD
                </span>

              </div>

              <div className="p-4 space-y-4">

                <div className="flex justify-between items-center">

                  <span className="text-blue-400 font-bold">
                    MAYA
                  </span>

                  <span className="text-2xl font-black">
                    {verdict?.mayaScore ||
                      0}
                  </span>

                </div>

                <div className="flex justify-between items-center">

                  <span className="text-red-400 font-bold">
                    KARNA
                  </span>

                  <span className="text-2xl font-black">
                    {verdict?.karnaScore ||
                      0}
                  </span>

                </div>

              </div>

            </div>

            {/* COURT STATUS */}

            <div className="minecraft-terminal p-4">

              <div className="text-[10px] text-gray-500 tracking-widest mb-3">
                COURT STATUS
              </div>

              <div className="text-xs">

                {activeSpeaker ===
                  "Maya" && (
                    <span className="text-blue-400">
                      🎙 Maya is speaking...
                    </span>
                  )}

                {activeSpeaker ===
                  "Karna" && (
                    <span className="text-red-400">
                      🎙 Karna is speaking...
                    </span>
                  )}

                {activeSpeaker ===
                  "Judge" && (
                    <span className="text-yellow-400">
                      ⚖ Judge is evaluating...
                    </span>
                  )}

                {!activeSpeaker &&
                  !debating && (
                    <span className="text-gray-500">
                      Courtroom ready.
                    </span>
                  )}

                {debating &&
                  !activeSpeaker && (
                    <span className="text-yellow-500">
                      Preparing next statement...
                    </span>
                  )}

              </div>

            </div>

          </section>
        </div>

        {/* =====================================================
            VERDICT
            ===================================================== */}

        {verdict && (
          <div className="minecraft-terminal mt-4 p-6 text-center">

            <div className="text-yellow-500 text-xs tracking-[0.4em]">
              FINAL VERDICT
            </div>

            <div className="text-3xl font-black mt-3">
              ⚖ {verdict.winner}
            </div>

            <div className="text-gray-500 text-xs mt-2">
              Confidence:{" "}
              {verdict.confidence}%
            </div>

            <div className="max-w-3xl mx-auto text-sm text-gray-400 mt-4 leading-7">
              {verdict.reasoning}
            </div>

            <button
              onClick={newDebate}
              className="
                mt-5
                px-8
                py-3
                bg-[#6b461c]
                border-2
                border-[#9b6b2a]
                hover:bg-[#80531f]
                font-bold
                tracking-widest
              "
            >
              ⚔ NEW DEBATE
            </button>

          </div>
        )}

        {/* =====================================================
            ERROR
            ===================================================== */}

        {error && (
          <div className="mt-4 max-w-3xl mx-auto border-2 border-red-900 bg-red-950/30 p-4 text-center text-sm text-red-400">

            {error}

            <button
              onClick={() =>
                setShowSetup(true)
              }
              className="block mx-auto mt-3 text-yellow-500 underline"
            >
              Try again
            </button>

          </div>
        )}

        {/* =====================================================
            SYSTEM BAR
            ===================================================== */}

        <div className="minecraft-terminal mt-3 px-4 py-3 flex flex-col md:flex-row justify-between gap-2 text-xs">

          <div className="text-green-500">

            [ SYSTEM ]

            <span className="text-gray-400 ml-3">

              {debating
                ? "The debate is live. Statements are being generated in real time."
                : verdict
                  ? "Debate complete. Verdict generated."
                  : "Courtroom ready. Enter a topic to begin."}

            </span>

          </div>

          <div className="text-gray-600">
            VERDICT ENGINE v1.0
          </div>

        </div>

      </div>
    </main>
  );
}

export default App;