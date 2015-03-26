angular.module("HeatingUp").controller('GamesController', ['$scope', '$meteor', '$rootScope',
  function($scope, $meteor, $rootScope){
  	var addGame = function(game) {
      game.createdAt = new Date();
      game.user = $rootScope.currentUser._id;
      console.log('game:', game);

  		Games.insert(game);
  		_populateNewGame();
  	}

  	var _generateQuickname = function() {
  		return adjectives[Math.floor(adjectives.length * Math.random())] + " " + animals[Math.floor(animals.length * Math.random())];
  	}  	

  	var hideGame = function(game) {  		
  		game.hidden = true;  		
  	}

  	var _populateNewGame = function() {
	  	$scope.newGame = {
  			hidden: false,
        turns: []
	  	};	
	  	$scope.newGame.quickName = _generateQuickname();
	  	console.log('$scope.newGame:', $scope.newGame);
  	}

  	_populateNewGame();

  	// Vars
  	$scope.games = $meteor.collection(function() {
      return Games.find({ user: $rootScope.currentUser ? $rootScope.currentUser._id : 'notauser' }, {sort: {index: -1}});
    });

  	// Methods
  	$scope.addGame = addGame;
  	$scope.hideGame = hideGame;
  }
]);