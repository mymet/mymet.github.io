import pymongo
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client['met']

# Loading the items from mongoDB
items_collection = db['users_by_item']
item_dict = {}

for record in items_collection.find():
  key = record['item'].keys()[0]
  value = record['item'][key]
  item_dict[key] = value

n_users = {}
for item in item_dict:
	if str(len(item_dict[item])) not in n_users:
		n_users.setdefault(str(len(item_dict[item])), 1)
	else:
		n_users[str(len(item_dict[item]))] += 1

print(n_users)