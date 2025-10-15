# data_preprocess.py
# Step 1: Data loading and preprocessing for POWERGRID material forecasting

import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import os

# ---------- 1. Load dataset ----------
data_path = os.path.join("..", "data", "powergrid_dataset.csv")
df = pd.read_csv(data_path)

print("✅ Raw dataset loaded successfully!\n")
print(df.head())

# ---------- 2. Handle missing values ----------
# Drop rows with missing data (you can also fill them if preferred)
df.dropna(inplace=True)

# ---------- 3. Encode categorical columns ----------
categorical_cols = ['Location', 'TowerType', 'SubstationType', 'Terrain']
encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le
    print(f"Encoded column: {col} -> {list(le.classes_)}")

# ---------- 4. Split features (X) and targets (y) ----------
X = df[['Budget', 'Location', 'TowerType', 'SubstationType', 'Terrain', 'Tax']]
y = df[['Steel', 'Cement', 'Insulators']]

# ---------- 5. Train/Test split ----------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------- 6. Save cleaned dataset ----------
cleaned_path = os.path.join("..", "data", "cleaned_dataset.csv")
df.to_csv(cleaned_path, index=False)
print(f"\n✅ Cleaned dataset saved to {cleaned_path}")

# ---------- 7. Print data info ----------
print("\n🧾 Dataset Summary:")
print(f"Total records: {len(df)}")
print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

print("\n🎯 Columns used for training:")
print(list(X.columns))

print("\n✅ Data preprocessing complete!")