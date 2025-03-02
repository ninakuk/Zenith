import pandas as pd

# Define response mapping
response_mapping = {
    "Strongly agree": 7,
    "Agree": 6,
    "Somewhat agree": 5,
    "Neither agree nor disagree": 4,
    "Somewhat disagree": 3,
    "Disagree": 2,
    "Strongly disagree": 1
}

# Load the CSV file
file_path = "PostStudy_MAUQ.csv"  # Update this path
df = pd.read_csv(file_path)

# Strip any leading/trailing spaces from column names
df.columns = df.columns.str.strip()

# Drop irrelevant columns
df_responses = df.drop(columns=['RecordedDate', 'Q1'])

# Map textual responses to numeric values
df_responses = df_responses.applymap(lambda x: response_mapping.get(x, None))

# Extract Participant IDs
df_responses.insert(0, "Participant ID", df["Q1"])  # Ensure IDs are retained

# Compute **Per-Participant MAUQ Scores**
df_responses["Per-Participant MAUQ Score"] = df_responses.iloc[:, 1:].mean(axis=1)

# Compute **Overall MAUQ Score**
overall_maquq_score = df_responses["Per-Participant MAUQ Score"].mean()

# Compute **Total Usability Score**
total_score = df_responses.iloc[:, 1:-1].mean().sum()

# Compute **Category Scores**
category_groups = {
    "Ease of Use": df_responses.iloc[:, 1:6].mean(axis=1),
    "Interface & Satisfaction": df_responses.iloc[:, 6:13].mean(axis=1),
    "Usefulness": df_responses.iloc[:, 13:-1].mean(axis=1)
}

# Compute **Overall Category Scores**
category_averages = {cat: scores.mean() for cat, scores in category_groups.items()}

# **Updated: Compare Dark Mode vs. Non-Dark Mode Users**
dark_mode_users = ["58740", "76435", "91852"]  # Corrected dark mode participant IDs
df_dark_mode = df_responses[df_responses["Participant ID"].astype(str).isin(dark_mode_users)]
df_non_dark_mode = df_responses[~df_responses["Participant ID"].astype(str).isin(dark_mode_users)]

dark_mode_avg = df_dark_mode["Per-Participant MAUQ Score"].mean()
non_dark_mode_avg = df_non_dark_mode["Per-Participant MAUQ Score"].mean()

# Output Results
output = []

output.append(f"Overall MAUQ Score: {overall_maquq_score:.2f} / 7")
output.append(f"Total Usability Score: {total_score:.2f}")

output.append("\nCategory-Wise MAUQ Scores:")
for category, avg_score in category_averages.items():
    output.append(f"{category}: {avg_score:.2f} / 7")

output.append("\nPer-Participant MAUQ Scores:")
for _, row in df_responses.iterrows():
    output.append(f"Participant {row['Participant ID']}: {row['Per-Participant MAUQ Score']:.2f}")

output.append("\nDark Mode vs. Non-Dark Mode Usability Comparison:")
output.append(f"Dark Mode Users Avg MAUQ: {dark_mode_avg:.2f} / 7")
output.append(f"Non-Dark Mode Users Avg MAUQ: {non_dark_mode_avg:.2f} / 7")

# Save Results to File
with open("MAUQ_results.txt", "w") as file:
    file.write("\n".join(output))

print("Results written to 'MAUQ_results11.txt'.")
