angular.module('App.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $state, $timeout, $ionicSideMenuDelegate, $ionicLoading, $ionicModal, $ionicPopup, ParseServices, locationService) {

    
    // Check if Parse is populated with categories, if not, submit one demo
    
    ParseServices.getAll('Categories').then(function(response) {
                
        if(response.length > 0) {
            // there are categories already
        } else {
            // populate with a demo category
            
            var CategCreate = Parse.Object.extend("Categories");
            
            var categs = [];
                        
            var CategCreate = Parse.Object.extend("Categories");
                    var Categ = new CategCreate();  
                    Categ.set("categName", 'Services');
                    Categ.set("categIcon", 'local_laundry_service');
            Categ.save();
            
            
        }
        
        
        
    },function(error){
        //Something went wrong!
    });   
    
    // Add nice effects to the menu
    
    $('.menu-overlay').hide();
    $('.menu-left').addClass('menu-closed');
        
    $scope.openMenuLeft = function() {
        $timeout(function() {
            $scope.menuOpen = $('body').hasClass('menu-open');
            if($scope.menuOpen === true) {
                $('.menu-content').addClass('menu-open-3d');
                $('.menu-left').addClass('menu-left-open');
                $('.menu-left').removeClass('menu-closed');
                $('.menu-right').hide();
                $('.menu-overlay').show();
            } 
        }, 10);
    };
    
    $scope.closeMenuLeft = function() {
        $timeout(function() {
            $('.menu-content').removeClass('menu-open-3d');
            $('.menu-left').removeClass('menu-left-open');
            $('.menu-left').addClass('menu-closed');
            $('.menu-right').show('slow');
            $('.menu-overlay').hide();
            $ionicSideMenuDelegate.toggleLeft();
        }, 10);
    }; 
    
    
    // disable enter key / go button iphone - used for the submit listing form
   function stopRKey(evt) {
      var evt = (evt) ? evt : ((event) ? event : null);
      var node = (evt.target) ? evt.target : 
                               ((evt.srcElement) ? evt.srcElement : null);
      if ((evt.keyCode == 13) && (node.type=="text")) {return false;}
      if ((evt.keyCode == 13) && (node.type=="email")) {return false;}
      if ((evt.keyCode == 13) && (node.type=="tel")) {return false;}
      if ((evt.keyCode == 13) && (node.type=="number")) {return false;}
   }

   document.onkeypress = stopRKey; 
    
    
            $timeout(function() {
                $rootScope.currentUser = Parse.User.current();
                $rootScope.currentUser.email = Parse.User.current().get('email');
            }, 1000);
            
    console.log($rootScope.User);  
    console.log($rootScope.currentUser);    
            
            
  // Form data for the login and reset password modal (& search)
    $scope.loginData = {};
    $scope.resetData = {};
    $scope.registerData = {};
    $scope.searchData = {};
    $rootScope.User = [];
  //  $rootScope.currentUser = [];
    
//// Login Modal ///
  // Create the login modal
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
    $scope.registerModal.hide();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
      Parse.User.logIn($scope.loginData.email, $scope.loginData.password, {
        success: function(user) { 
            
            // saving current user 
            var currentUser = Parse.User.current();
                if (currentUser && currentUser.get('emailVerified') == "1") {
                    $rootScope.currentUser = currentUser;
                                        
                        ParseServices.getFirst('User', "email", $rootScope.currentUser.get('email')).then(function(response) { 
                            if(response.get('avatar')) { var avatar = response.get('avatar')._url; } else { var avatar = 'img/avatar.png';} 
                                $rootScope.User.push({
                                    email: response.get('email'),
                                    avatar: avatar,
                                    location: response.get('location'),
                                    phone: response.get('phone'),
                                })
                                $scope.$apply();        
                        },function(error){
                                //Something went wrong!
                            });

                    
                    $rootScope.currentUser.email = currentUser.get('email');
                } else if (currentUser && currentUser.get('emailVerified') == "0") {
                    $rootScope.currentUser = null;
                    $rootScope.currentUser.email = null;
                    alert('Please verify your email');
                } else {
                    $rootScope.currentUser = null;
                    $rootScope.currentUser.email = null;
                }
            
            $scope.loginModal.hide();                
            // Do stuff after successful login.
        },
        error: function(user, error) {
            // The login failed. Check error to see why.
            var alertPopup = $ionicPopup.alert({
     title: 'Oops',
     template: error.message
   });
    alertPopup.then(function(res) {
     
   });
        }
      });

  };
    
    // Perform the logout action when the user press logout
    $scope.doLogout = function() {
            Parse.User.logOut();
            
            $state.transitionTo("app.home");
            $rootScope.currentUser = null;
    };
   

