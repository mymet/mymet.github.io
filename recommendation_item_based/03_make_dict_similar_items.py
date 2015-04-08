import bson
from bson.objectid import ObjectId

import pymongo
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['met']

# These functions are in the helper_functions.py file
from helper_functions import topMatches
# from helper_functions import sim_pearson # Not really using this one
from helper_functions import sim_distance


# Loading the users from mongoDB
users_collection = db['items_by_user']
user_dict = {}
for record in users_collection.find():
  key = record['user'].keys()[0]
  # value = record['user'][key]
  user_dict.setdefault(key, 0)
print("Found " + str(len(user_dict)) + " unique users.")
# print(user_dict)


# Loading the items from mongoDB
items_collection = db['users_by_item']
item_dict = {}

for record in items_collection.find():
  key = record['item'].keys()[0]
  value = record['item'][key]
  item_dict[key] = value

print("Found " + str(len(item_dict)) + " unique items.")
# print(items_collection.find_one({'_id': ObjectId('552456e08c51d00c43398a49')}))


# Loading the similar items db
# to check if we haven't saved this item already
similar_dict = {}
similar_collection = db['similar_items']
for record in similar_collection.find():
  key = record['item'].keys()[0]
  value = record['item'][key]
  similar_dict.setdefault(key, 0)
print(similar_dict)
# print("Found " + str(len(similar_dict)) + " unique items.")


# Defaults to top 10, for comparison
def calculateSimilarItems(prefs, full_list, n = 10):
  
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
    if item not in similar_dict:

      # Status updates for large datasets
      c += 1
      if c % 100 == 0: print "%d / %d" % (c,len(prefs))
      
      # Find the most similar items to this one
      scores = topMatches(prefs, full_list, item, n = n, similarity = sim_distance)
      # result[item] = scores

      # Maybe there are not 10 similar items.
      # This function makes sure we grab only items with similarity > 0

      filtered_results = [ scores[i]
                           for i in range(len(scores)) if scores[i][0] > 0]

      if len(filtered_results) > 0:
        new_item = {item: filtered_results}
        print(new_item)

        similar_collection.insert({'item': new_item})
        print("SAVED")
        print('****************************************************')
        print('****************************************************')
        print('****************************************************')
        print('****************************************************')
    
  # return result

similar_items = calculateSimilarItems(item_dict, user_dict)

# print('Successfully saved data to ../data/similar_items_test.json')