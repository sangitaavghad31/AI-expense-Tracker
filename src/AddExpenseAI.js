import React, { useState } from "react";
import { GoogleGenAI } from '@google/genai';

function AddExpenseAI({ onAdd }) {
  const [text, setText] = useState("");
  const [expense, setExpenses] = useState()
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.REACT_APP_GIMINI_API_KEY;
  const ai = new GoogleGenAI({apiKey: apiKey});
  const parseExpense = (input) => {
    // Very basic parsing logic
    const words = input.split(" ");
    let amount = "";
    let title = "";

    words.forEach((word) => {
      if (!isNaN(word)) {
        amount = word;
      } else if (word.toLowerCase() !== "rupees") {
        title += word + " ";
      }
    });

    return {
      title: title.trim() || "Quick Expense",
      description: input,
      amount: amount || "0",
      date: new Date().toISOString().split("T")[0]
    };
  };

  const handleAdd = async() => {
    if (!text) return;
    setLoading(true);

    try{
        const today = new Date().toISOString().split("T")[0];
        const prompt =`
        you are expense extraction assistant.
        Extract details in JSON format from the text :${text}.
        Include:
        - title(short name of expense)
        - amount(in number)
        -category(like food, travel, etc)
        -date(use current date:${today})`

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        })
       const clearedText = (response.text || "")
            .replace(/```json/gi, "")
            .replace(/```/g, "")
             .trim();
             const data = JSON.parse(clearedText);
             console.log("parse d", data);
        const parsed = parseExpense(text);
        onAdd(data);

        setText("");
    }catch(e){
        console.log("something went wrong",e);
    }
   
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

      <button onClick={handleAdd}>Add with AI</button>
    </div>
  );
}

export default AddExpenseAI;