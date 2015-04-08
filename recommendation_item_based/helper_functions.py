#!/usr/bin/python
# This is indicating to the shell what program is used to interpret the script.

# loading the math function sqrt
from math import sqrt
import copy

# ------------------------------------------------------------------

# PEARSON SCORE FOR SIMILARITY

def sim_pearson(prefs, person1, person2):
	# I'll be passing the whole list of objects into prefs

	print 'Called sim_pearson (Pearson Correlation score)'

	# Get the list of shared items
	si = {}
	for item in prefs[person1]:
		if item in prefs[person2]:
			si[item] = 1
			# 1 doesn't really mean anything special here
			# We're just checking if these people have anything in common or not

	# Find the number of elements
	n = len(si)

	# if they have no ratings in common, return 0
	if n == 0: return 0

	# Add up all the preferences (in common)
	sum1 = sum( [ prefs[person1][item] for item in si ] )
	sum2 = sum( [ prefs[person2][item] for item in si ] )

	# Sum up the squares (of preferences in common)
	sum1Sq = sum( [ pow(prefs[person1][item], 2) for item in si ] )
	sum2Sq = sum( [ pow(prefs[person2][item], 2) for item in si ] )

	# Sum up the products
	pSum = sum( [ prefs[person1][item]*prefs[person2][item] for item in si ] )

	# Calculate Pearson score
	num = pSum - (sum1*sum2/n)
	den=sqrt((sum1Sq-pow(sum1,2)/n)*(sum2Sq-pow(sum2,2)/n))
	if den == 0: return 0

	r = num/den
	print person1 + ' x ' + person2 + ': ' + str(r)
	# will return a number between -1 and 1
	return r

# ------------------------------------------------------------------

# EUCLIDEAN DISTANCE SCORE FOR SIMILARITY

def sim_distance(prefs, person1, person2):
	print('****************************************************')
	# I'll be passing the whole list of objects into prefs
	# print 'Called sim_distance (Euclidean Geometry Distance score)'

	# Get the list of shared items
	si = {}
	for item in prefs[person1]:
		if item in prefs[person2]:
			si[item] = 1
			# 1 doesn't really mean anything special here
			# We're just checking if these people have anything in common before calculating the similarity
	
	print("person1: " + str(len(prefs[person1])))
	print("person2: " + str(len(prefs[person2])))
	print("Shared items: " + str(len(si)))

	# if they have no ratings in common, return 0
	if len(si) == 0: return 0
	# If it didn't return 0 above, let's calculate the similarity

	new_item_1 = copy.deepcopy(prefs[person1])
	new_item_2 = copy.deepcopy(prefs[person2])

	for item in new_item_1:
		if item not in new_item_2:
			new_item_2.setdefault(item, 0.0)

	for item in new_item_2:
		if item not in new_item_1:
			new_item_1.setdefault(item, 0.0)

	print(len(new_item_1))
	print(len(new_item_2))
	
	sum_of_squares = sum( [ pow( new_item_1[item] - new_item_2[item], 2 ) 
							for item in new_item_1 if item in new_item_2] )

	print("SUM ------- " + str(sum_of_squares))

	# Similarity is inversely proportional to distance.
	# This will reverse the result and map it to a 0-1 range.
	similarity = 1/(1+sum_of_squares)
	print person1 + ' x ' + person2 + ': ' + str(similarity)
	return similarity


# ------------------------------------------------------------------

# SIMILAR ITEMS (person-product/product-person)

# Returns the best matches for person from the prefs dictionary.
# Number of results and similarity function are optional params.
# (if you define a default, argument turns into optional)
def topMatches(prefs, person, n = 5, similarity = sim_pearson):

	print 'Called topMatches (similar users)'

	scores = [ ( similarity(prefs, person, other), other )
				for other in prefs if other != person]
	# Notice that the first parameter above is creating objects:
	# ( similarity(), person )

	scores.sort()
	scores.reverse()
	# The next line returns the ranking from 0 to an arbitray number
	# If you haven't passed any n parameter, it defaults to 5
	return scores[0:n]

# ------------------------------------------------------------------

# SWITCH COLLECTION

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