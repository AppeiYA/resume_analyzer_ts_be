import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/config.js";
import { BadException } from "../errors/errors.js";
import { logger } from "./logger.js";


const client = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

export async function analyzeResume(resumeText: string):Promise<any> {
  const result = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      { role: "user", parts: [{ text: `Analyze this resume: ${resumeText}` }] },
    ],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          overall_score: { type: "integer" },
          summary: { type: "string" },
          report_details: {
            type: "object",
            properties: {
              strengths: { type: "array", items: { type: "string" } },
              weaknesses: { type: "array", items: { type: "string" } },
              skills_found: { type: "array", items: { type: "string" } },
            },
            required: ["strengths", "weaknesses", "skills_found"],
          },
        },
        required: ["overall_score", "summary", "report_details"],
      },
    },
  });


  const responsetext = result.text;
  if(!responsetext) {
    return new BadException("Error analyzing resume")
  }
  const cleanJson = responsetext.replace(/```json|```/g, "").trim();
  try {
    const output = JSON.parse(cleanJson);
    return output
  } catch (error) {
    logger.error(error)
    throw new Error("Failed to parse resume analysis.");
  }
}
