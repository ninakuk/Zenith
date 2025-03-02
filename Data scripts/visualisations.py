import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Load UES and MAUQ results from text files
def load_results(file_path, default_values):
    results = {}
    try:
        with open(file_path, "r") as file:
            lines = file.readlines()
        for line in lines:
            parts = line.strip().split(": ")
            if len(parts) == 2:
                key, value = parts
                try:
                    results[key] = float(value.split(" /")[0])  # Extract numerical values
                except ValueError:
                    pass
    except FileNotFoundError:
        results = default_values  # Use placeholder values if file is missing
    return results

# Default values if files are missing
ues_defaults = {
    "Overall Group Engagement Score": 3.35,
    "Focused Attention": 2.28,
    "Perceived Usability": 4.11,
    "Aesthetic Appeal": 3.56,
    "Reward Factor": 3.44,
    "Dark Mode Users Avg Engagement": 2.81,
    "Non-Dark Mode Users Avg Engagement": 3.89,
}

mauq_defaults = {
    "Overall Average Score": 5.11,
    "Dark Mode Users Avg MAUQ": 4.39,
    "Non-Dark Mode Users Avg MAUQ": 5.83,
}

# Load the data
ues_data = load_results("UES_results.txt", ues_defaults)
mauq_data = load_results("MAUQ_results.txt", mauq_defaults)

# Extract subscale scores for UES
subscales = ["Focused Attention", "Perceived Usability", "Aesthetic Appeal", "Reward Factor"]
subscale_scores = [ues_data.get(subscale, 0) for subscale in subscales]

# . Bar Plot for UES Subscale Scores
plt.figure(figsize=(8, 6))
sns.barplot(x=subscales, y=subscale_scores, palette="coolwarm")
plt.ylim(0, 5)
plt.ylabel("Average Score (out of 5)")
plt.title("User Engagement Scale (UES) Subscale Scores")
plt.xticks(rotation=15)
plt.show()

# Extract dark vs. non-dark mode engagement scores
dark_mode_ues = ues_data.get("Dark Mode Users Avg Engagement", 0)
non_dark_mode_ues = ues_data.get("Non-Dark Mode Users Avg Engagement", 0)

#  Box Plot for UES Dark Mode vs. Non-Dark Mode
plt.figure(figsize=(6, 6))
sns.boxplot(data=[[dark_mode_ues], [non_dark_mode_ues]], palette=["red", "blue"])
plt.xticks([0, 1], ["Dark Mode Users", "Non-Dark Mode Users"])
plt.ylabel("Engagement Score (out of 5)")
plt.title("Engagement Scores: Dark Mode vs. Non-Dark Mode Users")
plt.show()

# Extract dark vs. non-dark mode usability scores from MAUQ
dark_mode_mauq = mauq_data.get("Dark Mode Users Avg MAUQ", 0)
non_dark_mode_mauq = mauq_data.get("Non-Dark Mode Users Avg MAUQ", 0)

#  Bar Plot for MAUQ vs. UES Scores in Dark Mode and Non-Dark Mode Users
labels = ["Dark Mode Users", "Non-Dark Mode Users"]
mauq_scores = [dark_mode_mauq, non_dark_mode_mauq]
ues_scores = [dark_mode_ues, non_dark_mode_ues]

x = range(len(labels))

plt.figure(figsize=(8, 6))
plt.bar(x, mauq_scores, width=0.4, label="MAUQ Score", color="lightblue", align="center")
plt.bar([i + 0.4 for i in x], ues_scores, width=0.4, label="UES Score", color="salmon", align="center")

plt.xticks([i + 0.2 for i in x], labels)
plt.ylim(0, 7)
plt.ylabel("Average Score")
plt.title("MAUQ vs. UES Scores: Dark Mode vs. Non-Dark Mode Users")
plt.legend()
plt.show()
