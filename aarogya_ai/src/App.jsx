import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const cards = [
  { title: "AI Chatbot", body: "Instant guidance, symptom Q&A.", icon: "💬", path: "/chat" },
  { title: "X-ray Upload", body: "Securely upload imaging files.", icon: "🩻", path: "/xray" },
  { title: "Risk Analysis", body: "Insights to flag potential health risks.", icon: "📊", path: "/risk" }
];

function HomePage() {
  return (
    <section className="hero">
      <h1>All-in-one health assistant.</h1>
      <p className="lead">
        
      </p>
      <div className="grid">
        {cards.map((card) => (
          <div key={card.title} className="card">
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <Link to={card.path} className="btn">
              <span className="icon" aria-hidden="true">{card.icon}</span>
              <span>Open {card.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChatPage() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      <h2>AI Assistant</h2>
      <p style={{color: '#9ca7c2'}}>How can I help you today?</p>
      <div style={{
        marginTop: '40px', border:'1px dashed #333', borderRadius:'12px', 
        height:'200px', display:'grid', placeItems:'center', color:'#53d8fb'
      }}>
        [ Chat Interface Placeholder ]
      </div>
    </div>
  );
}

// --- UPDATED XRAY PAGE ---
function XrayPage() {
  // State to remember which button is clicked
  const [selectedArea, setSelectedArea] = useState(null);

  const handleSelect = (area) => {
    setSelectedArea(area);
  };

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      <h2>X-Ray Upload</h2>
      
      {/* 1. New Buttons Section */}
      <p style={{color: '#9ca7c2', marginBottom: '15px'}}>Select the area of scan:</p>
      
      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px'}}>
        {['Teeth', 'Kidney', 'Lungs', 'Bones'].map((area) => (
          <button 
            key={area}
            className="btn"
            onClick={() => handleSelect(area)}
            style={{
              width: 'auto',
              minWidth: '100px',
              // Highlight the button if it is selected
              borderColor: selectedArea === area ? '#53d8fb' : 'rgba(255, 255, 255, 0.12)',
              background: selectedArea === area ? 'rgba(83, 216, 251, 0.15)' : 'transparent',
              color: selectedArea === area ? '#53d8fb' : 'inherit'
            }}
          >
            {area}
          </button>
        ))}
      </div>

      {/* 2. Upload Box */}
      <p style={{color: '#9ca7c2'}}>
        {selectedArea 
          ? `Upload ${selectedArea} X-Ray files below.` 
          : "Select an area above, then drag and drop files."}
      </p>
      
      <div style={{
        marginTop: '15px', background:'rgba(255,255,255,0.02)', 
        height:'150px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center',
        border: '1px dashed rgba(255,255,255,0.1)'
      }}>
        <button className="btn" style={{width:'auto'}}>
          Select Files {selectedArea ? `for ${selectedArea}` : ''}
        </button>
      </div>
    </div>
  );
}

function RiskPage() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Dashboard</Link>
      <h2>Risk Analysis</h2>
      <p style={{color: '#9ca7c2'}}>Patient Summary: #49221</p>
      <ul style={{marginTop:'20px', lineHeight:'2', color:'#e7ecf5'}}>
        <li>• Heart Rate: <strong>Normal (72 bpm)</strong></li>
        <li>• Blood Pressure: <strong style={{color:'#9b8cff'}}>Elevated</strong></li>
        <li>• Sleep Pattern: <strong>Irregular</strong></li>
      </ul>
    </div>
  );
}

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