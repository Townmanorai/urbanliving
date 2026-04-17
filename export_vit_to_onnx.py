# Export berksaltuk/room-classifier (ViT) → bestmodel.onnx
# Run once:  python export_vit_to_onnx.py
# Then copy bestmodel.onnx → urbanliving/public/bestmodel.onnx

import torch
import torch.nn as nn
import json
import os

try:
    from transformers import ViTForImageClassification, ViTImageProcessor
except ImportError:
    print("Install: pip install transformers torch")
    exit(1)

MODEL_ID = "berksaltuk/room-classifier"
OUT_ONNX  = os.path.join(os.path.dirname(__file__), "bestmodel.onnx")
OUT_META  = os.path.join(os.path.dirname(__file__), "public", "model_meta.json")

print(f"Loading model from HuggingFace: {MODEL_ID} ...")

# Load model and processor
try:
    processor = ViTImageProcessor.from_pretrained(MODEL_ID)
except Exception:
    print("  processor not found on Hub, falling back to google/vit-base-patch16-224 processor")
    processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")

model = ViTForImageClassification.from_pretrained(MODEL_ID)
model.eval()

# ── Print class labels ─────────────────────────────────────────────────────────
id2label = model.config.id2label
num_classes = len(id2label)
classes = [id2label[i] for i in range(num_classes)]
print(f"\nModel has {num_classes} classes:")
for i, c in enumerate(classes):
    print(f"  [{i}] {c}")

# ── Get normalization params from processor ────────────────────────────────────
image_mean = getattr(processor, 'image_mean', [0.5, 0.5, 0.5])
image_std  = getattr(processor, 'image_std',  [0.5, 0.5, 0.5])
print(f"\nPreprocessing: mean={image_mean}, std={image_std}")

# ── Wrap model so ONNX export gives a plain tensor output ─────────────────────
class ViTWrapper(nn.Module):
    def __init__(self, vit):
        super().__init__()
        self.vit = vit
    def forward(self, pixel_values):
        return self.vit(pixel_values=pixel_values).logits

wrapper = ViTWrapper(model)
wrapper.eval()

# ── Export to ONNX ─────────────────────────────────────────────────────────────
print(f"\nExporting to ONNX (opset 14)...")
dummy = torch.randn(1, 3, 224, 224)

torch.onnx.export(
    wrapper,
    dummy,
    OUT_ONNX,
    input_names  = ["pixel_values"],
    output_names = ["logits"],
    opset_version = 14,
    dynamic_axes  = {"pixel_values": {0: "batch"}, "logits": {0: "batch"}},
    do_constant_folding = True,
)
print(f"Saved: {OUT_ONNX}")

# ── Save model_meta.json → public/ (frontend reads this at runtime) ─────────
meta = {
    "classes":    classes,
    "image_mean": image_mean,
    "image_std":  image_std,
    "input_key":  "pixel_values",
    "output_key": "logits",
}
os.makedirs(os.path.dirname(OUT_META), exist_ok=True)
with open(OUT_META, "w") as f:
    json.dump(meta, f, indent=2)
print(f"Saved: {OUT_META}")

print("\n✓ Done! Next steps:")
print("  1. Copy bestmodel.onnx  →  urbanliving/public/bestmodel.onnx")
print("  2. model_meta.json is already written to public/ — no copy needed")
print("  3. Restart the dev server — the classifier will auto-load the new model")
