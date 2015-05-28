var app = {};
var allItems;

$( document ).ready(function() {
	$.getJSON('data/similar_items.json', function(data){
		// Filtering the ones on display AND with a thumb on the website
		allItems = _.filter(data, function(item, key, list){
		    return item.department != null &&
		           item.img_url_web != null;
		});
		// console.log(allItems);
		app.init();
	});
});

app.init = function() {

	var page = window.location.pathname;
	var isLoadingData = false;

	/*--------------- SHARED FUNCTIONS AND VARS ---------------*/
	var appendNavigation = function(department){
		var navBar = $('<nav></nav>');
			var home = $('<p id="home"><a href="/gallery.html#' + getParameterByName('page_number') + '">My<b>MET</b> Recommends</a></p>');
				if(department !== undefined){
					home.append('<span> > ' + department + '</span>');
				}
			var myCollection = $('<p id="my-collection"><a href="collection.html">My Collection</a></p>');
			var about = $('<p id="about"><a href="about.html">About</a></p>');

		$('body').prepend(navBar);
		$(navBar).append(home)
				 .append(myCollection)
				 .append(about);

	}

	var appendImages = function(data, container){

		console.log('Called append images for ' + page);
		
		// Gallery
		if(page.indexOf('/gallery.html') > -1){

			// console.log(data);

			for(var i in data){
				var hrName = (data.length > 1) ? (parseInt(i) + 1) : (getCurrentPageNumber());
				$('#container').append('<hr name="' + hrName + '" class="page-counter"/>');				
				data[i].forEach(function(item, index, array){
					var div = $('<div class="item"></div>')
					var link = $('<a href="recommendations.html?main_item_id=' + item.item_id + '&page_number=' + getCurrentPageNumber() + '"></a>');	
					var image = $('<img name="' + item.item_id + '" src="' + item.img_url_web + '"/>');
					$(container).append(div);
					$(div).append(link);
					$(link).append(image);
				});
			}

		}else if(data.length > 0){

			data.forEach(function(item, index, array){
				// console.log(item.img_url_web);

				var div = $('<div class="item"></div>')
				
				// 	// Redirect to department?
				// 	// var link = $('<a href="department.html?main_item_id=' + item.item_id + '#' + encodeURIComponent(item.department) + '">' + item.department + '<br/></a>');

				// Collection
				if(page.indexOf('collection.html') > -1){
					var link = $('<a class="remove-bt" name="' + item.item_id + '"></a>');

				// Recommendation
				}else{
					var link = $('<a href="recommendations.html?main_item_id=' + item.item_id + '"></a>');	
				}
				var image = $('<img name="' + item.item_id + '" src="' + item.img_url_web + '"/>');

				$(container).append(div);
				$(div).append(link);
				$(link).append(image);

				if(page.indexOf('collection.html') > -1){
					$(image).attr('gallery_number', item['gallery_number']);
					$(link).append('<p class="description"><b>' + item['item_title'] + '</b><br/>' +
								   'Gallery ' + item['gallery_number'] +
								   '</p>')
				}				
			});

			if(page.indexOf('collection.html') > -1){
				$('#container').prepend('<h2>Click on the items to remove them from your collection</h2>');
				$('#container').append('<br/><button id="map-bt">Create Map</button><br/>');
			}

		}else{
			$('body').append('<h2>You don\'t have any items in your collection</h2>');			
		}
		
		$('.spinner').remove();
		attachEvents();
	}

	var appendMainItem = function(data, container){
		var mainContent = $('<img ' +
							  	'name="' + data.item_id + '" ' +
							  	'src="' + data.img_url_web + '"' +
							  '/>' +
							  
							  '<br/>' +

							  '<button ' +
							  	'class="add-bt"' +
							  	'name="' + data.item_id + '">' +
							  	'Add to Collection' + 
							  '</button>');

		$(container).append(mainContent);
		attachEvents();
	}	

	var attachEvents = function(){
		$('.add-bt').off('click').on('click', function(){
			// console.log($(this).attr('name'));

			// Does the user already have a collection?

			// Yes. Let's split it into an array and add one more item
			if(localStorage['collection'] !== undefined){
				// console.log(localStorage['collection'].split(',').length);
				var savedItems = localStorage['collection'].split(',');

				// Save only if the item is not yet in the collection
				if(savedItems.indexOf($(this).attr('name')) < 0){

					createPopUp('Item saved to your collection.');

					savedItems.push($(this).attr('name'));
					// console.log(savedItems);
					// window.alert('Item saved to your collection');
					localStorage['collection'] = savedItems;
				}else{
					createPopUp('This item has already been saved to your collection.');
				}

			// No. Just add this item
			}else{
				localStorage['collection'] = $(this).attr('name');
				createPopUp('Item saved to your collection.');
			}

			// Go back to the previous page
			// history.go(-1);
			// Go to the home page
			// window.location.href = '/';
		});

		// Remove items from collection
		$('.remove-bt').off('click').on('click', function(){

			createPopUp('Item removed from your collection.');

			var itemToRemove = $(this).attr('name');
			var savedItems = localStorage['collection'].split(',');
			var index = savedItems.indexOf(itemToRemove);
			savedItems.splice(index, 1);
			localStorage['collection'] = savedItems;
			$(this).remove();
		});	

		$('#map-bt').off('click').on('click', function(){

			if($('#embed_map_here').length == 0){

				var mapDiv = $('<div id="embed_map_here"></div>')
							 .appendTo('#container');

				var embed1 = $(mapDiv).metPathfinder({name : "embed1"}).data("metPathfinder");
		   
		        embed1.setupMap(function(){

					embed1.options.poi_set[0] =  {galnum: "The Great Hall", type : "start"};

					$.each($('.item img'), function(index, item){
						console.log($(item).attr('gallery_number'));
						embed1.options.poi_set[parseInt(index + 1)] =  {galnum: parseInt($(item).attr('gallery_number')), type : "poi"};					
					});

					embed1.pathIt();
		        });

		        $('#container').append('<br/><button id="print-bt">Print</button><br/>');

		        attachEvents();
		    }
		});

		$('#print-bt').off('click').on('click', function(){
			printElement('#container');
		});

		$('.item').find('img').off('mouseenter').on('mouseenter', function(){
			$(this).addClass('selected');
		});
		$('.item').find('img').off('mouseleave').on('mouseleave', function(){
			$(this).removeClass('selected');
		});		
	}

    function printElement(elem){
    	// console.log(elem);
        printPopUp(elem);
    }

    function printPopUp(data){
    	// console.log(data);
    	var printContainer = $('<div id="printable"></div>');

    	var logo = $('<img id="logo" src="img/met_logo.png" />');
    	var title = $('<h1>My<b>MET</b> Recommends</h1>');
    	var images = $(data).find('.item').clone();
    	var map = $(data).find('#embed_map_here').clone();

    	$(printContainer).append(map)
    					 .append(logo)
    					 .append('<br/>')
    					 .append(title)
    					 .append('<br/>')
    					 .append(images);

    	var content = $(printContainer).html();

		$('#container').append('<div class="spinner"><div></div></div>');
    	$("html, body").animate({ scrollTop: $(document).height() }, 500);

        var mywindow = window.open('', 'my div', 'height=400,width=600');
        mywindow.document.write('<html><head>');
        mywindow.document.write('<link rel="stylesheet" href="css/style.css" type="text/css" />');
        mywindow.document.write('</head><body><div id="printable">');
        mywindow.document.write(content);
        mywindow.document.write('</div></body></html>');

    	setTimeout(function(){
    		$('.spinner').remove();
    		mywindow.document.write('<script>window.print()</script>');
    	}, 2000);

        // mywindow.print();
        // mywindow.close();

        // return true;
    }		

	var createPopUp = function(message){
		var popUp = $('<div class="pop-up">' + message + '</div>');
		$(popUp).appendTo('body')
				.animate({
		            top: ($(window).height() / 2) + 'px'
		        },
		        300,
		        function(){
			        setTimeout(function(){
			        	console.log('finished');
			        	$(popUp).animate({
			        		top: '100%'	
			        	}, 300, function(){
			        		$(popUp).remove();
			        	});
			        }, 2000);
		        });
	}

	var getParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	/*------------------------- "SERVER" -------------------------*/
	var loadServerHome = function(request, callback) {
	    // console.log(allItems.length);
	    console.log(request);
	    console.log('Items in the collection: ' + request['items_in_collection']);

	    var itemsPerPage = 40;
	    var firstPage = parseInt(request['first_page']);
	    var lastPage = parseInt(request['last_page']);
	    console.log('Requesting items from ' + (firstPage * itemsPerPage) + ' to ' + (lastPage * itemsPerPage));

	    var chunks = [];
	    for(var i = firstPage; i < lastPage; i++){
	        chunks.push(allItems.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
	    }
	    // console.log(chunks);
	    callback(chunks);
	    // response.json(allItems.slice(firstPage * itemsPerPage, lastPage * itemsPerPage));
	};	

	var loadServerCollection = function(request, callback) {
	    console.log('Items in the collection: ' + request['items_in_collection']);
	    var fullItems = '';
	    if(request['items_in_collection'] !== undefined){
	        var ids = request['items_in_collection'].split(',');
	        fullItems = _.filter(allItems, function(item, index, array){
	            return ids.indexOf(item.item_id) > -1;
	        });
	    }
	    callback(fullItems);            
	}

	var loadServerRecommendation = function(request, callback) {

	    console.log('Main item: ' + request['main_item']);
	    console.log('Items in the collection: ' + request['items_in_collection']);

	    var mainItem = _.filter(allItems, function(item, index, array){
	        return item.item_id == request['main_item'];
	    });
	    console.log(mainItem[0]); // Because underscore will return an array,
	                              // but we're actually looking for a single item

	    var itemsSimilarToMain = getItemsSimilarToMain(mainItem[0]['similar_items'][0]);
	    itemsSimilarToMain = removeItemsAlreadySaved(itemsSimilarToMain, request['items_in_collection']);

	    var itemsSimilarToCollection = '';
	    if(request['items_in_collection'] !== undefined){
	        itemsSimilarToCollection = getItemsSimilarToCollection(request['main_item'], request['items_in_collection']);
	    }
	    
	    callback({
	        main_item: mainItem[0],
	        similar_to_main: itemsSimilarToMain,
	        similar_to_collection: itemsSimilarToCollection   
	    });
	}	

		/*------------------- FUNCTIONS -------------------*/

		var removeItemsAlreadySaved = function(originalList, itemsInCollection){

		    console.log('Called removeItemsAlreadySaved');

		    if(itemsInCollection !== undefined){
		        
		        itemsInCollection = itemsInCollection.split(',');
		        console.log(itemsInCollection);

		        var filteredList = _.filter(originalList, function(item, key, list){
		            return itemsInCollection.indexOf(item.item_id) < 0;
		        });
		        // console.log(departmentItems.length);
		        return filteredList;

		    }else{

		        return originalList;
		    }   
		}

		var getItemsSimilarToMain = function(items, itemsInCollection){

		    console.log('Called getItemsSimilarToMain');

		    // console.log(items);
		    // console.log(Object.keys(items).length);
		    
		    // Get the full record for each of those ids
		    var fullItems = _.filter(allItems, function(item, index, array){
		        return items[item.item_id] !== undefined;
		    });

		    // console.log(fullItems);
		    // console.log(fullItems.length);

		    return fullItems;
		}

		var getItemsSimilarToCollection = function(mainItemId, items){

		    console.log('Called getItemsSimilarToCollection');

		    // Grab the ids stored in the user's localStorage
		    var ids = items.split(',');
		    console.log(ids);

		    // Get the full record for each of those ids
		    var fullItems = _.filter(allItems, function(item, index, array){
		        return ids.indexOf(item.item_id) > -1;
		    });

		    // Creating the array of similar items
		    var similar = {};

		    // Loop through each of the selected items
		    fullItems.forEach(function(item, index, array){
		        // console.log(item.similar_items[0]);

		        // Loop through each of their similar items
		        for(var key in item.similar_items[0]){

		            // Only add items that are not in the user's list
		            if(ids.indexOf(key) < 0){
		                // If the object doesn't exist in the 'similar' list yet,
		                // Create a new one
		                if(similar[key] === undefined){
		                    similar[key] = item.similar_items[0][key];

		                // else, check which one has greater similarity
		                }else{
		                    if(item.similar_items[0][key] > similar[key]){
		                        similar[key] = item.similar_items[0][key];
		                    }
		                }
		            }
		        }
		    });
		    // console.log(Object.keys(similar).length);
		    // console.log(similar);

		    // Filter out items already in the collection — and the main one
		    for(var key in similar){
		        if(ids.indexOf(key) > -1 || key == mainItemId){
		            delete similar[key];
		        }
		    }
		    // console.log(similar);

		    // Convert to object
		    // We just need the id and the similarity index to make the ranking
		    similar = _.map(similar, function(value, key, collection){
		        return { item_id: key, similarity: value };
		    });
		    // console.log(similar);
		    
		    // Sort by similarity (ranking)
		    similar = _.sortBy(similar, function(item, index, list){
		        // console.log(item.similarity);
		        return item.similarity;
		    });
		    // console.log(similar);
		    // Reverse order
		    similar.reverse();
		    // Grab only the top 20
		    similar = similar.slice(0, 20);
		    // console.log(similar);
		    // console.log(similar.length);

		    // Now let's get rid of the similarity indexes and leave just the ids
		    similar = _.map(similar, function(item, index, array){
		        return item.item_id;
		    });
		    // console.log(similar);
		    // console.log(similar.length);

		    // At last, look for these ids into the full array
		    // and grab the images for them!
		    var itemsToSendBack = _.filter(allItems, function(item, index, array){
		        // console.log(item.item_id);
		        return similar.indexOf(item.item_id) > -1;
		    });
		    // console.log(itemsToSendBack.length);

		    return itemsToSendBack;
		}	
	/*------------------------------------------------------------*/

	var loadHome = function(isAppending){

		console.log('Called loadHome');

		if(!isLoadingData){
			$('#container').append('<div class="spinner"><div></div></div>');
			isLoadingData = true;			
			console.log('Requesting more items.');
			
			var lastPage = getCurrentPageNumber();
			console.log('lastPage: ' + lastPage);

			var firstPage = (isAppending) ? (firstPage = lastPage - 1) : (0);
			console.log('>> lastPage: ' + lastPage);
			console.log('>> firstPage: ' + firstPage);	

			loadServerHome({
				'first_page': firstPage,
				'last_page': lastPage,
				'items_in_collection': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					// console.log(response);
					// Debounce
					setTimeout(function(){

						isLoadingData = false;
						if(getCurrentPageNumber() > 1 && response.length > 1){
							console.log(getCurrentPageNumber());
							$('html, body').animate({
					            scrollTop: $('[name="' + getCurrentPageNumber() + '"]').offset().top + 'px'
					        }, 'fast');
						}
					}, 1000);
					appendImages(response, $('#container'));
		        }
		    });

		}else{
			console.log('Call already in progress.');
		}
	}

	/*------------------------- PAGES -------------------------*/
	// HOME
	if(page == '/' || page == '/index.html'){

		console.log('Loaded index');

		function getRandomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// var random = Math.floor(Math.random()*14);
		var random = getRandomInt(0, allItems.length);
		console.log(random);
		console.log(allItems[random]['img_url_big']);
		$('#bg').css('background-image', 'url("' + allItems[random]['img_url_big'] + '")');

	// Gallery
	}else if(page.indexOf('gallery.html') > -1){

		var debounce;
		// Infinite scroll
		$(window).scroll(function()	{
			// console.log($(window).scrollTop() + '/' + ($(document).height() - $(window).height()));
		    if($(window).scrollTop() >= $(document).height() - $(window).height() - 20) {
		    	// console.log('BUMP!');
		    	clearTimeout(debounce);
		    	debounce = setTimeout(doneScrolling, 500); 
				
		    }
		});

		var doneScrolling = function(){
			console.log('Called doneScrolling.');
			location.hash = getCurrentPageNumber() + 1;
	        loadHome(true);
		}

		var getCurrentPageNumber = function(){
	    	var currentPageNumber = location.hash.substring(1, location.hash.length);
	    	currentPageNumber = parseInt(currentPageNumber);
	    	if(isNaN(currentPageNumber)){
	    		console.log("Not a number. Setting to 0");
	    		currentPageNumber = 1;
	    		location.hash = 1;
	    	}
	    	return currentPageNumber;			
		}
		
		appendNavigation();
		// isAppending = false
		// load all pages until the current one, instead of appending
		loadHome(false);	

	// RECOMMENDATIONS
	}else if(page.indexOf('recommendations.html') > -1){

		var loadRecommendations = function(){
			// console.log(location.hash.substring(1));
			loadServerRecommendation({
				'main_item': mainItemId,
				'items_in_collection': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					console.log(response);

					var mainItem = $('<div class="main"></div>');

					var similarToMain = $('<div>' +
											'<hr class="recommendation">' +
											'<h2>You might also be interested in these artworks</h2>' +
										'</div>');

					var similarToCollection = $('<div>' +
													'<hr class="recommendation">' +
													'<h2>More suggestions based on the artworks in your collection</h2>' +
												'</div>');

					$('#container').append(mainItem);
					appendMainItem(response['main_item'], mainItem);

					$('#container').append(similarToMain);
					appendImages(response['similar_to_main'], similarToMain);

					if(response['similar_to_collection'] != ''){
						$('#container').append(similarToCollection);	
						appendImages(response['similar_to_collection'], similarToCollection);
					}
		        }
		    });			
		}

		var mainItemId = getParameterByName('main_item_id');
		console.log(mainItemId);
		appendNavigation();
		loadRecommendations();


	// COLLECTION
	}else if(page.indexOf('collection.html') > -1){

		var loadCollection = function(){
			// console.log(location.hash.substring(1));
			loadServerCollection({
				'items_in_collection': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					console.log(response);
					appendImages(response, $('#container'));
		        }
		    });
		}
		
		appendNavigation();
		loadCollection();

	// ABOUT
	}else if(page.indexOf('about.html') > -1){
		
		appendNavigation();
	}
};
