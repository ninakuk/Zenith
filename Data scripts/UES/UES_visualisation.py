import matplotlib.pyplot as plt
import numpy as np

# Data for UES subscales from the CSV results
focused_attention = [3.33, 1.00, 1.67, 2.00, 3.00, 2.67]
perceived_usability = [5.00, 2.67, 5.00, 4.33, 3.00, 4.67]
aesthetic_appeal = [5.00, 2.67, 4.00, 3.67, 2.00, 4.00]
reward_factor = [4.00, 2.33, 3.33, 3.67, 3.00, 4.33]

# Combine the subscale scores into one list
data = [focused_attention, perceived_usability, aesthetic_appeal, reward_factor]

# Labels for the box plot
labels = ['Focused Attention', 'Perceived Usability', 'Aesthetic Appeal', 'Reward Factor']

# Create the box plot
plt.figure(figsize=(8, 6))
plt.boxplot(data, labels=labels, patch_artist=True,
            boxprops=dict(facecolor='lightblue'),
            medianprops=dict(color='red'))
plt.title("Distribution of UES Subscale Scores")
plt.ylabel("Score (1-7 scale)")
plt.xticks(rotation=45)
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()
