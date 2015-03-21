""" Loading the python csv module """
import csv

""" Loading the original file and reading its headers """
original_data = open('../data/saved_item.csv','rb')
reader = csv.reader(original_data, delimiter = ',')
headers = reader.next()
# print headers

"""	From this file we only need the CrdId (item)
	and the User_Id (person)
	Let's find out in which column they are """
item_column = 0
user_column = 0
for i in range(len(headers)):
	if headers[i] == "CrdId":
		item_column = i
	elif headers[i] == "User_Id":
		user_column = i
# print item_column
# print user_column

"""	First, let's make a dictionary of all items, with value 0 """
all_items = {}
for row in reader:
	item_id = row[item_column]
	# print item
	all_items.setdefault(item_id, 0)
# print all_items.keys()
# print len(all_items)
""" This will give us 106653 unique items """

# """	Now let's make a dictionary of {user:{item: 0/1, ...}, ...}
# 	0: the user hasn't added it 1: the user has added the item; """
# all_users = {}

# """	Reset the iterator and loop again through the csv """
# original_data.seek(1)
# for row in reader:
# 	user_id = row[user_column]
# 	item_id = row[item_column]
# 	# print user_id
# 	# print item_id
# 	""" Create user and copy the dict of all items into it
# 		(setdefault - if the user doesn't exist already).
# 		dict() specify we're passing a copy, not a reference """
# 	all_users.setdefault(user_id, dict(all_items))
# 	""" Each user has all items inside of it.
# 		All we need to do is to indicate that he/she
# 		has selected the currrent item """
# 	all_users[user_id][item_id] = 1

# print all_users['187310']