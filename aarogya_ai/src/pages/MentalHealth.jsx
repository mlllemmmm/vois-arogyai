import { useState } from "react";

/* ================= DUMMY THERAPIST DATA ================= */
const therapists = [
  {
    name: "Dr. A. Sharma",
    specialty: "Anxiety & Stress",
    price: 400,
    availability: "Today 6–9 PM",
  },
  {
    name: "Dr. R. Mehta",
    specialty: "Depression & Burnout",
    price: 500,
    availability: "Tomorrow 4–8 PM",
  },
];

/* ================= ELEVENLABS CALL TRIGGER ================= */
function openAaroCareCall() {
  const widget = document.querySelector("elevenlabs-convai");

  if (!widget) {
    alert("Voice assistant is still loading. Please try again.");
    return;
  }

  const shadow = widget.shadowRoot;
  if (!shadow) {
    alert("Voice assistant not ready yet.");
    return;
  }

  const startButton = shadow.querySelector("button");
  if (startButton) {
    startButton.click();
  } else {
    alert("Unable to start call. Please use the widget button.");
  }
}

/* ================= MAIN PAGE ================= */
export default function MentalHealth() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mental Health Support</h1>
      <p>Feeling lonely? Tired? Unheard? Feel free to let it out!</p>

      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <VoiceBotCard />
        <TherapistCard />
      </div>
    </div>
  );
}

/* ================= VOICE BOT CARD ================= */
function VoiceBotCard() {
  const [listening, setListening] = useState(false);

  return (
    <div className="card">
      <h2>🎧 AI Voice Companion (Free)</h2>
      <p>
        A judgment-free AI voice that listens and supports you emotionally.
      </p>

      <ul>
        <li>24/7 availability</li>
        <li>Stress & anxiety support</li>
        <li>Voice-based conversation</li>
        <li>Completely free</li>
      </ul>

      <button
        className={`btn-primary ${listening ? "btn-listening" : ""}`}
        onClick={() => {
          setListening(true);
          openAaroCareCall();
        }}
      >
        {listening ? "🎙️ Listening…" : "🎧 Talk to AI Now"}
      </button>
    </div>
  );
}

/* ================= THERAPIST CARD ================= */
function TherapistCard() {
  return (
    <div className="card">
      <h2>🧑‍⚕️ Talk to a Real Therapist</h2>
      <p>
        <strong>Starting at ₹400/hour (Students)</strong>
      </p>

      {therapists.map((t, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <p>
            <strong>{t.name}</strong>
          </p>
          <p>{t.specialty}</p>
          <p>₹{t.price}/hour</p>
          <p>{t.availability}</p>

          <button onClick={() => alert("Payment flow coming soon")}>
            Book Session
          </button>
        </div>
      ))}
    </div>
  );
}
