# Met Recommendation

Gabriel Gianordoli and John Choi

MET Media Lab

Spring, 2015


## To-dos

### DATA

* Get from scrapi:
	* Check whether or not object has image
	* Check whether or not object is on display
	* Get the gallery number (from the website)
	* Get the department
	* Get the image url
	
* Change the data format to:

```
{
	item_id: 16584,
	item_title: 'George Washington',
	gallery_number: 140/null, // null if object is not on display
	department: 'egyptian art'/null,
	img_url_web: 'http://...', // null if it doesn't have image?
	img_url_big: 'http://...', // null if it doesn't have image?
	similar_items: [
			{ item_id: 004327, similarity: 0.01 },
			{ item_id: 052345, similarity: 0.005 },
			...
	]
}
```


### SERVER-SIDE

* Program the interface with the data (json file)

* Program the interface with the user
	* Kart
	* Combine recommendations for each new item (add latest)


### CLIENT-SIDE

* Visual design

* Program the data display

* Program the interaction
