import pymongo
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['met']
collection = db['items_by_user']

# These functions are in the helper_functions.py file
from helper_functions import transformPrefs

user_dict = {}

# Loading the records from mongoDB
for record in collection.find():
	key = record['user'].keys()[0]
	value = record['user'][key]
	user_dict[key] = value

# Make a dictionary with "item preferences"
# Switch the dictionary from { person: { item: } }
# 						  to { item: { person: } }
item_prefs = transformPrefs(user_dict)
print("Found " + str(len(item_prefs)) + " unique items.")

collection = db['users_by_item']

# Saving everything to mongoDB
for key, value in item_prefs.items():
    collection.insert({'item': {key: value}})

print('Successfully saved data to MongoDB met.users_by_item')