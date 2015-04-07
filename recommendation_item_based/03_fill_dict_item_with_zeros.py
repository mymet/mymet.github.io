# Loading the python json module
import json

jsonFile = open("../data/item_preferences.json", "r")
item_dict = json.load(jsonFile)
jsonFile.close()

jsonFile = open("../data/user_preferences.json", "r")
user_dict = json.load(jsonFile)
jsonFile.close()

# Use this to check if we saved a file for the items already
from os import listdir
from os.path import isfile, join
saved_files = [ f for f in listdir("../data/") if isfile(join("../data/",f)) ]
print(saved_files)

for item in item_dict:
	
    if "crdid_"+item+".json" not in saved_files:

		new_item = item_dict[item]

		for user in user_dict:
			
			if user not in new_item:

				new_item.setdefault(user, 0)
				# print("Added " + user + " to " + item)

		# Saving object to a json file
		jsonFile = open("../data/crdid_"+item+".json", "w")
		# jsonFile.write(json.dumps(new_item, indent=4, sort_keys=True))
		jsonFile.write(json.dumps(new_item))
		jsonFile.close()			
		print('Successfully saved data to ../data/crdid_'+item+'.json')