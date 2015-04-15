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

app.post('/recommendations', function(request, response) {
    // console.log(request.body['items']);

    // Grab the ids stored in the user's localStorage
    var ids = request.body['items'].split(',');

    // Get the full description for each of those ids
    var fullItems = _.filter(allItems, function(item, index, array){
        return ids.indexOf(item.item_id) > -1;
    });

    // Creating the array of similar items
    var similar = [];

    // Loop through each of the selected items
    fullItems.forEach(function(item, index, array){
        // console.log(item.similar_items[0]);

        // Loop through each of their similar items
        for(var key in item.similar_items[0]){

            // Only add items that are not in my list
            if(ids.indexOf(key) < 0){
                var obj = {
                    item_id: key,
                    similarity: item.similar_items[0][key]
                }
                similar.push(obj);                
            }
            // console.log(key + ', ' + item.similar_items[0][key]);
        }
    });
    // console.log(similar);
    // console.log(similar.length);

    // Sortby similarity
    similar = _.sortBy(similar, function(item, index, array){
        // console.log(item.similarity);
        return item.similarity;
    });
    // Reverse order
    similar.reverse();
    // Grab only the top 20
    similar = similar.slice(0, 20);
    // console.log(similar);
    console.log(similar.length);

    similar = _.map()

    // Grab the images for the objects!
    var itemsToSendBack = _.filter(allItems, function(item, index, array){
        console.log(item.item_id);
        // return similar.indexOf(item.item_id) > -1;
    });
    console.log(itemsToSendBack.length);

    // response.json(similar);
});

app.post('/collection', function(request, response) {
    // console.log(request.body['items']);
    var ids = request.body['items'].split(',');
    var fullItems = _.filter(allItems, function(item, index, array){
        return ids.indexOf(item.item_id) > -1;
    });
    response.json(fullItems);
});


/*----------------- INIT SERVER -----------------*/
var PORT = 3300; //the port you want to use
app.listen(PORT, function() {
    console.log('Server running at port ' + PORT + '. Ctrl+C to terminate.');
});