//// Register Modal ///
  // Create the login modal
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registerModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeRegister = function() {
    $scope.registerModal.hide();
  };

  // Open the login modal
  $scope.register = function() {
    $scope.registerModal.show();
      $scope.loginModal.hide();
  };

  // Perform the register action when the user submits the form
  $scope.doRegister = function() {
            
            var base64avatar = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
            var fileavatar = new Parse.File("mainAvatarNull.png", { base64: base64avatar });
            $scope.parseFileavatar = fileavatar;
            fileavatar.save();
            
            if($scope.registerData.coords) {
            
            } else {
            $scope.registerData.coords = new Parse.GeoPoint({latitude: 0, longitude: 0});
            }
            
            
    var user = new Parse.User();
        user.set("username", $scope.registerData.email);
        user.set("password", $scope.registerData.password);
        user.set("email", $scope.registerData.email);
        user.set("phone", $scope.registerData.phone);
        user.set("location", $scope.registerData.location);
        user.set("coords", $scope.registerData.coords);
        user.set("avatar", $scope.parseFileavatar);
            
            
            
    user.signUp(null, {
        success: function(user) {
            // Hooray! Let them use the app now.
            $scope.registerModal.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Check your email',
                template: 'in order to activate your account'
                });
            alertPopup.then(function(res) {
     
            });         
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
    var alertPopup = $ionicPopup.alert({
     title: 'Oops',
     template: error.message
   });
    alertPopup.then(function(res) {
     
   });
        }
    });

  };     
    
    
//// Reset Password Modal ///
     // Create the reset password modal
    $ionicModal.fromTemplateUrl('templates/reset.html', {
    scope: $scope
    }).then(function(modal) {
        $scope.resetModal = modal;
    });

    // Triggered in the reset password modal to close it
    $scope.closeReset = function() {
        $scope.resetModal.hide();
    };

    // Open the reset password modal
    $scope.reset = function() {
        $scope.resetModal.show();
    };

    // Perform the reset password action when the user submits the email address
    $scope.doReset = function() {
    Parse.User.requestPasswordReset($scope.resetData.email, {
        success: function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Check your email',
                template: 'in order to reset your password'
            });
            alertPopup.then(function(res) {
     
            });

    $scope.resetModal.hide();
        // Password reset request was sent successfully
    },
    error: function(error) {
        // Show the error message somewhere
    var alertPopup = $ionicPopup.alert({
        title: 'Oops',
        template: error.message
    });
    alertPopup.then(function(res) {
     
   });
  }
});
}; 
    

//// Search Modal ///
     // Create the search modal
    $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
    }).then(function(modal) {
        $scope.searchModal = modal;
    });

    // Triggered in the search modal to close it
    $scope.closeSearch = function() {
        $scope.searchModal.hide();
    };

    // Open the search modal
    $scope.search = function() {
        $scope.searchModal.show();
    };

    // Perform the search action when the user submits the search form
    $scope.doSearch = function() {
        
        $rootScope.searchTerms = $scope.searchData.terms;
        $state.transitionTo("app.searchResults");
        $scope.searchModal.hide();
    }; 
    
    
    
// Getting Location 
    $scope.getLocation = function() {
        var onGeoSuccess = function(position) {
        var latlng = position.coords.latitude + ', ' + position.coords.longitude;
                    
        // Get location (city name, state)
        locationService.getLocation(latlng).then(function(location){
        var itemLocation = 
            location.results[0].address_components[4].long_name+
            ', ' +
            location.results[0].address_components[5].long_name;
        $scope.registerData.location = itemLocation;
        $scope.registerData.coords = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});
            },function(error){
                //Something went wrong!
            });
        };

        // onError Callback receives a PositionError object
        function onGeoError(error) {
            alert(error.message);
        }

        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);   
    }
    
 })


