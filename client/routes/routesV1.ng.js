angular.module('HeatingUp').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
	function($urlRouterProvider, $stateProvider, $locationProvider) {
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('games', {
				url: '/games',
				templateUrl: 'client/views/games.ng.html',
				controller: 'GamesController',
				resolve: {
				    "currentUser": ["$meteor", function($meteor){
			    		return $meteor.requireUser();
				    }]
				}
			})
			.state('gameDetails', {
				url: '/games/:gameId',
				templateUrl: 'client/views/gameDetails.ng.html',
				controller: 'GameDetailsController',
				resolve: {
				    "currentUser": ["$meteor", function($meteor){
			    		return $meteor.requireUser();
				    }]
				}				
			})
			.state('stats', {
				url: '/stats',
				templateUrl: 'client/views/stats.ng.html',
				controller: 'StatsController',
				resolve: {
				    "currentUser": ["$meteor", function($meteor){
			    		return $meteor.requireUser();
				    }]
				}				
			})			
			.state('landingPage', {
				url: '/',
				tempalteUrl: 'client/views/landingPage.ng.html',
				controller: 'LandingPageController'
			});

		$urlRouterProvider.otherwise('/')
	}
]);

angular.module("HeatingUp").run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $location.path("/");
    }
  });
}]);