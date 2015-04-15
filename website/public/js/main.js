/* Your code starts here */

var app = {};

app.init = function() {

	var appendNavigation = function(department){
		var navBar = $('<nav></nav>');
		var home = $('<a href="/">home</a>');

		$('body').append(navBar);
		$(navBar).append(home);
		if(department !== undefined){
			navBar.append('<a href="department.html#' + encodeURIComponent(department) + '"> > ' + department + '</a>');
		}
	}
	
	var page = window.location.pathname;

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
				var image = $('<img src="' + item.img_url_web + '"/>');
				$('body').append(link);
				$(link).append(image);
			});
		}

		loadHome();
		appendNavigation();

	// DEPARTMENT
	}else if(page.indexOf('department.html') > -1){

		var department = decodeURIComponent(location.hash.substring(1));
		
		var loadDepartment = function(){
			// console.log(location.hash.substring(1));
			$.post('/department', {
				'department': department
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
				// var link = $('<a href="department.html#' + encodeURIComponent(item.department) + '"></a>');
				var image = $('<img src="' + item.img_url_web + '"/>');
				$('body').append(image);
				// $(link).append(image);
			});
		}		
		
		loadDepartment();
		appendNavigation(department);
	}

	


	
};

app.init();