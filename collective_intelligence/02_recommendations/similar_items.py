#!/usr/bin/python
# This is indicating to the shell what program is used to interpret the script.
"""
Finding similar items based on how people rated them
"""

# loading the ranking
from ratings_dic import critics

# loading the similarity score algorithms
from similarity_score_euclidean import sim_distance
from similarity_score_pearson import sim_pearson

# We're going to use the same algorithm that matches similar users
from similar_users import topMatches

# Let's switch the dictionary from { person: { item: } }
# to { item: { person: } }
def transformPrefs(prefs):
	# Create an empty object to hold the {item:{person:}}
	result = {}

	# Loop through all people
	for person in prefs:
		# Loop through all preferences
		for item in prefs[person]:
			# If the item is not on the list yet,
			# create empty object
			result.setdefault(item, {})

			# Flip item and person
			result[item][person] = prefs[person][item]

	return result

# Comment out these lines to call the function
# with different parameters
movies = transformPrefs(critics)
similarItems = topMatches(movies,'Superman Returns')
print ">>> Items similar to 'Superman Returns' are:"
print similarItems