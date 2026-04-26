import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function AddExpenseAI({ onAdd }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  const ai = new GoogleGenerativeAI(apiKey);

  const handleAdd = async (inputText = text) => {
    if (!inputText) return;

    setLoading(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const prompt = `
You are an expense extraction assistant.

Extract structured data from:
"${inputText}"

Return ONLY valid JSON:
{
  "title": "",
  "amount": number,
  "category": "",
  "date": "${today}",
  "description": "${inputText}"
}
`;

      const model = ai.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

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
        ...data,
      });

      setText("");
    } catch (e) {
      console.log("Something went wrong:", e);

      onAdd({
        id: Date.now(),
        title: inputText,
        amount: 0,
        category: "unknown",
        date: new Date().toISOString().split("T")[0],
        description: inputText,
      });
    }

    setLoading(false);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      handleAdd(transcript);
    };

    recognition.start();
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

      <button onClick={() => handleAdd()} disabled={loading}>
        {loading ? "Processing..." : "Add with AI"}
      </button>

      <button onClick={handleVoiceInput}>
        {listening ? "Listening..." : "🎤 Voice Input"}
      </button>
    </div>
  );
}

export default AddExpenseAI;