.controller('SearchResultsCtrl', function($scope, $rootScope, $ionicLoading, $ionicSideMenuDelegate, ParseServices) {

    
    $rootScope.searchItemIDs = [];
    $scope.page = 0;
    $scope.pagenext = 6;
    
     $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });
    
    $scope.getResults = function() {
        
        $scope.ItemsResutlts = [];
        
        $ionicSideMenuDelegate.toggleLeft();
    
    // Parse Cloud Function that handles the search option    
    Parse.Cloud.run('getItems', {"terms":$rootScope.searchTerms}, {
        success: function(response) {
 
          $rootScope.searchItemIDs = response;

          $scope.ResultsLength = response.length;
            
          var ItemsQuery = Parse.Object.extend("Items");
          var query = new Parse.Query(ItemsQuery);
              query.containedIn ("objectId", $rootScope.searchItemIDs);
              query.skip($scope.page);
              query.limit($scope.pagenext);
          query.find({
          success: function(results) { 
              if(results != '') {   // aici tre sa vad ce e cu searchu
                for (var i = 0; i < results.length; i++) { 
                    $scope.ItemsResutlts.push({
                        id: results[i].id,
                        name: results[i].get("itemName"),
                        price: results[i].get("itemPrice"),
                        featured: results[i].get("featured"),
                        staffPicked: results[i].get("staffPicked"),
                        picture: results[i].get("itemPicture")._url,
                        location: results[i].get("itemLocation"),
                        background: results[i].get("background"),
                    })
                

            } 
              } else { $scope.ItemsResutlts = [];}
              $ionicLoading.hide();
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
      
      },
      error: function(error) {
          console.log(error);
      }
        
    });
    }
    $scope.getResults();
    
    $scope.nextPage = function() {
        $scope.pagenext = $scope.pagenext + 6;
        $ionicLoading.show({
          template: '<i class="material-icons">timelapse</i>'
        });
        $scope.getResults(); 
    }
})

.controller('UserItemsCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, ParseServices) {

    $scope.getUserItems = function() {
    
        $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });
        
        $scope.UserItems = [];
        
        ParseServices.getByTerm('Items', "user", $rootScope.currentUser.get('email')).then(function(response) {
            
                for (var i = 0; i < response.length; i++) {
                    $scope.UserItems.push({
                        name: response[i].get('itemName'),
                        id: response[i].id,            
                    })
                }
                $ionicLoading.hide();
            },function(error){
                //Something went wrong!
            });
        
    }
    $scope.getUserItems();
    
    $scope.removeUserItem = function(item) {
        ParseServices.getFirst('Items', "objectId", item).then(function(results) {
        $scope.ItemToRemove = results;
        $scope.ItemToRemove.destroy();
                
            
            $ionicPopup.alert({
                title: "Success",
                content: "Your listing was removed."
            }).then(function() {
                $scope.getUserItems();
            },function(error){
            //Something went wrong!
        });
    },function(error){
        //Something went wrong!
    });
    }
})


.controller('HelpCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }
  $scope.gotoHome = function() {
    $state.transitionTo("app.home");
  }
})


.controller('HomeCtrl', function($scope, $timeout, $ionicLoading, ParseServices) {
    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });

    
    
    $scope.getHomeItems = function() { 
        $scope.newestItems = [];
                ParseServices.getByTerm('Items', "approved", true, 0, 12).then(function(response) {

                    for (var i = 0; i < response.length; i++) {
                        
                        if(response[i].get('itemPicture')) {
                            picture = response[i].get('itemPicture')._url;
                        } else {
                            picture = 'img/item-sample.png';
                        }
                        
                        $scope.newestItems.push({
                            price: response[i].get('itemPrice'),
                            location: response[i].get('itemLocation'),
                            name: response[i].get('itemName'),
                            picture: picture,
                            featured: response[i].get('featured'),
                            staffPicked: response[i].get('staffPicked'),
                            id: response[i].id,            
                        })
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                },function(error){
                    //Something went wrong!
                });
    }
    
    $scope.getHomeItems();
})


.controller('CategsCtrl', function($scope, ParseServices) {
    $scope.Categories = [];
    ParseServices.getAll('Categories').then(function(response) {
        
        for (var i = 0; i < response.length; i++) {
            $scope.Categories.push({
                name: response[i].get('categName'),
                icon: response[i].get('categIcon'),
                id: response[i].id,            
            })
        }
        
    },function(error){
        //Something went wrong!
    });      
})

