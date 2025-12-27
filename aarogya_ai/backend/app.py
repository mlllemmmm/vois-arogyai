from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

# =======================
# App setup
# =======================
app = Flask(__name__)
CORS(app)  # ✅ THIS WAS MISSING — VERY IMPORTANT

# =======================
# Load models
# =======================
lung_model = tf.keras.models.load_model("model/best_lung_model.h5")
bones_model = tf.keras.models.load_model("model/best_custom_cnn.h5")
kidney_model = tf.keras.models.load_model("model/kidney_model.keras")

# =======================
# Common preprocessing
# =======================
def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# =======================
# LUNGS (Pneumonia)
# =======================
@app.route("/predict/lung", methods=["POST"])
def predict_lung():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(request.files["file"]).convert("RGB")
    img = preprocess_image(image)

    prediction = lung_model.predict(img)[0][0]  # probability of pneumonia

    label = "Pneumonia Detected" if prediction >= 0.5 else "No Pneumonia Detected"

    return jsonify({
    "confidence": float(prediction),
    "label": label
})
# =======================
# BONES (Fracture)
# =======================
@app.route("/predict/bones", methods=["POST"])
def predict_bones():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(request.files["file"]).convert("RGB")
    img = preprocess_image(image)

    prediction = bones_model.predict(img)
    confidence = float(np.max(prediction))

    return jsonify({"confidence": confidence})

# =======================
# KIDNEY (Stone)
# =======================
@app.route("/predict/kidney", methods=["POST"])
def predict_kidney():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(request.files["file"]).convert("RGB")
    img = preprocess_image(image)

    prediction = kidney_model.predict(img)
    confidence = float(np.max(prediction))

    return jsonify({"confidence": confidence})

# =======================
# Run app
# =======================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
