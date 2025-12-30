import { createRequire } from "module";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import path from "path";

export const extractTextFromFile = async (
  file: Express.Multer.File
): Promise<string> => {
  const ext = path.extname(file.originalname).toLowerCase();
  let extractedText: string;

  if (ext === ".pdf") {
    extractedText = await extractPdfText(file.buffer);
  } else if (ext === ".docx") {
    extractedText = await extractDocxText(file.buffer);
  } else {
    extractedText = "";
  }

  return extractedText;
};

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
