# Met Recommendation

Gabriel Gianordoli and John Choi

MET Media Lab

Spring, 2015


## To-dos

### DATA

* Insert Collection info in each object

* Get from scrapi:
	* Clean up the objects that have no image
	* Clean up the objects not currently on display
	* Get the gallery number (from the website)
	
* Change the data format to:

```
{
	item_id: 085992,
	gallery_number: 140,
	department: 'egyptian art',
	on_display: true/false,
	img_url: 'http://...',
	similar: [
			0.01: 'item_id1',
			0.005: 'item_id2'
	]
}
```


### SERVER-SIDE

* Program the interface with mongoDB

* Program the interface with the user
	* Kart
	* Combine recommendations for each new item (add latest)


### CLIENT-SIDE

* Visual design

* Program the data display

* Program the interaction
