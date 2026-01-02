import dns from "node:dns";
import { Agent, setGlobalDispatcher } from "undici";

dns.setDefaultResultOrder("ipv4first");

setGlobalDispatcher(
  new Agent({
    keepAliveTimeout: 10_000,
    keepAliveMaxTimeout: 10_000,
  })
);

import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/config.js";
import { BadException } from "../errors/errors.js";
import { logger } from "./logger.js";
import type { AnalysisResponse } from "../models/resume.js";

const client = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

export async function analyzeResume(
  resumeText: string,
  retries: number = 3
): Promise<AnalysisResponse | undefined> {
  const prompt = `
    Return ONLY valid JSON that matches the schema exactly.
    Do not include markdown.
    Do not include explanations.
    overall score over 100

    Resume:
    ${resumeText.slice(0, 1200)}
  `;

  for (let i = 0; i < retries; i++) {
    try {
      const result = await client.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              overall_score: { type: "number" },
              summary: { type: "string" },
              report_details: {
                type: "object",
                properties: {
                  strengths: { type: "array", items: { type: "string" } },
                  weaknesses: { type: "array", items: { type: "string" } },
                  skills_found: { type: "array", items: { type: "string" } },
                },
                required: ["weaknesses"],
              },
            },
            required: ["overall_score", "summary", "report_details"],
          },
        },
      });
      console.log(result);

      const responsetext = result.text || (result as any).response?.text?.();
      if (!responsetext) {
        throw new BadException("Error analyzing resume");
      }
      const cleanJson = responsetext.replace(/```json|```/g, "").trim();

      const output = JSON.parse(cleanJson) as AnalysisResponse;
      return output;
    } catch (err: any) {
      logger.error(err);
      const status = err.status || err.code;
      const isNetworkError =
        err.message?.includes("fetch failed") ||
        err.code === "ECONNRESET" ||
        err.code === "ETIMEDOUT";
      const isQuotaError = err.status === 429;
      const isRetryable =
        isNetworkError || isQuotaError || (status >= 500 && status < 600);

      if (i < retries - 1 && isRetryable) {
        const waitTime = 5000 * Math.pow(2, i);
        logger.warn(
          `Attempt ${i + 1} failed (Reason: ${
            isQuotaError ? "Quota" : "Network"
          }). Retrying in ${waitTime / 1000}s...`
        );

        await new Promise((res) => setTimeout(res, waitTime));
        continue;
      }
      logger.error("Resume Analysis failed permanently:", err.message);
      throw new BadException(
        "System is currently overloaded. Please try again in a few minutes."
      );
    }
  }
}