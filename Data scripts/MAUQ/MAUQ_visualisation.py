import matplotlib.pyplot as plt

# Group definitions:
# Group 1: Ease of Use (Q1_1 to Q1_5)
group1_scores = [6.33, 6.00, 5.83, 5.83, 5.00]

# Group 2: Interface & Satisfaction (Q1_6 to Q1_12)
group2_scores = [5.00, 6.17, 4.83, 5.33, 5.67, 4.17, 5.83]

# Group 3: Usefulness (Q1_13 to Q2_18)
group3_scores = [4.83, 3.33, 4.17, 4.33, 4.83, 4.50]

# Calculate group averages (scores out of 7)
group1_avg = sum(group1_scores) / len(group1_scores)
group2_avg = sum(group2_scores) / len(group2_scores)
group3_avg = sum(group3_scores) / len(group3_scores)
group_averages = [group1_avg, group2_avg, group3_avg]

# Labels for groups
group_labels = ["Ease of Use", "Interface & Satisfaction", "Usefulness"]

# Overall values to display as text
overall_avg_score = 5.11  # Overall Average Score (out of 7)
total_usability = 92.00   # Total Usability Score (out of 126, not used in this plot)

# Create the bar chart
fig, ax = plt.subplots(figsize=(8, 6))
bars = ax.bar(group_labels, group_averages, color=['skyblue', 'lightgreen', 'salmon'])

# Set y-axis to reflect score range (0 to 7)
ax.set_ylim(0, 7)
ax.set_ylabel("Score (out of 7)")
ax.set_title("MAUQ Grouped Results by Category (Scores)")

# Annotate each bar with the group average score
for bar, avg in zip(bars, group_averages):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2, f"{avg:.2f}/7", ha='center', va='bottom')

# Add overall average score as text at the bottom of the figure
overall_text = f"Overall Average Score: {overall_avg_score}/7"
plt.figtext(0.5, 0.01, overall_text, wrap=True, horizontalalignment='center', fontsize=12)

plt.tight_layout(rect=[0, 0.05, 1, 1])
plt.show()
