import bson
from bson.objectid import ObjectId

import pymongo
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['met']

users_collection = db['items_by_user']
user_dict = {}
for record in users_collection.find():
	key = record['user'].keys()[0]
	value = record['user'][key]
	user_dict[key] = value
print("Found " + str(len(user_dict)) + " unique users.")



items_collection = db['users_by_item']
item_dict = {}

# print(items_collection.find_one({'_id': ObjectId('552456e98c51d00c433a2f18')}))

# # Loading the records from mongoDB
for record in items_collection.find():
	id = record['_id']
	key = record['item'].keys()[0]
	value = record['item'][key]
	print(id)
	print(key)
	# print(len(value))
	# print(len(user_dict))
	print("\n")

	# We need as many elements as users inside each object
	if len(value) < len(user_dict):
		print("UPDATING ITEM")

		new_item = value

		for user in user_dict:
			
			if user not in value:

				new_item.setdefault(user, 0)
				# print("Added " + user + " to " + item)
		# print(new_item)
		# print(len(new_item))
		items_collection.update({'_id': ObjectId(id)}, { '$set': {'item': {key: new_item}} }, upsert=False)
		print("Updated")		
		# print(items_collection.find_one({'_id': id}))
		print("************************************************")
		print("\n")		

	else:
		print("Item already updated.")
		print("************************************************")