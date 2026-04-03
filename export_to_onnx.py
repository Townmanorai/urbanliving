# Run this ONCE to convert bestmodel.pth → bestmodel.onnx
# python export_to_onnx.py
# Then copy bestmodel.onnx into: urbanliving/public/bestmodel.onnx

import torch
import torch.nn as nn
import torchvision.models as models
import os

CLASSES = [
    'bathroom', 'bedroom', 'dining', 'gaming', 'kitchen',
    'laundry', 'living', 'office', 'terrace', 'yard'
]

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

print("Loading model...")
base = models.mobilenet_v3_small(weights=None)
model = RoomClassifier(num_classes=len(CLASSES), feature_extractor=base.features)
state_dict = torch.load("bestmodel.pth", map_location="cpu")
model.load_state_dict(state_dict)
model.eval()

print("Exporting to ONNX...")
dummy = torch.randn(1, 3, 224, 224)
out_path = os.path.join(os.path.dirname(__file__), "bestmodel.onnx")

torch.onnx.export(
    model,
    dummy,
    out_path,
    input_names=["input"],
    output_names=["output"],
    opset_version=11,
    dynamic_axes={"input": {0: "batch"}, "output": {0: "batch"}},
)

print(f"Done! Saved to: {out_path}")
print(f"Now copy bestmodel.onnx → urbanliving/public/bestmodel.onnx")
