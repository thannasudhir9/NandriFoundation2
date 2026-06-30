import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Search endpoint
  app.post("/api/search", async (req, res) => {
    try {
      const { query, data } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `You are an AI assistant helping to filter a list of data based on a user's natural language query.
Query: "${query}"

Here is the data in JSON format:
${JSON.stringify(data, null, 2)}

Filter this data to include ONLY the items that match the user's query. 
Return the result strictly as a JSON array of the original items. Do not include markdown formatting or explanations. If nothing matches, return [].`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || "[]";
      // Try to parse out the JSON array
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = text.substring(jsonStart, jsonEnd + 1);
        const result = JSON.parse(jsonStr);
        res.json({ results: result });
      } else {
        res.json({ results: [] });
      }
    } catch (error) {
      console.error('AI Search Error:', error);
      res.status(500).json({ error: 'Failed to process AI search' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
