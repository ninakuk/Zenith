import pandas as pd

# Load the data
df_participants = pd.read_csv('PostStudy_UES.csv', header=0)

# Step 2: Define the Likert scale mapping (for text-to-score conversion)
text_to_score_map = {
    "Strongly agree": 5,
    "Agree": 4,
    "Neither agree nor disagree": 3,
    "Disagree": 2,
    "Strongly disagree": 1
}

# Step 3: Define the reverse score map (for questions that need inversion)
reverse_score_map = {1: 5, 2: 4, 3: 3, 4: 2, 5: 1}

# Step 4: Specify the questions that require reversal
reverse_questions = ['Q2_4', 'Q2_5', 'Q2_6']

# Step 5: Apply the textual mapping to convert responses to numeric scores
# Map the responses to numeric values using the Likert scale for all columns (except 'Participant ID')
df_participants.iloc[:, 2:] = df_participants.iloc[:, 2:].apply(lambda col: col.map(text_to_score_map))

# Step 6: Apply the reversal to the specified questions using map
for question in reverse_questions:
    df_participants[question] = df_participants[question].map(reverse_score_map)

# Step 7: Calculate the Overall Engagement Score (mean of all responses)
df_participants['Overall Engagement Score'] = df_participants.iloc[:, 2:].mean(axis=1)

# Step 8: Calculate the subscale scores
# Focused Attention: Q2_1, Q2_2, Q2_3
df_participants['Focused Attention'] = df_participants[['Q2_1', 'Q2_2', 'Q2_3']].mean(axis=1)

# Perceived Usability: Q2_4, Q2_5, Q2_6 (after inversion)
df_participants['Perceived Usability'] = df_participants[['Q2_4', 'Q2_5', 'Q2_6']].mean(axis=1)

# Aesthetic Appeal: Q2_7, Q2_8, Q2_9
df_participants['Aesthetic Appeal'] = df_participants[['Q2_7', 'Q2_8', 'Q2_9']].mean(axis=1)

# Reward Factor: Q2_10, Q2_11, Q2_12
df_participants['Reward Factor'] = df_participants[['Q2_10', 'Q2_11', 'Q2_12']].mean(axis=1)

# Step 9: Round all numeric columns to 2 decimal places
df_participants = df_participants.round(2)

# Step 10: Calculate the aggregate Overall Engagement Score for the entire group
overall_group_engagement = df_participants['Overall Engagement Score'].mean().round(2)

std_ues_score = df_participants['Overall Engagement Score'].std().round(2)

# Step 11: Display the individual scores and the overall group engagement score
print(df_participants[['Q1', 'Overall Engagement Score', 'Focused Attention', 'Perceived Usability', 'Aesthetic Appeal', 'Reward Factor']])
print(f"Overall Group Engagement Score: {overall_group_engagement}")
print(f"STD: {std_ues_score}")

# Step 12: Save the results to a new CSV file (optional)
df_participants.to_csv('UES_results.csv', index=False)
