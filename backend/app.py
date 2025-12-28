from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ===================== Load models =====================
heart_model = load(os.path.join(BASE_DIR, "models", "heart_model.pkl"))
diabetes_model = load(os.path.join(BASE_DIR, "models", "diabetes_model.pkl"))
lung_model = load(os.path.join(BASE_DIR, "models", "lung_model.pkl"))

print("Heart model features:", heart_model.feature_names_in_)
print("Diabetes model expects:", diabetes_model.n_features_in_)
print("lungs model expects:", lung_model.n_features_in_)


# ===================== Mappings =====================
gender_map = {"Male": 0, "Female": 1}
yes_no_map = {"Yes": 1, "No": 0}
smoking_map = {"Never": 0, "Former": 1, "Current": 2}
alcohol_map = {"Never": 0, "Occasionally": 1, "Frequently": 2}
health_map = {"Poor": 0, "Fair": 1, "Good": 2, "Very Good": 3, "Excellent": 4}

# ===================== Helper =====================
def calculate_bmi(weight_kg, height_cm):
    if weight_kg and height_cm:
        return round(weight_kg / ((height_cm / 100) ** 2), 2)
    return 0

def safe_float(value, default=0.0):
    try:
        if value in ["", None]:
            return default
        return float(value)
    except:
        return default


# ===================== Routes =====================
@app.route("/")
def home():
    return "Backend is running successfully 🚀"

# =====================================================
# ✅ HEART PREDICTION (FIXED & SAFE)
# =====================================================
@app.route("/predict/heart", methods=["POST"])
def predict_heart():
    data = request.json
    row = {}

    for feature in heart_model.feature_names_in_:

        if feature == "General_Health":
            row[feature] = health_map.get(data.get("general_health"), 2)

        elif feature == "Checkup":
            row[feature] = 1  # assume yearly checkup (safe default)

        elif feature == "Exercise":
            row[feature] = yes_no_map.get(data.get("exercise"), 0)

        elif feature in ["Skin_Cancer", "Other_Cancer",
                         "Depression", "Arthritis"]:
            row[feature] = 0  # not asked → assume No

        elif feature == "Diabetes":
            row[feature] = yes_no_map.get(data.get("diabetes"), 0)

        elif feature == "Sex":
            row[feature] = gender_map.get(data.get("gender"), 0)

        elif feature == "Age_Category":
            age = int(data.get("age", 0))
            row[feature] = min(age // 10, 9)  # convert age → category

        elif feature == "Height_(cm)":
            row[feature] = float(data.get("height_cm", 0))

        elif feature == "Weight_(kg)":
            row[feature] = float(data.get("weight_kg", 0))

        elif feature == "BMI":
            h = float(data.get("height_cm", 0))
            w = float(data.get("weight_kg", 0))
            row[feature] = float(data.get("bmi") or calculate_bmi(w, h))

        elif feature == "Smoking_History":
            row[feature] = smoking_map.get(data.get("smoking_history"), 0)

        elif feature == "Alcohol_Consumption":
            row[feature] = alcohol_map.get(data.get("alcohol_consumption"), 0)

        elif feature == "Fruit_Consumption":
            row[feature] = int(data.get("fruit_consumption", 0))

        elif feature == "Green_Vegetables_Consumption":
            row[feature] = int(data.get("green_veg_consumption", 0))

        elif feature == "FriedPotato_Consumption":
            row[feature] = 0  # not asked

        else:
            row[feature] = 0

    X = pd.DataFrame([row])

    prob = heart_model.predict_proba(X)[0][1]   # probability of disease
    risk_percent = round(prob * 100, 2)

    return jsonify({
        "risk_percentage": risk_percent
    })


# =====================================================
# Diabetes Prediction (UNCHANGED)
# =====================================================
@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes():
    data = request.json

    gender = gender_map.get(data.get("gender"), 0)
    age = int(data.get("age", 0))

    height = safe_float(data.get("height_cm"))
    weight = safe_float(data.get("weight_kg"))
    bmi = safe_float(data.get("bmi")) or calculate_bmi(weight, height)

    exercise = yes_no_map.get(data.get("exercise"), 0)
    smoking = smoking_map.get(data.get("smoking_history"), 0)
    alcohol = alcohol_map.get(data.get("alcohol_consumption"), 0)

    hba1c = safe_float(data.get("hba1c_level"))
    glucose = safe_float(data.get("blood_glucose_level"))

    features = [
        gender,
        age,
        bmi,
        exercise,
        smoking,
        alcohol,
        hba1c,
        glucose
    ]

    prob = diabetes_model.predict_proba([features])[0][1]
    risk_percent = round(prob * 100, 2)

    return jsonify({
        "risk_percentage": risk_percent
    })



# =====================================================
# Lung Cancer Prediction (UNCHANGED)
# =====================================================
@app.route("/predict/lung", methods=["POST"])
def predict_lung():
    data = request.json

    gender = gender_map.get(data.get("gender"), 0)
    age = int(data.get("age", 0))

    smoking_history = smoking_map.get(data.get("smoking_history"), 0)
    alcohol_consumption = alcohol_map.get(data.get("alcohol_consumption"), 0)

    yellow_fingers = yes_no_map.get(data.get("yellow_fingers"), 0)
    anxiety = yes_no_map.get(data.get("anxiety"), 0)
    chronic_disease = yes_no_map.get(data.get("chronic_disease"), 0)
    fatigue = yes_no_map.get(data.get("fatigue"), 0)
    wheezing = yes_no_map.get(data.get("wheezing"), 0)
    coughing = yes_no_map.get(data.get("coughing"), 0)
    shortness_of_breath = yes_no_map.get(data.get("shortness_of_breath"), 0)
    swallowing_difficulty = yes_no_map.get(data.get("swallowing_difficulty"), 0)
    chest_pain = yes_no_map.get(data.get("chest_pain"), 0)

    features = [
        gender,
        age,
        smoking_history,
        alcohol_consumption,
        yellow_fingers,
        anxiety,
        chronic_disease,
        fatigue,
        wheezing,
        coughing,
        shortness_of_breath,
        swallowing_difficulty,
        chest_pain,
        0,  # padding (model expects 15)
        0   # padding (model expects 15)
    ]
    prob = lung_model.predict_proba([features])[0][1]
    risk_percent = round(prob * 100, 2)

    return jsonify({
        "risk_percentage": risk_percent
    })




# ===================== Main =====================
if __name__ == "__main__":
    app.run(debug=False)
