/*-------------------- MODULES --------------------*/
var		express = require('express'),			  // Run server
	 bodyParser = require('body-parser'),		  // Parse requests
			 jf = require('jsonfile'),			  // Read json files
			  _ = require('underscore'),		  // Filtering/sorting
     prettyjson = require('prettyjson');              

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

// Filtering the ones on display AND with a thumb on the website
allItems = _.filter(allItems, function(item, key, list){
    return item.department != null &&
           item.img_url_web != null;
});
// console.log(allItems);

/*------------------- ROUTERS -------------------*/


app.post('/home', function(request, response) {
    // console.log(allItems.length);
    console.log(request.body);
    console.log('Items in the collection: ' + request.body['items_in_collection']);    

    var itemNotSaved = removeItemsAlreadySaved(allItems, request.body['items_in_collection']);

    var itemsByDepartment = _.groupBy(itemNotSaved, function(item){
        return item.department;
    });
    // console.log(prettyjson.render(itemsByDepartment));

    var oneItemPerDepartment = _.map(itemsByDepartment, function(items, key, list){
        // console.log(key);
        // console.log(_.sample(items, 1));
        return _.sample(items, 1)[0];
    });
    
    response.json(oneItemPerDepartment);
});

app.post('/department', function(request, response) {
    console.log('Main item: ' + request.body['main_item']);
    console.log('Department: ' + request.body['department']);
    console.log('Items in the collection: ' + request.body['items_in_collection']);

    var mainItem = _.filter(allItems, function(item, index, array){
        return item.item_id == request.body['main_item'];
    });

    var departmentItems = _.filter(allItems, function(item, key, list){
        return item.department == request.body['department'] &&
               item.item_id != request.body['main_item']; // Remove the main item
    });

    departmentItems = removeItemsAlreadySaved(departmentItems, request.body['items_in_collection']);

    response.json({
        main_item: mainItem[0],
        department_items: departmentItems   
    });
});

app.post('/collection', function(request, response) {

    console.log('Items in the collection: ' + request.body['items_in_collection']);

    var fullItems = '';

    if(request.body['items_in_collection'] !== undefined){
        var ids = request.body['items_in_collection'].split(',');
        fullItems = _.filter(allItems, function(item, index, array){
            return ids.indexOf(item.item_id) > -1;
        });
    }
    response.json(fullItems);            
});

app.post('/recommendations', function(request, response) {

    console.log('Main item: ' + request.body['main_item']);
    console.log('Items in the collection: ' + request.body['items_in_collection']);

    var mainItem = _.filter(allItems, function(item, index, array){
        return item.item_id == request.body['main_item'];
    });
    console.log(mainItem[0]); // Because underscore will return an array,
                              // but we're actually looking for a single item

    var itemsSimilarToMain = getItemsSimilarToMain(mainItem[0]['similar_items'][0]);

    var itemsSimilarToCollection = getItemsSimilarToCollection(request.body['items_in_collection']);
    
    response.json({
        main_item: mainItem[0],
        similar_to_main: itemsSimilarToMain,
        similar_to_collection: itemsSimilarToCollection   
    });
});


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

var getItemsSimilarToMain = function(items){

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

var getItemsSimilarToCollection = function(items){

    console.log('Called getItemsSimilarToCollection');

    // Grab the ids stored in the user's localStorage
    var ids = items.split(',');

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
                // If the object doesn't exist in the 'similar' list,
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


/*----------------- INIT SERVER -----------------*/
var PORT = 3300; //the port you want to use
app.listen(PORT, function() {
    console.log('Server running at port ' + PORT + '. Ctrl+C to terminate.');
});