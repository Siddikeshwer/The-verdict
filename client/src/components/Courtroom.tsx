import { motion } from "framer-motion";

type Props = {
    activeSpeaker: "Karna" | "Maya" | "Judge" | null;
    debating: boolean;
    topic?: string;
    round?: number;
};

function Character({
    name,
    side,
    active,
    type,
}: {
    name: string;
    side: "MAYA" | "KARNA" | "JUDGE";
    active: boolean;
    type: "maya" | "karna" | "judge";
}) {
    return (
        <motion.div
            animate={{
                y: active ? [-3, 2, -3] : 0,
            }}
            transition={{
                duration: 1.2,
                repeat: active ? Infinity : 0,
            }}
            className={`relative flex flex-col items-center transition-all duration-300 ${active ? "scale-[1.04]" : ""
                }`}
        >
            <div
                className={`absolute -inset-3 rounded-lg blur-xl transition-opacity ${active ? "opacity-50" : "opacity-0"
                    } ${side === "MAYA"
                        ? "bg-blue-500"
                        : side === "KARNA"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                    }`}
            />

            <div
                className={`relative w-[150px] h-[170px] md:w-[190px] md:h-[190px]
        border-2 flex items-center justify-center overflow-hidden
        ${active
                        ? side === "MAYA"
                            ? "border-blue-400"
                            : side === "KARNA"
                                ? "border-red-400"
                                : "border-yellow-400"
                        : "border-[#5b4127]"
                    }
        bg-[#17120d] shadow-[inset_0_0_30px_rgba(0,0,0,.8)]`}
            >
                {/* Pixel character */}
                <div className="relative scale-[1.35]">
                    {type === "judge" ? (
                        <div className="text-center">
                            <div className="text-[64px] leading-none">⚖</div>
                            <div className="mt-1 w-20 h-7 bg-[#29231b] border-2 border-[#75552b]" />
                        </div>
                    ) : (
                        <div className="relative">
                            <div
                                className={`w-12 h-12 mx-auto border-4 ${type === "maya"
                                    ? "bg-[#c89570] border-[#714b38]"
                                    : "bg-[#b77b55] border-[#643d2c]"
                                    }`}
                            />

                            <div
                                className={`w-20 h-16 mt-1 border-4 ${type === "maya"
                                    ? "bg-[#173b68] border-[#0b213d]"
                                    : "bg-[#241d1c] border-[#0e0c0c]"
                                    }`}
                            />

                            <div className="absolute top-3 left-2 w-2 h-2 bg-black" />
                            <div className="absolute top-3 right-2 w-2 h-2 bg-black" />
                        </div>
                    )}
                </div>

                {active && (
                    <div
                        className={`absolute bottom-2 px-3 py-1 text-[10px] font-bold tracking-widest border ${side === "MAYA"
                            ? "border-blue-500 text-blue-300 bg-blue-950/80"
                            : side === "KARNA"
                                ? "border-red-500 text-red-300 bg-red-950/80"
                                : "border-yellow-500 text-yellow-300 bg-yellow-950/80"
                            }`}
                    >
                        SPEAKING
                    </div>
                )}
            </div>

            <div
                className={`mt-3 px-6 py-1 border-2 bg-[#100d09] font-black tracking-widest text-lg ${side === "MAYA"
                    ? "border-blue-800 text-blue-400"
                    : side === "KARNA"
                        ? "border-red-800 text-red-400"
                        : "border-yellow-700 text-yellow-400"
                    }`}
            >
                {name}
            </div>

            {side !== "JUDGE" && (
                <div
                    className={`mt-1 text-[10px] font-bold tracking-widest ${side === "MAYA"
                        ? "text-red-400"
                        : "text-blue-400"
                        }`}
                >
                    {side === "MAYA" ? "AGAINST" : "FOR"}
                </div>
            )}
        </motion.div>
    );
}

