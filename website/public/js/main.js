/* Your code starts here */

var app = {};

app.init = function() {
	// console.log('Your code starts here!');
	var loadHome = function(){
		$.get('/home', {}, function(response) {
	        // console.log(response);
	        if(response.error){
	        	throw response.error	
	        }else{
				console.log(response);
	        }
	    });
	}

	loadHome();
};

app.init();