// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic', 'App.controllers', 'App.services', 'ngMap'])

.run(function($ionicPlatform, $ionicPopup) {
        
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

              

  });
})

.config(function($stateProvider, $urlRouterProvider) {
    
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })
  
    .state('app.add', {
    url: "/add",
    views: {
      'menuContent': {
        templateUrl: "templates/add.html",
        controller: 'AddCtrl'
      }
    }
  })

  .state('app.items', {
    url: "/items/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/items.html",
        controller: 'ItemsCtrl'
      }
    }
  })

  .state('app.item', {
    url: "/item/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/item.html",
        controller: 'ItemCtrl'
      }
    }
  })
  
    .state('app.useritems', {
    url: "/useritems",
    views: {
      'menuContent': {
        templateUrl: "templates/useritems.html",
        controller: 'UserItemsCtrl'
      }
    }
  })
  
  .state('app.userfavourites', {
    cache: false,
    url: "/userfavourites",
    views: {
      'menuContent': {
        templateUrl: "templates/userfavourites.html",
        controller: 'UserFavouritesCtrl'
      }
    }
  })
  
  .state('app.usercomments', {
    url: "/usercomments",
    views: {
      'menuContent': {
        templateUrl: "templates/usercomments.html",
        controller: 'UserCommentsCtrl'
      }
    }
  })
  
  .state('app.help', {
    url: "/help",
    views: {
      'menuContent': {
        templateUrl: "templates/help.html",
        controller: 'HelpCtrl'
      }
    }
  })
  
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  })
  
  .state('app.nearme', {
    cache: false,
    url: "/nearme",
    views: {
      'menuContent': {
        templateUrl: "templates/nearme.html",
        controller: 'NearMeCtrl'
      }
    }
  })
  
  .state('app.searchResults', {
    cache: false,
    url: "/results",
    views: {
      'menuContent': {
        templateUrl: "templates/searchResults.html",
        controller: 'SearchResultsCtrl'
      }
    }
  })
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