.controller('ItemsCtrl', function($scope, $state, $stateParams, $ionicLoading, ParseServices) {
    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });
    
    $scope.getCategoryName = function() {
        ParseServices.getFirst('Categories', "objectId", $stateParams.id).then(function(results) {
            $scope.categoryName = results.get('categName');
            $scope.$apply();
        });
    }
    $scope.getCategoryName();
    
    ParseServices.getByTerm('Items', "categorySelect", $stateParams.id).then(function(results) {
        $scope.ItemsLength = results.length;
    },function(error){
        //Something went wrong!
    });
    
    $scope.Items = [];
    $scope.Category = [];
            
    $scope.page = 0;
    $scope.pagenext = 6;
    
    $scope.getItems = function() {
        
        $scope.Items = [];
        
        ParseServices.getByTerm('Items', "categorySelect", $stateParams.id, $scope.page, $scope.pagenext).then(function(response) {
        
        for (var i = 0; i < response.length; i++) {
            
            if(response[i].get('itemPicture')) {
                            picture = response[i].get('itemPicture')._url;
                        } else {
                            picture = 'img/item-sample.png';
                        }
            
            $scope.Items.push({
                price: response[i].get('itemPrice'),
                location: response[i].get('itemLocation'),
                name: response[i].get('itemName'),
                background: response[i].get('background'),
                picture: picture,
                featured: response[i].get('featured'),
                staffPicked: response[i].get('staffPicked'),
                id: response[i].id,            
            })
        }
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
    },function(error){
        //Something went wrong!
    });
    }
    $scope.getItems();
    
    $scope.nextPage = function() {
    $scope.pagenext = $scope.pagenext + 6;
    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });
    $scope.getItems();           
    }
    
            
    
})

.controller('ItemCtrl', function($scope, $state, $rootScope, $ionicModal, $ionicPopup, $stateParams, $ionicHistory, $ionicLoading, $ionicScrollDelegate, $timeout, ParseServices) {
    
    $ionicLoading.show({
      template: '<i class="material-icons">timelapse</i>'
    });


    setTimeout(function() {
        $('#mapDisplay').hide('fast');
    }, 1000); // <-- time in milliseconds
    
$scope.getItemDetails = function() {
    
    $scope.Item = [];
    $scope.Submitter = [];
    
    ParseServices.getFirst('Items', "objectId", $stateParams.id).then(function(response) {                               
            
        if(response.get('itemCoords')) {
            var lat = response.get('itemCoords').latitude;
            var lon = response.get('itemCoords').longitude;
        } else { 
            var lat = 0;
            var lon = 0;
        }
        
        $scope.ItemData = response;
        
        if(response.get('itemPicture')) {
                            picture = response.get('itemPicture')._url;
                        } else {
                            picture = 'img/item-sample.png';
                        }
        
            $scope.Item.push({
                price: response.get('itemPrice'),
                location: response.get('itemLocation'),
                name: response.get('itemName'),
                background: response.get('background'),
                picture: picture,
                lat: lat,
                lon: lon,
                description: response.get('itemDescription'),
                featured: response.get('featured'),
                staffPicked: response.get('staffPicked'),
                id: response.id,            
            })
        
        ParseServices.getFirst('User', "email", $scope.ItemData.get('user')).then(function(response) {
                
            if(response.get('coords')) {
            var lat = response.get('coords').latitude;
            var lon = response.get('coords').longitude;
        } else { 
            var lat = 0;
            var lon = 0;
        }
            
            $scope.Submitter.push({
               email : response.get('email'),
               phone : response.get('phone'),
               avatar : response.get('avatar').url,
               lat: lat,
               lon: lon,  
            });       
            $scope.$apply();
            $ionicLoading.hide();
        },function(error){
            //Something went wrong!
        });
            
        },function(error){
            //Something went wrong!
        });
    
}

    $scope.itemMap = function() {
        
        $('#mapDisplay').toggle('slow');
    }

    
    $scope.addToFavourites = function() {
            ParseServices.addToFavourites($scope.ItemData).then(function() {
                var alertPopup = $ionicPopup.alert({
                title: 'Success',
                template: 'Listing was added to favourites'
                });
            alertPopup.then(function(res) {
     
            });
            
    },function(error){
        //Something went wrong!
    }); 
}
    
    
    
    //// Details Modal ///
  // Create the modal
  $ionicModal.fromTemplateUrl('templates/itemDetails.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.detailsModal = modal;
  });

  // Triggered in the modal to close it
  $scope.closeDetails = function() {
    $scope.detailsModal.hide();
  };

  // Open modal
  $scope.itemDetails = function() {
    $scope.detailsModal.show();
  };
    

    
        //// Comments Modal ///
  // Create the modal
  $ionicModal.fromTemplateUrl('templates/comments.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.commentsModal = modal;
  });

  // Triggered in the modal to close it
  $scope.closeComments = function() {
    $scope.commentsModal.hide();
  };

  // Open modal
  $scope.comments = function() {
    $scope.commentsModal.show();
      
      $scope.Comments = [];
      
      $scope.getComments = function() {
      
    ParseServices.getComments($scope.ItemData).then(function(response) { 
            for (var i = 0; i < response.length; i++) {
                var item = response[i].get("item");
                    var user = response[i].get("user");
                    var avatar = "";
                if(user.get('avatar')) { avatar = user.get('avatar')._url; } else { avatar = 'img/avatar.png';} 
                    $scope.Comments.push({
                        comment: response[i].get('comment'),
                        userEmail: user.get('email'),
                        userAvatar: avatar
                })
                $scope.$apply();
           
        }
            $ionicLoading.hide();
        },function(error){
            //Something went wrong!
        });
      
      }
      $scope.getComments();
      
  };
    
    
            
            $scope.onShare = function() {     
            window.plugins.socialsharing.share($scope.ItemData.get('itemName') + '\n$' + $scope.ItemData.get('itemPrice'), null, $scope.ItemData.get('itemPicture')._url, null)
            };    
   
            $scope.myGoBack = function() {
                $ionicHistory.goBack();
            };  
 
})