export default function Courtroom({
    activeSpeaker,
    debating,
    topic = "AI IS TAKING OVER HUMAN JOBS",
    round = 1,
}: Props) {
    return (
        <div className="minecraft-court relative overflow-hidden">

            {/* Ceiling */}
            <div className="court-ceiling" />

            {/* Stone walls */}
            <div className="court-wall court-wall-left" />
            <div className="court-wall court-wall-right" />

            {/* Wooden beams */}
            <div className="beam beam-top" />
            <div className="beam beam-left" />
            <div className="beam beam-right" />

            {/* Lanterns */}
            <div className="lantern lantern-left">
                <div />
            </div>

            <div className="lantern lantern-right">
                <div />
            </div>

            {/* Header */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30">
                <div className="pixel-panel px-8 py-3 text-center">
                    <div className="text-2xl md:text-4xl font-black tracking-[0.15em] text-[#eee5d2]">
                        ⚖ THE VERDICT
                    </div>

                    <div className="text-[10px] md:text-xs text-yellow-500 tracking-[0.5em] mt-1">
                        AI COURTROOM
                    </div>
                </div>
            </div>

            {/* Topic */}
            <div className="absolute top-5 left-5 z-30">
                <div className="pixel-panel w-56 p-3">

                    <div className="text-[10px] text-yellow-500 tracking-[0.25em]">
                        CURRENT TOPIC
                    </div>

                    <div className="mt-2 text-sm text-white leading-5">
                        {topic || "NO TOPIC SELECTED"}
                    </div>

                </div>
            </div>
            {/* Round */}
            <div className="absolute top-5 right-5 z-30">
                <div className="pixel-panel w-32 p-3 text-center">
                    <div className="text-[10px] text-yellow-500 tracking-[0.25em]">
                        ROUND
                    </div>

                    <div className="text-xl font-black mt-1">
                        {round} / 3
                    </div>
                </div>
            </div>

            {/* Courtroom stage */}
            <div className="relative z-20 min-h-[570px] pt-32 px-8">

                <div className="flex items-end justify-center gap-6 md:gap-16 lg:gap-28">

                    {/* Maya */}
                    <Character
                        name="MAYA"
                        side="MAYA"
                        type="maya"
                        active={activeSpeaker === "Maya"}
                    />

                    {/* Judge */}
                    <div className="mb-4">
                        <Character
                            name="JUDGE"
                            side="JUDGE"
                            type="judge"
                            active={activeSpeaker === "Judge"}
                        />
                    </div>

                    {/* Karna */}
                    <Character
                        name="KARNA"
                        side="KARNA"
                        type="karna"
                        active={activeSpeaker === "Karna"}
                    />

                </div>

                {/* Judge bench */}
                <div className="judge-bench">
                    <div className="bench-top" />
                    <div className="bench-body">
                        <span>⚖</span>
                        <strong>THE VERDICT</strong>
                    </div>
                </div>

                {/* Podiums */}
                <div className="podium podium-left">
                    <div className="banner blue-banner">⚖</div>
                </div>

                <div className="podium podium-right">
                    <div className="banner red-banner">⚖</div>
                </div>

                {/* Carpet */}
                <div className="court-carpet" />

                {/* Audience */}
                <div className="audience">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            className="audience-block"
                            style={{
                                animationDelay: `${i * 120}ms`,
                            }}
                        />
                    ))}
                </div>

            </div>

            {/* Current speaker */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40">
                <div className="speaker-bar">

                    <div className="text-[10px] text-yellow-500 tracking-[0.25em]">
                        CURRENT SPEAKER
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-1">

                        <span className="text-2xl">
                            🎙
                        </span>

                        <span
                            className={`text-xl font-black ${activeSpeaker === "Maya"
                                ? "text-blue-400"
                                : activeSpeaker === "Karna"
                                    ? "text-red-400"
                                    : "text-yellow-400"
                                }`}
                        >
                            {activeSpeaker
                                ? activeSpeaker.toUpperCase()
                                : "COURT"}
                        </span>

                        <span className="font-bold">
                            {activeSpeaker
                                ? "IS SPEAKING..."
                                : debating
                                    ? "LISTENING..."
                                    : "READY"}
                        </span>

                    </div>
                </div>
            </div>
        </div>
    );
}