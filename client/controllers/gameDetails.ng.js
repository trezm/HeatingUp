angular.module("HeatingUp").controller('GameDetailsController', ['$scope', '$meteor', '$stateParams', '$rootScope',
  function($scope, $meteor, $stateParams, $rootScope){
  	$scope.turns = $meteor.collection(function() {
  		return Turns.find({game: $stateParams.gameId}, {sort: {index: -1}});
  	});

    $scope.$watchCollection('turns', function() {
      console.log('turns:', arguments);
    });

  	var endCurrentTurn = function() { 
      $scope.currentTurn.index = $scope.turns.length;
      $scope.currentTurn.user = $scope.game.user;
  		Turns.insert($scope.currentTurn, function(error, turnId) {        
  			$scope.game.turns.push(turnId);
  		});

  		_populateCurrentTurn();
  	};

  	var made = function() {
  		$scope.currentTurn.made = $scope.currentTurn.made + 1;
  	};

  	var missed = function() {
  		$scope.currentTurn.missed = $scope.currentTurn.missed + 1;
  	}

  	var shotPercentage = function() {
  		var made = 0;
  		var missed = 0;
  		for (var i = 0; i < $scope.turns.length; i++) {
  			var turn = $scope.turns[i];

  			made += turn.made ? turn.made : 0;
  			missed += turn.missed ? turn.missed : 0;
  		}

  		return made + missed !== 0 ? (made / (made + missed) * 100).toFixed(2) : 0;
  	}

  	var _populateCurrentTurn = function() {
	  	$scope.currentTurn = {
  			made: 0,
  			missed: 0,
  			index: $scope.turns.length,
  			game: $stateParams.gameId
	  	};
  	};

  	// Vars
  	$scope.game = $meteor.object(Games, $stateParams.gameId);

  	// Methods
  	$scope.endCurrentTurn = endCurrentTurn;
  	$scope.made = made;
  	$scope.missed = missed;
  	$scope.shotPercentage = shotPercentage;

  	_populateCurrentTurn();
  }
]);