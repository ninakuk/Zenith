import pandas as pd
import matplotlib.pyplot as plt

# Data for pre-study and post-study
data_pre = {
    'Participant': [39205, 76435, 58740, 27560, 47061, 91852],
    'PSS_Score': [21.0, 21.0, 19.0, 23.0, 23.0, 22.0]
}

data_post = {
    'Participant': [39205, 76435, 58740, 27560, 47061, 91852],
    'PSS_Score': [21.0, 22.0, 17.0, 24.0, 22.0, 22.0]
}

# Creating DataFrames
df_pre = pd.DataFrame(data_pre)
df_post = pd.DataFrame(data_post)

# Add a 'Study' column to distinguish between pre-study and post-study
df_pre['Study'] = 'Pre-Study'
df_post['Study'] = 'Post-Study'

# Combine both DataFrames into one
df = pd.concat([df_pre, df_post])

# Plotting
plt.figure(figsize=(8, 6))
plt.boxplot([df_pre['PSS_Score'], df_post['PSS_Score']], 
            labels=['Pre-Study', 'Post-Study'], 
            patch_artist=True, 
            boxprops=dict(facecolor='skyblue', color='blue'),
            flierprops=dict(markerfacecolor='red', marker='o', markersize=8))

# Adding labels and title
plt.ylabel('PSS Score')
plt.title('Box Plot of PSS Scores Pre- and Post-Study')

# Show the plot
plt.tight_layout()
plt.show()
