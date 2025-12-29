from flask import Flask, request, jsonify
from flask_cors import CORS
import os

import tensorflow as tf
import numpy as np
from PIL import Image

from joblib import load
import pandas as pd

print("🔥 Aarogya AI Backend Started Successfully 🔥")

# ===================== APP SETUP =====================
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "status": "Aarogya AI Backend Running 🚀",
        "message": "Flask + TensorFlow + ML models loaded successfully"
    })

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ====================================================
# =============== IMAGE MODELS (X-RAY) ================
# ====================================================
lung_xray_model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "models", "best_lung_model.h5")
)
bones_model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "models", "best_custom_cnn.h5")
)
kidney_model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "models", "kidney_model.keras")
)

def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    return np.expand_dims(image, axis=0)

# ---------- LUNG X-RAY ----------
@app.route("/predict/xray/lung", methods=["POST"])
def predict_lung_xray():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(request.files["file"]).convert("RGB")
    img = preprocess_image(image)
    prob = float(lung_xray_model.predict(img)[0][0])

    return jsonify({
        "label": "Pneumonia Detected" if prob >= 0.5 else "No Pneumonia Detected",
        "confidence": prob
    })

# ---------- BONE X-RAY ----------
@app.route("/predict/xray/bones", methods=["POST"])
def predict_bones_xray():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(request.files["file"]).convert("RGB")
    img = preprocess_image(image)
    confidence = float(np.max(bones_model.predict(img)))

    return jsonify({"confidence": confidence})

# ---------- KIDNEY X-RAY ----------
@app.route("/predict/xray/kidney", methods=["POST"])
def predict_kidney_xray():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(request.files["file"]).convert("RGB")
    img = preprocess_image(image)
    confidence = float(np.max(kidney_model.predict(img)))

    return jsonify({"confidence": confidence})

# ====================================================
# =============== RISK MODELS (SKLEARN) ===============
# ====================================================
heart_model = load(os.path.join(BASE_DIR, "models", "heart_model.pkl"))
diabetes_model = load(os.path.join(BASE_DIR, "models", "diabetes_model.pkl"))
lung_risk_model = load(os.path.join(BASE_DIR, "models", "lung_model.pkl"))

gender_map = {"Male": 0, "Female": 1}
yes_no_map = {"Yes": 1, "No": 0}
smoking_map = {"Never": 0, "Former": 1, "Current": 2}
alcohol_map = {"Never": 0, "Occasionally": 1, "Frequently": 2}

def calculate_bmi(weight, height):
    return round(weight / ((height / 100) ** 2), 2) if weight and height else 0

# ---------- HEART DISEASE ----------
@app.route("/predict/risk/heart", methods=["POST"])
def predict_heart_risk():
    data = request.json
    row = {}

    for f in heart_model.feature_names_in_:
        row[f] = 0

    row["Sex"] = gender_map.get(data.get("gender"), 0)
    row["Age_Category"] = min(int(data.get("age", 0)) // 10, 9)
    row["BMI"] = calculate_bmi(
        float(data.get("weight_kg", 0)),
        float(data.get("height_cm", 0))
    )
    row["Exercise"] = yes_no_map.get(data.get("exercise"), 0)

    X = pd.DataFrame([row])
    prob = heart_model.predict_proba(X)[0][1]

    return jsonify({"risk_percentage": round(prob * 100, 2)})

# ---------- DIABETES ----------
@app.route("/predict/risk/diabetes", methods=["POST"])
def predict_diabetes_risk():
    data = request.json

    features = [
        gender_map.get(data.get("gender"), 0),
        int(data.get("age", 0)),
        calculate_bmi(
            float(data.get("weight_kg", 0)),
            float(data.get("height_cm", 0))
        ),
        yes_no_map.get(data.get("exercise"), 0),
        smoking_map.get(data.get("smoking_history"), 0),
        alcohol_map.get(data.get("alcohol_consumption"), 0),
        float(data.get("hba1c_level", 0)),
        float(data.get("blood_glucose_level", 0)),
    ]

    prob = diabetes_model.predict_proba([features])[0][1]
    return jsonify({"risk_percentage": round(prob * 100, 2)})

# ---------- LUNG CANCER ----------
@app.route("/predict/risk/lung", methods=["POST"])
def predict_lung_cancer_risk():
    data = request.json

    features = [
        gender_map.get(data.get("gender"), 0),
        int(data.get("age", 0)),
        smoking_map.get(data.get("smoking_history"), 0),
        alcohol_map.get(data.get("alcohol_consumption"), 0),
        yes_no_map.get(data.get("yellow_fingers"), 0),
        yes_no_map.get(data.get("anxiety"), 0),
        yes_no_map.get(data.get("chronic_disease"), 0),
        yes_no_map.get(data.get("fatigue"), 0),
        yes_no_map.get(data.get("wheezing"), 0),
        yes_no_map.get(data.get("coughing"), 0),
        yes_no_map.get(data.get("shortness_of_breath"), 0),
        yes_no_map.get(data.get("swallowing_difficulty"), 0),
        yes_no_map.get(data.get("chest_pain"), 0),
        0, 0
    ]

    prob = lung_risk_model.predict_proba([features])[0][1]
    return jsonify({"risk_percentage": round(prob * 100, 2)})

# ===================== RUN APP =====================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
