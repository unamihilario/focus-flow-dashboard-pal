import pandas as pd
import random
from datetime import datetime, timedelta

# Focus distribution based on real study: Distracted 40%, Semi-Attentive 38%, Attentive 22%
focus_distribution = {
    "distracted": 120,
    "semi-attentive": 114,
    "attentive": 66
}

# Feature ranges based on behavioral patterns
feature_ranges = {
    "distracted": {
        "duration": (1, 4),
        "tab_switches": (8, 15),
        "keystrokes": (30, 80),
        "mouse_moves": (50, 120),
        "inactivity": (4, 8),
        "scrolls": (5, 40),
        "productivity": (20, 40)
    },
    "semi-attentive": {
        "duration": (4, 8),
        "tab_switches": (3, 7),
        "keystrokes": (100, 180),
        "mouse_moves": (100, 180),
        "inactivity": (1, 4),
        "scrolls": (50, 100),
        "productivity": (45, 65)
    },
    "attentive": {
        "duration": (8, 12),
        "tab_switches": (0, 2),
        "keystrokes": (200, 320),
        "mouse_moves": (180, 250),
        "inactivity": (0, 1),
        "scrolls": (100, 180),
        "productivity": (70, 95)
    }
}

def generate_session(focus, index):
    ranges = feature_ranges[focus]
    timestamp = datetime(2025, 7, 16, 8, 0) + timedelta(minutes=index * 5)
    return {
        "session_id": f"session_17526{index:05d}",
        "timestamp": timestamp.isoformat() + "Z",
        "subject": "ai-ml-course",
        "duration_minutes": random.randint(*ranges["duration"]),
        "tab_switches": random.randint(*ranges["tab_switches"]),
        "keystroke_rate_per_minute": random.randint(*ranges["keystrokes"]),
        "mouse_movements_total": random.randint(*ranges["mouse_moves"]),
        "inactivity_periods_count": random.randint(*ranges["inactivity"]),
        "scroll_events_total": random.randint(*ranges["scrolls"]),
        "focus_classification": focus,
        "productivity_score": random.randint(*ranges["productivity"])
    }

# Generate all sessions
sessions = []
counter = 0
for focus, count in focus_distribution.items():
    for _ in range(count):
        sessions.append(generate_session(focus, counter))
        counter += 1

# Create DataFrame and save
df = pd.DataFrame(sessions)
df.to_csv("ml_focus_dataset_realistic.csv", index=False)
print("✅ Dataset saved as 'ml_focus_dataset_realistic.csv' with 300 human-like sessions.")
