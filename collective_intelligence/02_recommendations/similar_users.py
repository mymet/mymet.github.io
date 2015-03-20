#!/usr/bin/python
# This is indicating to the shell what program is used to interpret the script.
"""
Ranking list of users based on Pearson correlation.
From the book Programming Collective Intelligence

"""

# loading the ranking
from ratings_dic import critics

# loading the similarity score algorithms
from similarity_score_euclidean import sim_distance
from similarity_score_pearson import sim_pearson

# Returns the best matches for person from the prefs dictionary.
# Number of results and similarity function are optional params.
# (if you define a default, argument turns into optional)
def topMatches(prefs,person,n=5,similarity=sim_pearson):

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

# Comment out these lines to call the function
# with different parameters
similarUsers = topMatches(critics, 'Lisa Rose', 5)
print "Top 5 users similar to Lisa Rose are:"
print similarUsers