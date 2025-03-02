import pandas as pd

#*load the CSV file
file_path = "PostStudyPSS.csv" 
df = pd.read_csv(file_path)

#*mapping for reversing the scores*
#Officiall document directions:
# First, reverse your scores for questions 4, 5, 7, and 8. On these 4 questions, change the scores like this:
# 0 = 4, 1 = 3, 2 = 2, 3 = 1, 4 = 0

reverse_score_map = {0: 4, 1: 3, 2: 2, 3: 1, 4: 0}

#*specify the column names for each question
question_columns = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10']

#*questions that require score reversal
reverse_questions = ['Q4', 'Q5', 'Q7', 'Q8']

#*replace textual answers with numerical scores
text_to_score_map = {
    "Never": 0,
    "Almost never": 1,
    "Sometimes": 2,
    "Fairly often": 3,
    "Very often": 4
}

#*apply the textual mapping
for col in question_columns:
    df[col] = df[col].map(text_to_score_map)

#*reverse scores for specified questions
for question in reverse_questions:
    df[question] = df[question].map(reverse_score_map)

#*calculate the total score
df['PSS_Score'] = df[question_columns].sum(axis=1)

#*categorize stress levels
def categorize_stress(score):
    if score <= 13:
        return "Low stress"
    elif 14 <= score <= 26:
        return "Moderate stress"
    else:
        return "High stress"

df['Stress_Level'] = df['PSS_Score'].apply(categorize_stress)

output_df = df[['RecordedDate', 'Q0', 'PSS_Score', 'Stress_Level']]


#*save the cleaned data with scores to a new CSV file
output_file = "PostStudy_cleaned_pss_results.csv"
output_df.to_csv(output_file, index=False)

print(f"Processed data saved to {output_file}")
