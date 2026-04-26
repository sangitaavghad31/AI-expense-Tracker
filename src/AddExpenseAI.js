import React, { useState } from "react";
import {GoogleGenAI} from '@google/genai';

function AddExpenseAI({ onAdd }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const ai = new GoogleGenAI({apiKey: apiKey});

  const handleAdd = async () => {
    if (!text) return;

    setLoading(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const prompt = `
You are an expense extraction assistant.

Extract structured data from this text:
"${text}"

Return ONLY valid JSON (no markdown, no backticks):

{
  "title": "",
  "amount": number,
  "category": "",
  "date": "${today}",
  "description": "${text}"
}
`;

      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();

      const cleaned = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const data = JSON.parse(cleaned);

      onAdd({
        id: Date.now(),
        ...data
      });

      setText("");
    } catch (e) {
      console.log("Something went wrong:", e);

      // fallback (simple parser)
      const fallback = {
        title: text,
        amount: 0,
        category: "unknown",
        date: new Date().toISOString().split("T")[0],
        description: text
      };

      onAdd(fallback);
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Add Expense with AI</h3>

      <input
        type="text"
        placeholder="100 rupees biryani"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Processing..." : "Add with AI"}
      </button>
    </div>
  );
}

export default AddExpenseAI;