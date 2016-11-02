var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Meal = require("../models/model.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {
  
  var jsonData = {
  	'name': 'AirChef API',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new meal, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the meal
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var title = req.body.title;
    var description = req.body.description;
    var chef = req.body.chef;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var mealObj = {
      title: title,
      description: description,
      chef: chef
    };

    // create a new meal model instance, passing in the object
    var meal = new Meal(mealObj);

    // now, save that meal instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
    meal.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving meal'};
        return res.json(error);
      }

      console.log('saved a new meal!');
      console.log(data);

      // now return the json data of the new meal
      var jsonData = {
        status: 'OK',
        meal: data
      }

      return res.json(jsonData);

    })  
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the meal to get
//  * @param  {String} req.param('id'). The mealId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Meal.findById(requestedId, function(err,data){

    // if err or no user found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that meal'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the meal
    var jsonData = {
      status: 'OK',
      meal: data
    }

    return res.json(jsonData);
  
  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all meal details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Meal.find(function(err, data){
    // if err or no meals found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find meals'};
      return res.json(error);
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: 'OK',
      meals: data
    } 

    res.json(jsonData);

  })

})

// /**
//  * GET '/api/search'
//  * Receives a GET request to search for a meal
//  * @return {Object} JSON
//  */
router.get('/api/search', function(req,res){

  // first use req.query to pull out the search query
  var searchTerm = req.query.title;
  console.log("we are searching for " + searchTerm);

  // let's find that meal
  Meal.find({title: searchTerm}, function(err,data){
    // if err, respond with error 
    if(err){
      var error = {status:'ERROR', message: 'Something went wrong'};
      return res.json(error);
    }

    //if no meals, respond with no meals message
    if(data==null || data.length==0){
      var message = {status:'NO RESULTS', message: 'We couldn\'t find any results'};
      return res.json(message);      
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: 'OK',
      meals: data
    } 

    res.json(jsonData);        
  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the meal to update, updates db, responds back
//  * @param  {String} req.param('id'). The mealId to update
//  * @param  {Object} req. An object containing the different attributes of the meal
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.param('id');

   var dataToUpdate = {}; 
   
    // pull out the information from the req.body and add it to the object to update
    var title, description; 

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.title) {
      title = req.body.title;
      // add to object that holds updated data
      dataToUpdate['title'] = title;
    }
    if(req.body.description) {
      description = req.body.description;
      // add to object that holds updated data
      dataToUpdate['description'] = description;
    }

    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that meal
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Meal.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating meal'};
        return res.json(error);
      }

      console.log('updated the meal!');
      console.log(data);

      // now return the json data of the new meal
      var jsonData = {
        status: 'OK',
        meal: data
      }

      return res.json(jsonData);

    })

})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the meal to delete
 * @param  {String} req.param('id'). The mealId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Meal.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that meal to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

module.exports = router;