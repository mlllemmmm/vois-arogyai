import { useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

/* ---------------- DASHBOARD DATA ---------------- */
const cards = [
  { title: "AI Chatbot", body: "Instant guidance, symptom Q&A.", icon: "💬", path: "/chat" },
  { title: "X-ray Upload", body: "Securely upload imaging files.", icon: "🩻", path: "/xray" },
  { title: "Risk Analysis", body: "Insights to flag potential health risks.", icon: "📊", path: "/risk" }
];

/* ---------------- HOME PAGE ---------------- */
function HomePage() {
  return (
    <section className="hero">
      <h1>All-in-one health assistant.</h1>
      <div className="grid">
        {cards.map((card) => (
          <div key={card.title} className="card">
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <Link to={card.path} className="btn">
              <span className="icon">{card.icon}</span>
              <span>Open {card.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CHAT PAGE ---------------- */
function ChatPage() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      <h2>AI Assistant</h2>
      <div style={{
        marginTop: "40px",
        border: "1px dashed #333",
        borderRadius: "12px",
        height: "200px",
        display: "grid",
        placeItems: "center",
        color: "#53d8fb"
      }}>
        [ Chat Interface Placeholder ]
      </div>
    </div>
  );
}

/* ---------------- XRAY PAGE ---------------- */
function XrayPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Map selected area to backend endpoint
  const getEndpoint = () => {
    if (selectedArea === "Lungs") return "/predict/lung";
    if (selectedArea === "Bones") return "/predict/bones";
    if (selectedArea === "Kidney") return "/predict/kidney";
    return null; // Teeth not connected yet
  };

  const handlePredict = async () => {
    if (!selectedFile || !selectedArea) return;

    const endpoint = getEndpoint();
    if (!endpoint) {
      alert("Model for this selection is not available yet.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch(
        `http://127.0.0.1:5000${endpoint}`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();
      const confidence = data.confidence;

      // -----------------------------
      // MEDICALLY SAFE INTERPRETATION
      // -----------------------------
      let assessment;
      let color;

      if (confidence >= 0.75) {
        assessment = "High likelihood of Pneumonia";
        color = "#ff6b6b";
      } else if (confidence >= 0.4) {
        assessment =
          "Inconclusive – Further medical evaluation recommended";
        color = "#facc15";
      } else {
        assessment = "No significant signs of Pneumonia";
        color = "#4ade80";
      }

      setResult({
        confidence,
        assessment,
        color
      });
    } catch (error) {
      alert("Backend connection failed. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      <h2>X-Ray Upload</h2>

      <p style={{ color: "#9ca7c2" }}>Select the area of scan:</p>

      {/* AREA SELECTION */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap"
        }}
      >
        {["Teeth", "Kidney", "Lungs", "Bones"].map((area) => (
          <button
            key={area}
            className="btn"
            onClick={() => {
              setSelectedArea(area);
              setSelectedFile(null);
              setResult(null);
            }}
            style={{
              borderColor:
                selectedArea === area
                  ? "#53d8fb"
                  : "rgba(255,255,255,0.12)",
              background:
                selectedArea === area
                  ? "rgba(83,216,251,0.15)"
                  : "transparent",
              color:
                selectedArea === area
                  ? "#53d8fb"
                  : "inherit"
            }}
          >
            {area}
          </button>
        ))}
      </div>

      <p style={{ color: "#9ca7c2" }}>
        {selectedArea
          ? `Upload ${selectedArea} X-Ray image below.`
          : "Select an area above to enable upload."}
      </p>

      {/* FILE INPUT */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      {/* UPLOAD + SCAN */}
      <div
        style={{
          marginTop: "15px",
          height: "180px",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px"
        }}
      >
        <button
          className="btn"
          disabled={!selectedArea}
          onClick={() => fileInputRef.current.click()}
        >
          Select File {selectedArea ? `for ${selectedArea}` : ""}
        </button>

        {selectedFile && (
          <span style={{ fontSize: "14px", color: "#53d8fb" }}>
            {selectedFile.name}
          </span>
        )}

        <button
          className="btn"
          disabled={!selectedFile || loading}
          onClick={handlePredict}
        >
          {loading ? "Scanning..." : "Scan X-Ray"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: result.color }}>
            <b>Assessment:</b> {result.assessment}
          </p>
          <p style={{ color: "#53d8fb" }}>
            <b>Confidence:</b>{" "}
            {(result.confidence * 100).toFixed(2)}%
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#9ca7c2",
              marginTop: "8px"
            }}
          >
            This result is generated by an AI model and is not a medical
            diagnosis. Please consult a qualified doctor.
          </p>
        </div>
      )}
    </div>
  );
}



/* ---------------- RISK PAGE ---------------- */
function RiskPage() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      <h2>Risk Analysis</h2>
      <ul style={{ marginTop: "20px", lineHeight: "2" }}>
        <li>• Heart Rate: <strong>Normal</strong></li>
        <li>• Blood Pressure: <strong>Elevated</strong></li>
        <li>• Sleep Pattern: <strong>Irregular</strong></li>
      </ul>
    </div>
  );
}

/* ---------------- APP ROOT ---------------- */
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
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/xray" element={<XrayPage />} />
          <Route path="/risk" element={<RiskPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
