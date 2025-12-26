from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)

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

    prediction = lung_model.predict(img)
    confidence = float(np.max(prediction))

    return jsonify({"confidence": confidence})

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
    app.run(debug=True)
