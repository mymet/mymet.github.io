"""
Recommentation script based on Pearson Correlation Score.
From the book Programming Collective Intelligence

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

# function
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

	# Calculate Pearson scroe
	num = pSum - (sum1*sum2/n)
	den=sqrt((sum1Sq-pow(sum1,2)/n)*(sum2Sq-pow(sum2,2)/n))
	if den == 0: return 0

	r = num/den
	print person1 + ' x ' + person2 + ': ' + str(r)
	# will return a number between -1 and 1
	return r

"""
# Call for this pair
sim_pearson(critics, 'Lisa Rose','Gene Seymour')

# Call this comparison for each person
for person1 in critics.keys():
	for person2 in critics.keys():
		if person1 != person2:
			sim_pearson(critics, person1, person2)
"""