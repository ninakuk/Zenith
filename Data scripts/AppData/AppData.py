import pandas as pd
import glob
import os
from tabulate import tabulate
import matplotlib.pyplot as plt
import numpy as np

# Define the folder path containing your CSV files
folder_path = "./"  # Update this path as needed
file_pattern = os.path.join(folder_path, "Studydata_*.csv")

# Use glob to get a list of all matching CSV files
file_list = glob.glob(file_pattern)

# Initialize an empty list to hold DataFrames
df_list = []

# Loop through each file in the list
for file in file_list:
    # Extract the participant ID from the filename.
    filename = os.path.basename(file)
    participant_id = filename.split("_")[1].split(".")[0]
    
    # Read the CSV file into a DataFrame
    df = pd.read_csv(file)
    
    # Assign participant ID to the 'ID' column
    df['ID'] = participant_id
    
    # Append this DataFrame to the list
    df_list.append(df)

# Concatenate all DataFrames into one master DataFrame
combined_df = pd.concat(df_list, ignore_index=True)

# Convert 'time stamp' to datetime
combined_df["time stamp"] = pd.to_datetime(combined_df["time stamp"], errors='coerce')

# Extract the hour of the day (0-23)
combined_df["Hour"] = combined_df["time stamp"].dt.hour

# -------- HISTOGRAM: Distribution of Journal Entries by Hour -------- #
plt.figure(figsize=(10, 6))
counts, bins, bars = plt.hist(combined_df["Hour"].dropna(), bins=24, range=(0, 24), edgecolor="black", alpha=0.75, label="Entries")

# Add dots for individual entries
y_values = np.random.uniform(0, counts.max() * 0.05, len(combined_df["Hour"].dropna()))  # Spread dots slightly
plt.scatter(combined_df["Hour"], y_values, color='red', alpha=0.6, label="Individual Entries")

# Formatting
plt.xticks(range(0, 24, 1))
plt.xlabel("Hour of the Day")
plt.ylabel("Number of Journal Entries")
plt.title("Distribution of Journal Entries by Time of Day")
plt.legend()
plt.grid(axis="y", linestyle="--", alpha=0.7)
plt.show()

# -------- CALCULATE PER-PARTICIPANT STATISTICS -------- #
numeric_cols = ["Sentiment Score", "Emotion slider score", "Avatar Customisation Count", "Avatar Interaction Counter"]
for col in numeric_cols:
    if col in combined_df.columns:
        combined_df[col] = pd.to_numeric(combined_df[col], errors='coerce')

# Aggregate statistics per participant
participant_stats = combined_df.groupby("ID").agg(
    Total_Entries=("ID", "count"),
    Avg_Sentiment_Score=("Sentiment Score", "mean"),
    Avg_Emotion_Score=("Emotion slider score", "mean"),
    Total_Avatar_Interactions=("Avatar Interaction Counter", "sum"),
    Total_Avatar_Customizations=("Avatar Customisation Count", "sum"),
).reset_index()

# Display per-participant stats
print("\nPer-Participant Statistics:")
print(tabulate(participant_stats, headers='keys', tablefmt='psql'))

# Save to CSV
participant_stats.to_csv("per_participant_stats.csv", index=False)
print("\nPer-participant statistics saved to 'per_participant_stats.csv'.")

# -------- SCATTER PLOT: Journal Entries vs. Avatar Interactions -------- #

# Manually created dataset
participants = ["P1", "P2", "P3", "P4", "P5", "P6"]
journal_entries = np.array([5, 6, 3, 2, 8, 3])  # Number of journal entries per participant
avatar_interactions = np.array([4, 80, 10, 18, 16, 9])  # Combined Avatar Interaction + Customization Score

# Create scatter plot
plt.figure(figsize=(8, 6))
plt.scatter(journal_entries, avatar_interactions, color="blue", alpha=0.7, label="Participants")

# Annotate each point dynamically to avoid overlaps
for i, participant in enumerate(participants):
    if participant == "P3":
        plt.text(journal_entries[i] - 0.2, avatar_interactions[i], participant, fontsize=10, ha="right", va="bottom")
    elif participant == "P6":
        plt.text(journal_entries[i] + 0.2, avatar_interactions[i], participant, fontsize=10, ha="left", va="bottom")
    else:
        plt.text(journal_entries[i], avatar_interactions[i], participant, fontsize=10, ha="right", va="bottom")

# Calculate linear regression line
m, b = np.polyfit(journal_entries, avatar_interactions, 1)  # y = mx + b
x_line = np.linspace(min(journal_entries), max(journal_entries), 100)
y_line = m * x_line + b

# Plot regression line
plt.plot(x_line, y_line, color="red", linestyle="--", linewidth=2, label="Trend Line")

# Plot settings
plt.xlabel("Total Journal Entries (Engagement)")
plt.ylabel("Total Avatar Interactions (Customization + Interaction)")
plt.title("Relationship Between Journal Entries and Avatar Interactions")
plt.legend()
plt.grid(True, linestyle="--", alpha=0.6)

# Show the plot
plt.show()
