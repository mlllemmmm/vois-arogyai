import React, { useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Quiz from "./components/Quiz";
import "./styles/quiz.css";
import cutuImg from "./assets/cutu.png";

/* ================= HOME PAGE ================= */
function HomePage() {
  return (
    <section className="hero">
      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h1>All-in-one health assistant.</h1>

          <div className="project-desc-container">
            <p className="project-desc">
              Aarogya AI is a preventive healthcare platform that combines AI-powered
              X-ray analysis, lifestyle-based chronic disease risk detection, and an
              intelligent health chatbot into one unified system.
            </p>
            <div className="hackathon-badge">
              🚀 Hackathon Prototype • AI-powered Preventive Healthcare
            </div>
          </div>

          <p style={{ color: "#53d8fb", marginTop: "10px", fontWeight: "500" }}>
            Built for early detection, accessibility, and preventive healthcare.
          </p>
        </div>

        <div style={{ flex: 1, minWidth: "200px", textAlign: "center" }}>
          <img
            src={cutuImg}
            alt="Health Illustration"
            style={{ width: "70%", maxWidth: "280px", borderRadius: "12px" }}
          />
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="features info-cards">
        <Link to="/xray" className="feature-card clickable">
          <span className="feature-icon">🩻</span>
          <h3>X-Ray Analysis</h3>
          <p>AI-assisted analysis of medical X-ray images.</p>
          <span className="cta-text">Start X-Ray Analysis →</span>
        </Link>

        <Link to="/risk" className="feature-card clickable">
          <span className="feature-icon">📊</span>
          <h3>Chronic Disease Risk Detection</h3>
          <p>Lifestyle-based ML risk assessment.</p>
          <span className="cta-text">Check Risk →</span>
        </Link>

        <div
          className="feature-card clickable chatbot-card"
          onClick={() =>
            document.querySelector("df-messenger")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span className="feature-icon">💬</span>
          <h3>Health Chatbot</h3>
          <p>Instant AI guidance for common health concerns.</p>
          <span className="cta-text">Chat with AI →</span>
        </div>
      </div>

      {/* CHATBOT */}
      <df-messenger
        intent="WELCOME"
        chat-title="arogyai"
        agent-id="22591bdc-f998-476e-81c4-af92f6f54692"
        language-code="en"
      ></df-messenger>
    </section>
  );
}

/* ================= XRAY PAGE ================= */
function XrayPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const getEndpoint = () => {
    if (selectedArea === "Lungs") return "/predict/xray/lung";
    if (selectedArea === "Bones") return "/predict/xray/bones";
    if (selectedArea === "Kidney") return "/predict/xray/kidney";
    return null;
  };

  const handlePredict = async () => {
    if (!selectedFile || !selectedArea) return;

    const endpoint = getEndpoint();
    if (!endpoint) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      let assessment, color;
      if (data.confidence >= 0.75) {
        assessment = "High likelihood of abnormality detected";
        color = "#ff6b6b";
      } else if (data.confidence >= 0.4) {
        assessment = "Inconclusive — further evaluation recommended";
        color = "#facc15";
      } else {
        assessment = "No significant abnormality detected";
        color = "#4ade80";
      }

      setResult({ confidence: data.confidence, assessment, color });
    } catch {
      alert("Backend connection failed. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      <h2>X-Ray Upload</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["Kidney", "Lungs", "Bones"].map((area) => (
          <button
            key={area}
            className="btn"
            onClick={() => {
              setSelectedArea(area);
              setSelectedFile(null);
              setResult(null);
            }}
          >
            {area}
          </button>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <button className="btn" onClick={() => fileInputRef.current.click()}>
        Select X-Ray Image
      </button>

      {selectedFile && <p>{selectedFile.name}</p>}

      <button className="btn" disabled={!selectedFile || loading} onClick={handlePredict}>
        {loading ? "Scanning..." : "Scan X-Ray"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: result.color }}>
            <b>Assessment:</b> {result.assessment}
          </p>
          <p><b>Confidence:</b> {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

/* ================= RISK PAGE ================= */
function RiskPage() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      <Quiz />
    </div>
  );
}

/* ================= APP ROOT ================= */
export default function App() {
  return (
    <BrowserRouter>
      <div className="shell">
        <header>
          <Link to="/" className="logo">
            <div className="logo-circle">Rx</div>
            <span>Aarogya AI</span>
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/xray" element={<XrayPage />} />
          <Route path="/risk" element={<RiskPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
