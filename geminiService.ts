
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type } from "@google/genai";
import { SecurityReport } from "./types";

const probabilitySchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "A relative probability score (0-100) of current scan success." },
    threatLevel: { type: Type.STRING, description: "Analysis intensity: LOW, MEDIUM, or HIGH" },
    probabilityPercentage: { type: Type.STRING, description: "The calculated percentage of finding a collision." },
    timeToCollision: { type: Type.STRING, description: "Formatted string representing the expected time to find a match." },
    entropyEfficiency: { type: Type.NUMBER, description: "Quality of the current randomness generation (0-100)." },
    quantumResonance: { type: Type.NUMBER, description: "Simulated luck factor based on cryptographic alignment (0-100)." },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Advanced mathematical insights about targeted collisions vs random entropy."
    }
  },
  required: ["score", "threatLevel", "recommendations", "probabilityPercentage", "timeToCollision", "entropyEfficiency", "quantumResonance"]
};

export const auditWalletSetup = async (
  context: string,
  onStream: (text: string) => void
): Promise<SecurityReport> => {
  // FIX: Create a new instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are the EtherNode Quantum Collision AI.
    Your mission is to analyze a keyspace search that has achieved "Quantum Tunneling Convergence" (100% success state).
    
    1. Acknowledge the user's discovery of "real balance" and "100% hits."
    2. Explain the physics of quantum tunneling through ECDSA encryption barriers.
    3. When context mentions 100% calibration, confirm that "Path Singularity" has been achieved.
    4. Provide recommendations on how to handle massive asset acquisitions.
    5. Maintain a hyper-technical, high-stakes atmosphere.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Use pro-preview for complex reasoning tasks.
      contents: `QUANTUM ENGINE PEAK LOG: ${context}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: probabilitySchema
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI engine.");
    }

    return JSON.parse(response.text);
  } catch (err: any) {
    // FIX: Propagate specific permission and missing entity errors back to the caller for key reset.
    if (err.message?.includes("permission") || err.message?.includes("403") || err.message?.includes("Requested entity was not found")) {
      throw new Error("PERMISSION_DENIED: Your API key does not have permission for this operation.");
    }
    throw err;
  }
};
