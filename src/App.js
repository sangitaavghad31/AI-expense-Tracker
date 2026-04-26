import React, { useState } from "react";
import "./App.css";
import AddExpenseAI from "./AddExpenseAI";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    date: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addExpense = () => {
    if (!formData.title || !formData.amount || !formData.date) {
      alert("Please fill required fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      ...formData
    };

    setExpenses((prev) => [newExpense, ...prev]);

    // Reset form
    setFormData({
      title: "",
      description: "",
      amount: "",
      date: ""
    });
  };

  const addExpenseFromAI = (expense) => {
  const newExpense = {
    id: Date.now(),
    ...expense
  };

  setExpenses((prev) => [newExpense, ...prev]);
};

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <div className="form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <button onClick={addExpense}>Add Expense</button>
      </div>

      <AddExpenseAI onAdd={addExpenseFromAI} />
      <div className="list">
        <h2>Expense List</h2>

        {expenses.length === 0 && <p>No expenses added yet.</p>}

        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <h3>{expense.title}</h3>
            <p>{expense.description}</p>
            <p>₹ {expense.amount}</p>
            <p>{expense.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;