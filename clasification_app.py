import streamlit as st
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
from torchvision import transforms
from PIL import Image

# -----------------------------
# CLASS LABELS
# -----------------------------
classes = [
    'bathroom','bedroom','dining','gaming','kitchen',
    'laundry','living','office','terrace','yard'
]

# -----------------------------
# MODEL DEFINITION (YOUR EXACT MODEL)
# -----------------------------
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

# -----------------------------
# LOAD MODEL
# -----------------------------
@st.cache_resource
def load_model():
    base = models.mobilenet_v3_small(weights=None)  # IMPORTANT
    feature_extractor = base.features

    model = RoomClassifier(
        num_classes=len(classes),
        feature_extractor=feature_extractor
    )

    state_dict = torch.load("bestmodel.pth", map_location="cpu")
    model.load_state_dict(state_dict)

    model.eval()
    return model

model = load_model()

# -----------------------------
# TRANSFORMS (MATCH TRAINING)
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # adjust if needed
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# -----------------------------
# PREDICTION FUNCTION
# -----------------------------
def predict(image):
    img = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(img)
        probs = F.softmax(output, dim=1)

    conf, pred = torch.max(probs, 1)

    return classes[pred.item()], conf.item(), probs

# -----------------------------
# UI
# -----------------------------
st.title("🏠 Room Classification Demo")
st.write("Upload one or multiple images")

uploaded_files = st.file_uploader(
    "Choose images",
    type=["jpg", "png", "jpeg"],
    accept_multiple_files=True
)

# -----------------------------
# DISPLAY RESULTS
# -----------------------------
if uploaded_files:
    for file in uploaded_files:
        image = Image.open(file).convert("RGB")

        label, confidence, probs = predict(image)

        st.image(image, caption="Uploaded Image", use_column_width=True)

        st.write(f"### Prediction: {label}")
        st.write(f"Confidence: {confidence:.2f}")

        # Top-3 predictions
        top3_prob, top3_idx = torch.topk(probs, 3)

        st.write("Top 3 Predictions:")
        for i in range(3):
            st.write(
                f"{classes[top3_idx[0][i]]}: {top3_prob[0][i].item():.2f}"
            )

        st.markdown("---")