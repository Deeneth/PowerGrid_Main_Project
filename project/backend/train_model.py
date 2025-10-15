# train_model.py
# Step 2: Train a material forecasting model for POWERGRID projects

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

# ---------- 1. Load cleaned dataset ----------
data_path = os.path.join("..", "data", "cleaned_dataset.csv")
df = pd.read_csv(data_path)
print("✅ Cleaned dataset loaded successfully!\n")

# ---------- 2. Define features (X) and targets (y) ----------
X = df[['Budget', 'Location', 'TowerType', 'SubstationType', 'Terrain', 'Tax']]
y = df[['Steel', 'Cement', 'Insulators']]

# ---------- 3. Split into training/testing sets ----------
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ---------- 4. Train model ----------
print("🚀 Training RandomForest model...")
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# ---------- 5. Evaluate model ----------
preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)

print(f"\n📊 Model Evaluation Results:")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"R² Score: {r2:.2f}")

# ---------- 6. Save trained model ----------
model_path = os.path.join("..", "model", "trained_model.pkl")
os.makedirs(os.path.dirname(model_path), exist_ok=True)

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print(f"\n✅ Model saved successfully at {model_path}")

# ---------- 7. Test sample prediction ----------
sample = X_test.iloc[0:1]
sample_pred = model.predict(sample)
print("\n🔍 Sample input:")
print(sample)
print("\n🔮 Predicted output (Steel, Cement, Insulators):")
print(sample_pred)