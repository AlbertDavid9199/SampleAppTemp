angular.module('App.services', [])

.factory('ParseServices', function($rootScope) {
         
         return {        
             
         getAll: function(Class){
         
            var ParseString = Parse.Object.extend(Class);
            var query = new Parse.Query(ParseString);
            return query.find().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
         },
             
         getByTerm: function(Class, term1, term2, skip, limit){
         
            var ParseString = Parse.Object.extend(Class);
            var query = new Parse.Query(ParseString);
             query.equalTo(term1, term2);
             if(skip) { query.skip(skip); }
             if(limit) {query.limit(limit); }
             if(Class=="Items") { 
                query.equalTo("approved", true);
                query.equalTo("blocked", false);
                query.descending("createdAt");
             }
            return query.find().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
         },
             
        getFirst: function(Class, term1, term2){
         
            var ParseString = Parse.Object.extend(Class);
            var query = new Parse.Query(ParseString);
             query.equalTo(term1, term2);
             if(Class=="Items") { 
                query.equalTo("approved", true);
                query.equalTo("blocked", false);
                query.ascending("createdAt");
             }
            return query.first().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
        },
             
        getComments: function(item){
         
            var ParseString = Parse.Object.extend("Comments");
            var query = new Parse.Query(ParseString);
            query.equalTo("approved", true);
            if(item) {
            query.equalTo("item", item); }
            query.ascending("createdAt");
            query.include("user");
            query.include("item");
            return query.find().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
        },

         addToFavourites: function(item){

            var user = $rootScope.currentUser;
             var relation = user.relation("favourites");
             relation.add(item);
             return user.save().then(function(){
    
            }, function(error){
                //something went wrong!
            });
  
         },
         
         userFavourites: function(user){

             var relation = user.relation("favourites");
             return relation.query().find().then(function(response){
                return response;
            });
 
         },

             
         removeFavourite: function(item){

            var user = $rootScope.currentUser;
             var relation = user.relation("favourites");
             relation.remove(item);
             return user.save().then(function(){
            }, function(error){
                //something went wrong!
            });
  
         },
             
             
         nearMe: function(userObject, limit){
             
             var PlaceObject = Parse.Object.extend("Items");
             var userGeoPoint = userObject.get("coords");
             var query = new Parse.Query(PlaceObject);     
             query.near("itemCoords", userGeoPoint);
             query.limit(limit);
             
            return query.find().then(function(response){
                return response;
            }, function(error){
                //something went wrong!
            });
            
 
         },
     
        }
         
         })

        


.factory('locationService', function($http) {
         var locations = [];
         var latlng = "";
         
         return {
         getLocation: function(latlng){
         return $http({
                      url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=YourKeyHere", //*** location service ***
                      method: "GET",
                      }).then(function(response){
                              locations = response.data;
                              return locations;
                              }, function(error){
                              //something went wrong!
                              });
         }
         }
         })