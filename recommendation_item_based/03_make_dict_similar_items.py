# Loading the python json module
import json

# Use this to check if we saved a file for the items already
from os import listdir
from os.path import isfile, join
saved_files = [ f for f in listdir("../data/") if isfile(join("../data/",f)) ]
print(saved_files)

# These functions are in the helper_functions.py file
from helper_functions import topMatches
# from helper_functions import sim_pearson # Not really using this one
from helper_functions import sim_distance


# Loading the original file and reading its headers
jsonFile = open("../data/item_preferences.json", "r")
item_dict = json.load(jsonFile)
jsonFile.close()
# print(len(item_dict))


# Defaults to top 10, for comparison
def calculateSimilarItems(prefs, n = 10):
  
  # Create a dictionary of items showing which other items they
  # are most similar to.
  # result = {}
  
  # ------------------------------------------------------------
  # UPDATE:
  # NOT putting everything into this list and saving at the end.
  # Instead, we'll save a json for each item.
  # So we don't need to start over in case it breaks.
  # ------------------------------------------------------------

  c = 0

  for item in prefs:

    # Only calculate similarity if we haven't already saved this file
    if "crdid_"+item+".json" not in saved_files:

      # Status updates for large datasets
      c += 1
      if c % 100 == 0: print "%d / %d" % (c,len(prefs))
      
      # Find the most similar items to this one
      scores = topMatches(prefs, item, n = n, similarity = sim_distance)
      # result[item] = scores

      # Maybe there are not 10 similar items.
      # This function makes sure we grab only items with similarity > 0
      filtered_results = [ scores[i]
                           for i in range(len(scores)) if scores[i][0] > 0]

      new_item = {item: filtered_results}
      print(new_item)

      # Saving object to a json file
      jsonFile = open("../data/crdid_"+item+".json", "w")
      jsonFile.write(json.dumps(new_item, indent=4, sort_keys=True))
      jsonFile.close()    
    
  # return result

similar_items = calculateSimilarItems(item_dict)

# print('Successfully saved data to ../data/similar_items_test.json')