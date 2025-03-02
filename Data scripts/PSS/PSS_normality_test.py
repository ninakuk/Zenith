import scipy.stats as stats
import pandas as pd
import numpy as np


# Example PSS pre- and post-study scores
pss_pre = [21, 21, 19, 23, 23, 22]  
pss_post = [21, 22, 17, 24, 22, 22] 

# Perform Shapiro-Wilk test
shapiro_pre = stats.shapiro(pss_pre)
shapiro_post = stats.shapiro(pss_post)

# Perform paired t-test
t_stat, p_value = stats.ttest_rel(pss_pre, pss_post)

#wilcoxon
w_stat, wp_value = stats.wilcoxon(pss_pre, pss_post)

# Convert lists to NumPy arrays
pss_pre = np.array(pss_pre)
pss_post = np.array(pss_post)

# Calculate effect size (Cohen’s d)
mean_diff = np.mean(pss_post - pss_pre)  # Mean of differences
pooled_std = np.std(pss_post - pss_pre, ddof=1)  # Standard deviation of differences
cohens_d = mean_diff / pooled_std

print("Shapiro-Wilk Test for PSS Pre-Study Scores:")
print(f"Statistic={shapiro_pre.statistic:.4f}, p-value={shapiro_pre.pvalue:.4f}")

print("\nShapiro-Wilk Test for PSS Post-Study Scores:")
print(f"Statistic={shapiro_post.statistic:.4f}, p-value={shapiro_post.pvalue:.4f}")

# Print results
print(f"Paired t-test result: t-statistic = {t_stat:.4f}, p-value = {p_value:.4f}")
print("Wilcoxon: ", w_stat)
print('p valie: ', wp_value)

print(f"Cohen’s d effect size: {cohens_d:.4f}")

# Interpretation
alpha = 0.05
if shapiro_pre.pvalue > alpha:
    print("\nPre-study PSS scores are normally distributed (p > 0.05)")
else:
    print("\nPre-study PSS scores are NOT normally distributed (p < 0.05)")

if shapiro_post.pvalue > alpha:
    print("\nPost-study PSS scores are normally distributed (p > 0.05)")
else:
    print("\nPost-study PSS scores are NOT normally distributed (p < 0.05)")


alpha = 0.05
if p_value < alpha:
    print("\nThere is a statistically significant difference in PSS scores before and after (p < 0.05).")
else:
    print("\nThere is NO statistically significant difference in PSS scores before and after (p > 0.05).")