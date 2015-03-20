"""
Recommending items based on
		Pearson correlation (similarity_score_pearson.py).
From the book Programming Collective Intelligence

"""

# loading the ranking
from ratings_dic import critics

# loading the similarity score algorithms
from similarity_score_euclidean import sim_distance
from similarity_score_pearson import sim_pearson

# Gets recommendations for a PERSON by using a weighted average:
# the rating OTHERS gave to SOMETHING
# times HOW SIMILAR the OTHER is to the PERSON.

# In the end, sums up all the weighted averages
# and divide it by the sum of all similarities, to normalize the data.

# I wonder how we could adapt this approach to the Met,
# since there are no ratings...

# Defining the function.
def getRecommendations(prefs, person, similarity = sim_pearson):
	
	# These are dictionaries (python for "associative array")
	totals = {}
	simSums = {}

	# Loop through the list of people
	for other in prefs:

		# Skip the PERSON him/herself
		if other == person: continue

		# Call the similarity function
		# No correlation score is passed, so default to Pearson
		sim = similarity(prefs, person, other)

		# Ignore scores of zero or lower
		if sim <= 0: continue

		# Loop through the items rated by the OTHER person
		for item in prefs[other]:

			# Look for items the PERSON hasn't selected/bought/watched/etc
			if item not in prefs[person] or prefs[person][item] == 0:

				# If item is not in the "totals" dictionary already,
				# insert it with value = 0
				totals.setdefault(item, 0)

				# Add similarity * score
				totals[item] += prefs[other][item] * sim

				# Sum of similarities
				simSums.setdefault(item, 0)
				simSums[item] += sim

		# Create the normalized list (a 2D array)
		# format: [(sum, item), ...]
		rankings = [(total/simSums[item], item)
					for item, total in totals.items()]

	# Return the sorted list
	rankings.sort()
	rankings.reverse()
	return rankings

# Comment out these lines to call the function
# with different parameters
recommendations = getRecommendations(critics, 'Toby')
print "Recommendations for Toby are:"
print recommendations