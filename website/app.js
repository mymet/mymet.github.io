/*-------------------- MODULES --------------------*/
var		express = require('express'),			  // Run server
	 bodyParser = require('body-parser'),		  // Parse requests
			 jf = require('jsonfile'),			  // Read json files
			  _ = require('underscore');		  // Filtering/sorting

/*-------------------- SETUP --------------------*/
var app = express();
// .use is a middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(function(req, res, next) {
    // Setup a Cross Origin Resource sharing
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('incoming request from ---> ' + ip);
    // Show the target URL that the user just hit
    var url = req.originalUrl;
    console.log('### requesting ---> ' + url);
    next();
});

app.use('/', express.static(__dirname + '/public'));

/*-------------------- DATA ---------------------*/
var allItems = jf.readFileSync('data/similar_items.json');
// console.log(allItems);

/*------------------- ROUTERS -------------------*/


app.get('/home', function(request, response) {
    // console.log(allItems.length);
    var nonNullGalleryItems = _.filter(allItems, function(item, key, list){
        return item.department != null;
    });
    // console.log(nonNullGalleryItems.length);
    
    var itemsByDepartment = _.groupBy(nonNullGalleryItems, function(item){
        return item.department;
    });
    // response.json(itemsByDepartment);

    var oneItemPerDepartment = _.map(itemsByDepartment, function(items, key, list){
        // console.log(key);
        // console.log(_.sample(items, 1));
        return _.sample(items, 1)[0];
    });
    response.json(oneItemPerDepartment);
});


/*----------------- INIT SERVER -----------------*/
var PORT = 3300; //the port you want to use
app.listen(PORT, function() {
    console.log('Server running at port ' + PORT + '. Ctrl+C to terminate.');
});