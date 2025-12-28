import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Quiz from "./components/Quiz";
import "./styles/quiz.css";

import cutuImg from "./assets/cutu.png";

function HomePage() {
  return (
    <section className="hero">
      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        {/* Text */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h1>All-in-one health assistant.</h1>

          {/* Paragraph + badge wrapped in a div */}
          <div className="project-desc-container">
            <p className="project-desc">
              Aarogya AI is a preventive healthcare platform that combines AI-powered
              X-ray analysis, lifestyle-based chronic disease risk detection, and an
              intelligent health chatbot into one unified system. The goal is to
              promote early health awareness and accessibility by providing users
              with preliminary insights and guidance before seeking professional
              medical care.
            </p>
            <div className="hackathon-badge">
              🚀 Hackathon Prototype • AI-powered Preventive Healthcare
            </div>
          </div>

          <p style={{ color: "#53d8fb", marginTop: "10px", fontWeight: "500" }}>
            Built for early detection, accessibility, and preventive healthcare.
          </p>
        </div>

        {/* Image */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <img
            src={cutuImg}
            alt="Health Illustration"
            style={{ width: "100%", borderRadius: "12px" }}
          />
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="features" style={{ marginTop: "40px" }}>
        <Link to="/xray" className="feature-card clickable">
          <span className="feature-icon">🩻</span>
          <h3>X-Ray Analysis</h3>
          <p>
            Upload X-ray images to receive AI-assisted insights that help identify
            potential abnormalities and support early medical awareness.
          </p>
          <span className="cta-text">Start X-ray Analysis →</span>
        </Link>

        <Link to="/risk" className="feature-card clickable">
          <span className="feature-icon">📊</span>
          <h3>Chronic Disease Risk Detection</h3>
          <p>
            Analyze lifestyle factors such as daily habits, activity levels, and
            health history to estimate the risk of chronic conditions.
          </p>
          <span className="cta-text">Check Risk Score →</span>
        </Link>

        <button
          className="feature-card clickable chatbot-card"
          onClick={() => {
            document.querySelector("df-messenger")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="feature-icon">💬</span>
          <h3>Health Chatbot</h3>
          <p>
            Get instant AI guidance for common health issues like fever, headache,
            and general discomfort.
          </p>
          <span className="cta-text">Chat with AI →</span>
        </button>
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

/* ---------- XRAY PAGE ---------- */
function XrayPage() {
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <h2>X-Ray Upload</h2>

      <p style={{ color: "#9ca7c2", marginBottom: "15px" }}>
        Select the area of scan:
      </p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px" }}>
        {["Kidney", "Lungs", "Bones"].map((area) => (
          <button
            key={area}
            className="btn"
            onClick={() => setSelectedArea(area)}
            style={{
              width: "auto",
              minWidth: "100px",
              borderColor: selectedArea === area ? "#53d8fb" : "rgba(255, 255, 255, 0.12)",
              background: selectedArea === area ? "rgba(83, 216, 251, 0.15)" : "transparent",
              color: selectedArea === area ? "#53d8fb" : "inherit",
            }}
          >
            {area}
          </button>
        ))}
      </div>

      <p style={{ color: "#9ca7c2" }}>
        {selectedArea
          ? `Upload ${selectedArea} X-Ray files below.`
          : "Select an area above, then drag and drop files."}
      </p>

      <div
        style={{
          marginTop: "15px",
          background: "rgba(255,255,255,0.02)",
          height: "150px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed rgba(255,255,255,0.1)",
        }}
      >
        <button className="btn" style={{ width: "auto" }}>
          Select Files {selectedArea ? `for ${selectedArea}` : ""}
        </button>
      </div>
    </div>
  );
}

/* ---------- RISK PAGE ---------- */
function RiskPage() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>
      <Quiz />
    </div>
  );
}

/* ---------- MAIN APP ---------- */
function App() {
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

export default App;
