import { Link } from "react-router-dom";
import { useState } from "react";
import "./../styles/quiz.css";
import questions from "./questions";

const API_BASE = "http://127.0.0.1:5000";

export default function Quiz() {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const safeFetch = async (url) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Server error");
    }

    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call APIs sequentially and safely
      const heart = await safeFetch(`${API_BASE}/predict/heart`);
      const diabetes = await safeFetch(`${API_BASE}/predict/diabetes`);
      const lung = await safeFetch(`${API_BASE}/predict/lung`);

      setResult({
        heart: heart.risk_percentage,
        diabetes: diabetes.risk_percentage,
        lung: lung.risk_percentage,
      });

    } catch (err) {
      console.error("Backend error:", err);
      setError("Server error while processing your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      <h1 className="quiz-title">Chronic Disease Risk Questionnaire</h1>

      <form className="quiz-form" onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="quiz-field">
            <label>{q.label}</label>

            {q.type === "select" ? (
              <select
                value={formData[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                <option value="">Select</option>
                {q.options.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={formData[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}

        <button className="submit-btn" disabled={loading}>
          {loading ? "Analyzing..." : "Submit Questionnaire"}
        </button>
      </form>

      {error && (
        <div className="result-box error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {result && (
        <div className="result-box">
          <p>❤️ Heart Disease Risk: <strong>{result.heart}%</strong></p>
          <p>🩸 Diabetes Risk: <strong>{result.diabetes}%</strong></p>
          <p>🫁 Lung Cancer Risk: <strong>{result.lung}%</strong></p>


        </div>
      )}
    </div>
  );
}
