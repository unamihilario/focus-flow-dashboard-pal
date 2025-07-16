import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os

df = pd.read_csv("ml/ml_focus_dataset_2025-07-15.csv")
os.makedirs("visuals", exist_ok=True)

def focus_distribution():
    sns.countplot(x="focus_classification", data=df,
                  order=["distracted", "semi-focused", "attentive"])
    plt.title("Focus Classification Distribution")
    plt.savefig("visuals/focus_distribution.png")
    plt.clf()

def productivity_vs_scroll():
    sns.scatterplot(x="scroll_events_total", y="productivity_score",
                    hue="focus_classification", data=df)
    plt.title("Productivity vs Scroll Events")
    plt.savefig("visuals/productivity_vs_scroll.png")
    plt.clf()

def focus_by_subject():
    sns.countplot(x="subject", hue="focus_classification", data=df)
    plt.xticks(rotation=45)
    plt.title("Focus by Subject")
    plt.savefig("visuals/focus_by_subject.png")
    plt.clf()

def heatmap_correlations():
    corr = df.select_dtypes("number").corr()
    sns.heatmap(corr, annot=True, cmap="coolwarm")
    plt.title("Feature Correlation Heatmap")
    plt.savefig("visuals/heatmap_correlations.png")
    plt.clf()

focus_distribution()
productivity_vs_scroll()
focus_by_subject()
heatmap_correlations()
print("✅ Dataset visualizations saved to /visuals/")
