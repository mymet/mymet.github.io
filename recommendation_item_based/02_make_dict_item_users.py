# Loading the python json module
import json

# These functions are in the helper_functions.py file
from helper_functions import transformPrefs

# Loading the original file and reading its headers
jsonFile = open("../data/user_preferences.json", "r")
users_dict = json.load(jsonFile)
jsonFile.close()
# pprint(users_dict)

# Make a dictionary with "item preferences"
# Switch the dictionary from { person: { item: } }
# 						  to { item: { person: } }
itemPrefs = transformPrefs(users_dict)

# Saving everything to a json file
jsonFile = open("../data/item_preferences.json", "w")
jsonFile.write(json.dumps(itemPrefs, indent=4, sort_keys=True))
jsonFile.close()

print('Successfully saved data to ../data/item_preferences.json')