"""
Recommentation script based on Euclidean Geometry Distance.
From the book Programming Collective Intelligence

Limitations of this method (as compare to Pearson Correlation Score):
'The Euclidean distance score (...) will say that two critics
are dissimilar because one is consistently harsher than the other,
even if their tastes are very similar.'

"""

"""
# loading the ranking
from ratings_dic import critics
# print len(critics)
"""

# loading the math function sqrt
from math import sqrt

"""
# def creates a function
# This one will calculate the distance of a person to another, based on their preferences
"""


def sim_distance(prefs, person1, person2):
	# I'll be passing the whole list of objects into prefs

	print 'Called sim_distance (Euclidean Geometry Distance score)'

	# Get the list of shared items
	si = {}
	for item in prefs[person1]:
		if item in prefs[person2]:
			si[item] = 1
			# 1 doesn't really mean anything special here
			# We're just checking if these people have anything in common before calculating the similarity

	# if they have no ratings in common, return 0
	if len(si) == 0: return 0
	# If it didn't return 0 above, let's calculate the similarity
	
	"""
	This function calculates the 'distance' between two people 
	- if we were to plot these 2 people on a chart
	based on their preference about a single item.
	It repeats that for each item they have in common.
	And sums up everything
	
	"""
	sum_of_squares = sum( [ pow( prefs[person1][item] - prefs[person2][item], 2 ) 
							for item in prefs[person1] if item in prefs[person2]] )

	"""
	# Here's another way to do the same as above.
	# Maybe it's just not much the 'python way'...
	sum_of_squares = 0
	for item in prefs[person1]:
		if item in prefs[person2]:
			sum_of_squares += pow( prefs[person1][item] - prefs[person2][item], 2 )
	"""

	# Similarity is inversely proportional to distance.
	# This will reverse the result and map it to a 0-1 range.
	similarity = 1/(1+sum_of_squares)
	print person1 + ' x ' + person2 + ': ' + str(similarity)
	return similarity

"""
# Call this comparison for one person
sim_distance(critics, 'Lisa Rose', 'Gene Seymour')

# Call this comparison for each person
for person1 in critics.keys():
	for person2 in critics.keys():
		if person1 != person2:
			sim_distance(critics, person1, person2)
"""