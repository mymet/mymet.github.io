# Loading the python json module
import json

# These functions are in the helper_functions.py file
from helper_functions import topMatches
# from helper_functions import sim_pearson # Not really using this one
from helper_functions import sim_distance


# Loading the original file and reading its headers
jsonFile = open("../data/user_preferences.json", "r")
item_dict = json.load(jsonFile)
jsonFile.close()
# print(len(item_dict))


# Defaults to top 10, for comparison
def calculateSimilarItems(prefs, n = 10):
  
  # Create a dictionary of items showing which other items they
  # are most similar to.
  result = {}

  c = 0

  for item in prefs:
    # Status updates for large datasets
    c += 1
    if c % 100 == 0: print "%d / %d" % (c,len(prefs))
    
    # Find the most similar items to this one
    scores = topMatches(prefs, item, n = n, similarity = sim_distance)
    result[item] = scores
    
  return result


similar_items = calculateSimilarItems(item_dict)


jsonFile = open("../data/similar_items.json", "r")
users_dict = json.load(jsonFile)
jsonFile.close()
