import {
    karnaOpening,
    karnaRebuttal,
} from "../agents/karna";

import {
    mayaOpening,
    mayaRebuttal,
} from "../agents/maya";

import { judgeDebate } from "../agents/judge";

export async function runDebate(
    topic: string
) {
    console.log("Starting debate:", topic);

    /*
     * TEMPORARY RESEARCH
     *
     * This will be replaced with REAL WEB SEARCH next.
     */

    const karnaResearch = `
Topic: ${topic}

Karna should research and use evidence
supporting the FOR position.

Important:
Do not invent sources.
Use factual reasoning.
`;

    const mayaResearch = `
Topic: ${topic}

Maya should research and use evidence
supporting the AGAINST position.

Important:
Do not invent sources.
Use factual reasoning.
`;

    const messages: any[] = [];

    /*
     * =========================
     * ROUND 1
     * OPENING STATEMENTS
     * =========================
     */

    console.log("Round 1: Karna opening");

    const karnaStart =
        await karnaOpening(
            topic,
            karnaResearch
        );

    messages.push({
        speaker: "Karna",
        side: "FOR",
        text: karnaStart,
        round: 1,
    });

    console.log("Round 1: Maya opening");

    const mayaStart =
        await mayaOpening(
            topic,
            mayaResearch
        );

    messages.push({
        speaker: "Maya",
        side: "AGAINST",
        text: mayaStart,
        round: 1,
    });

    /*
     * =========================
     * ROUND 2
     * CROSS EXAMINATION
     * =========================
     */

    console.log("Round 2: Karna rebuttal");

    const karnaCounter =
        await karnaRebuttal(
            topic,
            mayaStart,
            karnaResearch
        );

    messages.push({
        speaker: "Karna",
        side: "FOR",
        text: karnaCounter,
        round: 2,
    });

    console.log("Round 2: Maya rebuttal");

    const mayaCounter =
        await mayaRebuttal(
            topic,
            karnaCounter,
            mayaResearch
        );

    messages.push({
        speaker: "Maya",
        side: "AGAINST",
        text: mayaCounter,
        round: 2,
    });

    /*
     * =========================
     * ROUND 3
     * FINAL ARGUMENTS
     * =========================
     */

    console.log("Round 3: Karna final");

    const finalKarna =
        await karnaRebuttal(
            topic,
            mayaCounter,
            karnaResearch
        );

    messages.push({
        speaker: "Karna",
        side: "FOR",
        text: finalKarna,
        round: 3,
    });

    console.log("Round 3: Maya final");

    const finalMaya =
        await mayaRebuttal(
            topic,
            finalKarna,
            mayaResearch
        );

    messages.push({
        speaker: "Maya",
        side: "AGAINST",
        text: finalMaya,
        round: 3,
    });

    /*
     * =========================
     * JUDGE
     * =========================
     */

    console.log("Judge evaluating debate");

    const verdict =
        await judgeDebate(
            topic,
            [
                karnaStart,
                karnaCounter,
                finalKarna,
            ],
            [
                mayaStart,
                mayaCounter,
                finalMaya,
            ]
        );

    console.log("Debate finished");

    return {
        messages,

        evidence: [],

        verdict,
    };
}