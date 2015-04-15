/* Your code starts here */

var app = {};

app.init = function() {

	/*--------------- SHARED FUNCTIONS AND VARS ---------------*/
	var appendNavigation = function(department){
		var navBar = $('<nav></nav>');
			var home = $('<p id="home"><a href="/">home</a></p>');
				if(department !== undefined){
					home.append('<span> > ' + department + '</span>');
				}
			var title = $('<p id="title">My Met</p>');
			var myCollection = $('<p id="my-collection"><a href="collection.html">My Collection</a></p>');

		$('body').prepend(navBar);
		$(navBar).append(title);		
		$(navBar).append(home);
		$(navBar).append(myCollection);

	}

	var attachEvents = function(){
		$('.item').off('click').on('click', function(){
			// console.log($(this).attr('name'));
			if(localStorage['collection'] !== undefined){
				// console.log(localStorage['collection'].split(',').length);
				var savedItems = localStorage['collection'].split(',');
				savedItems.push($(this).attr('name'));
				// console.log(savedItems);
				localStorage['collection'] = savedItems;
			}else{
				localStorage['collection'] = $(this).attr('name');
			}			
		});
	}
	
	var page = window.location.pathname;


	/*------------------------- PAGES -------------------------*/
	// HOME
	if(page == '/' || page == '/index.html'){

		// console.log('Your code starts here!');
		var loadHome = function(){
			$.get('/home', {}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					// console.log(response);
					appendImages(response);
		        }
		    });
		}

		var appendImages = function(response){
			response.forEach(function(item, index, array){
				// console.log(item.img_url_web);
				var link = $('<a href="department.html#' + encodeURIComponent(item.department) + '"></a>');
				var image = $('<img class="item" name="' + item.item_id + '" src="' + item.img_url_web + '"/>');
				$('#container').append(link);
				$(link).append(image);
			});
			attachEvents();
		}
		
		appendNavigation();
		loadHome();


	// DEPARTMENT
	}else if(page.indexOf('department.html') > -1){

		var loadDepartment = function(){
			// console.log(location.hash.substring(1));
			$.post('/department', {
				'department': department
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					// console.log(response);
					appendImages(response);
		        }
		    });			
		}

		var appendImages = function(response){
			response.forEach(function(item, index, array){
				// console.log(item.img_url_web);
				var link = $('<a href="recommendations.html"></a>');
				var image = $('<img class="item" name="' + item.item_id + '" src="' + item.img_url_web + '"/>');
				$('#container').append(link);
				$(link).append(image);
			});
			attachEvents();
		}		

		var department = decodeURIComponent(location.hash.substring(1));		
		appendNavigation(department);
		loadDepartment();
		

	// RECOMMENDATIONS
	}else if(page.indexOf('recommendations.html') > -1){

		var loadRecommendations = function(){
			// console.log(location.hash.substring(1));
			$.post('/recommendations', {
				'items': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					console.log(response);
					appendImages(response);
		        }
		    });			
		}

		var appendImages = function(response){
			response.forEach(function(item, index, array){
				// console.log(item.img_url_web);
				var link = $('<a href="recommendations.html"></a>');
				var image = $('<img class="item" name="' + item.item_id + '" src="' + item.img_url_web + '"/>');
				$('#container').append(link);
				$(link).append(image);
			});
			attachEvents();
		}		

		appendNavigation();
		loadRecommendations();


	// COLLECTION
	}else if(page.indexOf('collection.html') > -1){

		var loadCollection = function(){
			// console.log(location.hash.substring(1));
			$.post('/collection', {
				'items': localStorage['collection']
			}, function(response) {
		        // console.log(response);
		        if(response.error){
		        	throw response.error	
		        }else{
					// console.log(response);
					appendImages(response);
		        }
		    });			
		}

		var appendImages = function(response){
			response.forEach(function(item, index, array){
				// console.log(item.img_url_web);
				// var link = $('<a href="department.html#' + encodeURIComponent(item.department) + '"></a>');
				var image = $('<img class="item" name="' + item.item_id + '" src="' + item.img_url_web + '"/>');
				$('#container').append(image);
				// $(link).append(image);
			});
			attachEvents();
		}		

		appendNavigation();
		loadCollection();
	}	


	
};

app.init();