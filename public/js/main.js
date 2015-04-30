/* Your code starts here */

var app = {};

app.init = function() {

	var page = window.location.pathname;
	var isLoadingData = false;

	/*--------------- SHARED FUNCTIONS AND VARS ---------------*/
	var appendNavigation = function(department){
		var navBar = $('<nav></nav>');
			var home = $('<p id="home"><a href="/#' + getParameterByName('page_number') + '">MY<b>MET</b> Recommends</a></p>');
				if(department !== undefined){
					home.append('<span> > ' + department + '</span>');
				}
			var myCollection = $('<p id="my-collection"><a href="collection.html">My Collection</a></p>');

		$('body').prepend(navBar);
		$(navBar).append(home);
		$(navBar).append(myCollection);

	}

	var appendImages = function(data, container){
		
		// Home
		if(page == '/' || page == '/index.html'){

			for(var i in data){
				$('#container').append('<hr name="' + i + '" class="page-counter"/>');				
				data[i].forEach(function(item, index, array){
					var div = $('<div class="item"></div>')
					var link = $('<a href="recommendations.html?main_item_id=' + item.item_id + '&page_number=' + getCurrentPageNumber() + '"></a>');	
					var image = $('<img name="' + item.item_id + '" src="' + item.img_url_web + '"/>');
					$(container).append(div);
					$(div).append(link);
					$(link).append(image);
				});
			}

		}else{

			data.forEach(function(item, index, array){
				// console.log(item.img_url_web);

				var div = $('<div class="item"></div>')
				
				// 	// Redirect to department?
				// 	// var link = $('<a href="department.html?main_item_id=' + item.item_id + '#' + encodeURIComponent(item.department) + '">' + item.department + '<br/></a>');

				// Collection
				if(page.indexOf('collection.html') > -1){
					var link = $('<a class="remove-bt" href="" name="' + item.item_id + '"></a>');

				// Recommendation
				}else{
					var link = $('<a href="recommendations.html?main_item_id=' + item.item_id + '"></a>');	
				}
				var image = $('<img name="' + item.item_id + '" src="' + item.img_url_web + '"/>');

				$(container).append(div);
				$(div).append(link);
				$(link).append(image);
			});			

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
							  	'Add' + 
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
					savedItems.push($(this).attr('name'));
					// console.log(savedItems);
					window.alert('Item saved to your collection');
					localStorage['collection'] = savedItems;
				}

			// No. Just add this item
			}else{
				localStorage['collection'] = $(this).attr('name');
			}

			// Go back to the previous page
			// history.go(-1);
			// Go to the home page
			// window.location.href = '/';
		});

		// Remove items from collection
		$('.remove-bt').off('click').on('click', function(){
			var itemToRemove = $(this).attr('name');
			var savedItems = localStorage['collection'].split(',');
			var index = savedItems.indexOf(itemToRemove);
			savedItems.splice(index, 1);
			localStorage['collection'] = savedItems;
		});	
	}	

	var getParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

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

			$.post('/home', {
				'first_page': firstPage,
				'last_page': lastPage,
				'items_in_collection': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					console.log(response);
					// Debounce
					setTimeout(function(){

						isLoadingData = false;
						if(getCurrentPageNumber() > 1){
							$('html, body').animate({
					            scrollTop: $('[name="' + (getCurrentPageNumber() - 1) + '"]').offset().top + 'px'
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

		var debounce;

		// Infinite scroll
		$(window).scroll(function()	{
		    if($(window).scrollTop() == $(document).height() - $(window).height()) {
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


	// DEPARTMENT
	}else if(page.indexOf('department.html') > -1){

		var loadDepartment = function(){
			// console.log(location.hash.substring(1));
			$.post('/department', {
				'main_item': mainItemId,
				'department': department,
				'items_in_collection': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					console.log(response);

					var mainItem = $('<div class="main"></div>');

					var itemsFromDepartment = $('<div>' +
													'<hr>' +
													'<h2>Also from ' + department + '</h2>' +
												'</div>');

					$('#container').append(mainItem);
					$('#container').append(itemsFromDepartment);

					appendMainItem(response['main_item'], mainItem);
					appendImages(response['department_items'], itemsFromDepartment);
		        }
		    });			
		}

		var department = decodeURIComponent(location.hash.substring(1));
		appendNavigation(department);
		var mainItemId = getParameterByName('main_item_id');
		console.log(mainItemId);		

		loadDepartment();
		

	// RECOMMENDATIONS
	}else if(page.indexOf('recommendations.html') > -1){

		var loadRecommendations = function(){
			// console.log(location.hash.substring(1));
			$.post('/recommendations', {
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
											'<hr>' +
											'<h2>You might also like these artworks</h2>' +
										'</div>');

					var similarToCollection = $('<div>' +
													'<hr>' +
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
			$.post('/collection', {
				'items_in_collection': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					console.log(response);
					if(response != ''){
						$('body').append('<h3>Click on the items to remove them from your collection</h3>');
					}else{
						$('body').append('<h3>You don\'t have any items in your collection</h3>');
					}
					appendImages(response, $('#container'));
		        }
		    });
		}
		
		appendNavigation();
		loadCollection();
	}
};

app.init();