.controller('NearMeCtrl', function($scope, $state, $rootScope, ParseServices) {
    ParseServices.nearMe($rootScope.currentUser, 100).then(function(response) {
        
        $scope.nearItems = [];
        
        for (var i = 0; i < response.length; i++) {
            $scope.nearItems.push({
                name: response[i].get('itemName'),
                coords: response[i].get('itemCoords').latitude + ',' + response[i].get('itemCoords').longitude,
                location: response[i].get('itemLocation'),
                id: response[i].id,
                i: i,
                
            })
            
            
        }
        console.log($scope.nearItems);
        
        $scope.$apply();
    })
    


})


.controller('CommentsCtrl', function($scope, $rootScope, $ionicModal, $ionicPopup) {
    // Perform the action when the user submits the form
                $scope.doComment = function(item) {
                    var CommentCreate = Parse.Object.extend("Comments");
                    var comment = new CommentCreate();
                    comment.set("item", item);
                    comment.set("user", $rootScope.currentUser);
                    comment.set("comment", $scope.commentData.comment);
                    comment.set("approved", false);
                    comment.save();
                    $scope.commentsModal.hide();
                           
                    $ionicPopup.alert({
                        title: "Success",
                        content: "Your comment will be approved soon."
                    });  
            }
    })


.controller('UserCommentsCtrl', function($scope, $rootScope, $ionicLoading, ParseServices) {

    $scope.getUserComments = function() {
        $scope.Comments = [];
        
        ParseServices.getByTerm('Items', "user", $rootScope.currentUser.get('email')).then(function(results) {
            for(var i = 0; i < results.length; i++ ) {
            var item = results[i];
            
                ParseServices.getComments(item).then(function(response) {
                    for(var i = 0; i < response.length; i++ ) {
                        
                        var user = response[i].get('user');
                        var item = response[i].get('item');
                        
                        $scope.Comments.push({
                            comment: response[i].get('comment'),
                            userEmail: user.get('email'),
                            itemName: item.get('itemName'),
                            id: item.id,

                        }); 
                        $scope.$apply();
                    }
                },function(error){
            });
        }
        },function(error){  
    });
   }
})


