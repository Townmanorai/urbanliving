# Room Image Classification API Server
# Run: python classify_server.py
# Requires: pip install flask flask-cors torch torchvision pillow requests

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
from torchvision import transforms
from PIL import Image
import requests as req
from io import BytesIO
import os

app = Flask(__name__)
CORS(app)  # Allow React dev server (localhost:5173) to call this API

# ── CLASS LABELS (must match training order) ─────────────────────────────────
CLASSES = [
    'bathroom', 'bedroom', 'dining', 'gaming', 'kitchen',
    'laundry', 'living', 'office', 'terrace', 'yard'
]

# ── MODEL DEFINITION (exact same architecture as training) ────────────────────
class RoomClassifier(nn.Module):
    def __init__(self, num_classes, feature_extractor):
        super().__init__()
        self.features = feature_extractor
        self.extra_convs = nn.Sequential(
            nn.Conv2d(576, 512, kernel_size=3), nn.ELU(),
            nn.Conv2d(512, 256, kernel_size=3), nn.ELU(),
            nn.Conv2d(256, 128, kernel_size=3), nn.ELU(),
        )
        self.pool = nn.AdaptiveAvgPool2d(1)
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128, 1024), nn.ELU(),
            nn.Linear(1024, 512), nn.ELU(),
            nn.Linear(512, 256),  nn.ELU(),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = self.extra_convs(x)
        x = self.pool(x)
        x = self.classifier(x)
        return x

# ── LOAD MODEL ────────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "bestmodel.pth")

def load_model():
    base = models.mobilenet_v3_small(weights=None)
    feature_extractor = base.features
    model = RoomClassifier(num_classes=len(CLASSES), feature_extractor=feature_extractor)
    state_dict = torch.load(MODEL_PATH, map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()
    return model

print("Loading model...")
model = load_model()
print("Model loaded successfully.")

# ── IMAGE TRANSFORM (must match training) ─────────────────────────────────────
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# ── CLASSIFY ENDPOINT ─────────────────────────────────────────────────────────
@app.route('/classify', methods=['POST'])
def classify():
    data = request.json or {}
    url = data.get('imageUrl', '').strip()

    if not url:
        return jsonify({'error': 'imageUrl is required'}), 400

    try:
        response = req.get(url, timeout=15, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        img = Image.open(BytesIO(response.content)).convert('RGB')
    except Exception as e:
        return jsonify({'error': f'Could not fetch image: {str(e)}'}), 400

    try:
        tensor = transform(img).unsqueeze(0)
        with torch.no_grad():
            output = model(tensor)
            probs = F.softmax(output, dim=1)

        conf, pred = torch.max(probs, 1)
        top3_prob, top3_idx = torch.topk(probs, 3)

        top3 = [
            {
                'label': CLASSES[top3_idx[0][i].item()],
                'confidence': round(top3_prob[0][i].item(), 4)
            }
            for i in range(3)
        ]

        return jsonify({
            'label': CLASSES[pred.item()],
            'confidence': round(conf.item(), 4),
            'top3': top3
        })
    except Exception as e:
        return jsonify({'error': f'Classification failed: {str(e)}'}), 500

# ── HEALTH CHECK ──────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'classes': CLASSES})

if __name__ == '__main__':
    print("Starting classification server on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
