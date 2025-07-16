import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

df = pd.read_csv("ml/ml_focus_dataset_2025-07-15.csv")
df["subject_encoded"] = LabelEncoder().fit_transform(df["subject"])

features = [
    "duration_minutes", "tab_switches", "keystroke_rate_per_minute",
    "mouse_movements_total", "inactivity_periods_count",
    "scroll_events_total", "subject_encoded"
]
X = df[features]
y = df["productivity_score"]
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)

models = {
    "Linear Regression": LinearRegression(),
    "Decision Tree": DecisionTreeRegressor(),
    "Random Forest": RandomForestRegressor()
}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(f"\n🔍 {name}")
    print("MAE:", round(mean_absolute_error(y_test, y_pred), 2))
    print("MSE:", round(mean_squared_error(y_test, y_pred), 2))
    print("R²:", round(r2_score(y_test, y_pred), 3))