.controller('SettingsCtrl', function($scope, $rootScope, $ionicPopup, ParseServices, locationService) {
    $scope.User = [];
        ParseServices.getFirst('User', "email", $rootScope.currentUser.get('email')).then(function(response) {
            if(response.get('avatar')) { var avatar = response.get('avatar')._url; } else { var avatar = 'img/avatar.png';} 
                $scope.User.push({
                    email: response.get('email'),
                    avatar: avatar,
                    location: response.get('location'),
                    phone: response.get('phone'),
                })
                                                                                          
                $scope.$apply();
                                                                                          
        },function(error){
                //Something went wrong!
            });
    
        
    // Getting the image
            $scope.getImage = function() {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                                        allowEdit:true,
                                        destinationType: Camera.DestinationType.DATA_URL
                                        });
            }
            
            $scope.getCamera = function() {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                                        allowEdit:true,
                                        destinationType: Camera.DestinationType.DATA_URL
                                        });
            }
            
            
            function onSuccess(imageData) {
            document.getElementById('myAvatar').src="data:image/jpeg;base64," + imageData;
            var base64pic = "data:image/jpeg;base64," + imageData;
            var parseFile = new Parse.File("picture", {base64:base64pic});
            $scope.parseFile = parseFile; 
            parseFile.save().then(function() {
            
                var user = $scope.currentUser;
                    user.set("avatar", $scope.parseFile);
                    user.save();
                $ionicPopup.alert({
                        title: "Success",
                        content: "Your new profile picture was saved."
                        }).then(function() {
                
                })
            }, function(error) {
                // The file either could not be read, or could not be saved to Parse.
            });
            } 
            
            function onFail(message) {
            alert('Failed because: ' + message);
            }
    
   // Getting Location 
    $scope.getLocation = function() {
        
        $scope.userData = {};
        
        var onGeoSuccess = function(position) {
        var latlng = position.coords.latitude + ', ' + position.coords.longitude;
                    
        // Get location (city name, state)
        locationService.getLocation(latlng).then(function(location){
        var itemLocation = 
            location.results[0].address_components[1].long_name + ', ' + location.results[0].address_components[2].long_name;
        $scope.userData.location = itemLocation;
                                                 $scope.$apply();
        $scope.userData.coords = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});
            
           var user = $scope.currentUser;
                    user.set("coords", $scope.userData.coords);
                    user.set("location", $scope.userData.location)
                    user.save();
            
            },function(error){
                //Something went wrong!
            });
        };

        // onError Callback receives a PositionError object
        function onGeoError(error) {
            alert(error.message);
        }

        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError); 
        
    }
    
})

.controller('UserFavouritesCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, ParseServices) {
    
    $scope.getFavourites = function() {
        
        $ionicLoading.show({
            template: '<i class="material-icons">timelapse</i>'
        });
        
        $scope.FavItems = [];
        
        ParseServices.userFavourites($rootScope.currentUser).then(function(response) {

                for (var i = 0; i < response.length; i++) {
                        $scope.FavItems.push({
                            name: response[i].get('itemName'),
                            id: response[i].id
                        })
                        $scope.$apply();
                }
            $ionicLoading.hide();

        },function(error){
            //Something went wrong!
        }); 
    }
    $scope.getFavourites();
    

    $scope.removeFavourite = function(item) {
        $ionicLoading.show({
            template: '<i class="material-icons">timelapse</i>'
        });
          ParseServices.getFirst('Items', "objectId", item).then(function(results) {
                                    
                    $scope.ItemToRemove = results;
                  
                    $ionicLoading.hide();

                    ParseServices.removeFavourite($scope.ItemToRemove).then(function() {

                        $ionicPopup.alert({
                        title: "Success",
                        content: "Your favourite was removed."
                        }).then(function() {
                            $scope.getFavourites();
                        });
                        },function(error){
                            //Something went wrong!
                        });
                    },function(error){
                        //Something went wrong!
                    });     
        }
})


