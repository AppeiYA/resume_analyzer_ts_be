import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/config.js";

const client = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });


async function runTest() {
  try {
    console.log("Testing API connection...");
    const result = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Test api an reply"
    }
    );
    const responsetext = result.text;
    console.log("Response:", responsetext);
  } catch (error: any) {
    console.error("API Test Failed!");
    console.error("Status Code:", error.status);
    console.error("Message:", error.message);
  }
}

runTest();
