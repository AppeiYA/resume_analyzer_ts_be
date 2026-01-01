import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/config.js";
import { BadException } from "../errors/errors.js";
import { logger } from "./logger.js";
import type { AnalysisResponse } from "../models/resume.js";

const client = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

export async function analyzeResume(resumeText: string, retries:number = 3): Promise<AnalysisResponse | undefined> {
  for(let i=0; i<retries;i++){
     try {
       const result = await client.models.generateContent({
         model: "gemini-2.5-flash-lite",
         contents: [
           {
             role: "user",
             parts: [
               {
                 text: `Analyze this resume accurately with no mistakes: ${resumeText}`,
               },
             ],
           },
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

       const responsetext = result.text || (result as any).response?.text?.();
       if (!responsetext) {
         throw new BadException("Error analyzing resume");
       }
       const cleanJson = responsetext.replace(/```json|```/g, "").trim();

       const output = JSON.parse(cleanJson) as AnalysisResponse;
       return output;
     } catch (err: any) {
      const isNetworkError = err.message?.includes("fetch failed");
      const isQuotaError = err.status === 429;

      if (i < retries - 1 && (isNetworkError || isQuotaError)) {
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