.controller('AddCtrl', function($scope, $state, $rootScope, $ionicPopup, ParseServices, locationService) {
    $scope.item = {};
    
    $('#myImage').attr("src", 'img/item-sample.png');
    
     // Getting Location 
       $scope.getLocation = function() {
                    var onGeoSuccess = function(position) {
                    var latlng = position.coords.latitude + ', ' + position.coords.longitude;
                
                    // Get location (city name, state)
                locationService.getLocation(latlng).then(function(location){
                    var itemLocation = 
                    location.results[0].address_components[1].long_name + ', ' + location.results[0].address_components[2].long_name;
                $scope.item.location = itemLocation;
                $scope.item.coords = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});
            },function(error){
                    //Something went wrong!
                });
                    };
            // onError Callback receives a PositionError object
            //
            function onGeoError(error) {
                alert(error.message);
            }
            navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);   
    }
    
     // Getting the image
            $scope.getImage = function() {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                                        allowEdit:true,
                                        destinationType: Camera.DestinationType.DATA_URL
                                        });  
                
            }
            
            $scope.getCamera = function() {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                                        allowEdit:true,
                                        destinationType: Camera.DestinationType.DATA_URL
                                        });
            }
            
            
            function onSuccess(imageData) {
            document.getElementById('myImage').src="data:image/jpeg;base64," + imageData;
            var base64pic = "data:image/jpeg;base64," + imageData;
            var parseFile = new Parse.File("picture", {base64:base64pic});
            $scope.parseFile = parseFile; 
            parseFile.save().then(function() {
  
            }, function(error) {
                // The file either could not be read, or could not be saved to Parse.
            });
} 
            
            function onFail(message) {
            alert('Failed because: ' + message);
            }
                $scope.send = function() {
                    
                    // Checking if user is logged in
       
                    
                    if($rootScope.currentUser) {
                    var ItemCreate = Parse.Object.extend("Items");
                    var Item = new ItemCreate();  
                    Item.set("itemName", $scope.item.itemName);
                    Item.set("approved", true);
                    Item.set("blocked", false);
                    Item.set("featured", false);
                    Item.set("itemDescription", $scope.item.itemDescription);
                    Item.set("itemPrice", $scope.item.itemPrice);
                    Item.set("reported", false);
                    Item.set("staffPicked", false);
                    Item.set("categorySelect", $scope.item.categorySelect);
                        Item.set("itemCoords", $rootScope.currentUser.get('coords'));
                        Item.set("itemLocation", $rootScope.currentUser.get('location'));
                        Item.set("user", $rootScope.currentUser.get('email'));
                    Item.set("background", Math.floor((Math.random()*6)+1));
                    Item.set("itemPicture", $scope.parseFile);
                    Item.save();
                    $ionicPopup.alert({
                              title: 'Congratulations!',
                              template: 'We will review your listing in a bit.'
                              });
                        $state.transitionTo("app.home");
                    } else {
                     // If there is no logged in user                
                        
                    var base64avatar = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
                    var fileavatar = new Parse.File("mainAvatarNull.png", { base64: base64avatar });
                    $scope.parseFileavatar = fileavatar;
                    fileavatar.save();
  
            if($scope.item.coords) {
            
            } else {
            $scope.item.coords = new Parse.GeoPoint({latitude: 0, longitude: 0});
            }
            
            
            
                    var ItemCreate = Parse.Object.extend("Items");
                    var Item = new ItemCreate();  
                    Item.set("itemName", $scope.item.itemName);
                    Item.set("approved", false);
                    Item.set("blocked", false);
                    Item.set("featured", false);
                    Item.set("itemDescription", $scope.item.itemDescription);
                    Item.set("itemPrice", $scope.item.itemPrice);
                    Item.set("reported", false);
                    Item.set("staffPicked", false);
                    Item.set("categorySelect", $scope.item.categorySelect);
                    Item.set("user", $scope.item.userEmail);
                    Item.set("itemCoords", $scope.item.coords);
                    Item.set("itemLocation", $scope.item.location);  
                    Item.set("background", Math.floor((Math.random()*15)+1));
                    Item.set("itemPicture", $scope.parseFile);
                    var user = new Parse.User();
                    user.set("username", $scope.item.userEmail);
                    user.set("password", $scope.item.userPassword);
                    user.set("email", $scope.item.userEmail);
                    user.set("phone", $scope.item.userTel);
                    user.set("location", $scope.item.location);
                    user.set("coords", $scope.item.coords);
                    user.set("avatar", $scope.parseFileavatar)
                    
                    user.signUp(null, {
                        success: function(user) {
                            // Hooray! Let them use the app now.
                    
                        },
                        error: function(user, error) {
                            // Show the error message somewhere and let the user try again.
                        alert(error.message);
                        }
                    });
                    
                    Item.save();
                   // user.save();
                    
                    $ionicPopup.alert({
                              title: 'Congratulations!',
                              template: 'We will review your listing in a bit. In the meantime verify your email.'
                              });
                    $state.transitionTo("app.home");
                    }
                
                
                }
})