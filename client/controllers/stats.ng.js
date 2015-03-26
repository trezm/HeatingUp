angular.module("HeatingUp").controller('StatsController', ['$scope', '$meteor', '$stateParams', '$rootScope',
  function($scope, $meteor, $stateParams, $rootScope){
		$scope.svg;
    var dateFormatter = d3.time.format('%Y-%m-%d');

    var bucketizeData = function(data) {
    	var buckets = {};
    	for (var i = 0; i < data.length; i++) {
    		var turn = data[i];
    		buckets[turn.index] = buckets[turn.index] ? buckets[turn.index] : [];
    		buckets[turn.index].push(turn.made);
    	}

    	var array = [];
    	for (var key in buckets) {
    		array.push({
    			index: Number(key),
    			made: Number(buckets[key].reduce(function(previous, current) {
    				return previous + current;
    			}) / buckets[key].length)
    		});
    	}

    	return array;
    };

    var drawData = function(svg, data, x, y, width, height, fullAnimate) {
    	// Clear bars
			svg.selectAll("bar").remove();

			svg.selectAll("bar")
	      .data(data)
	      .enter().append("rect")
	      .style("fill", "#6ad125")
	      .attr("x", function(d) { return x(d.index); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return height; })
	      .attr("height", function(d) { return 0 })
	      .transition()
	      .duration(666)
	      .attr("height", function(d) { return height - y( d.made ); })
	      .attr("y", function(d) { return y(d.made); });
    }

    var drawAxis = function(svg, data, x, y, width, height) {
    	// Clear axes
			svg.selectAll("g").remove();

      // Define the axes
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function(index) { return "Turn " + (index + 1); });

    	var yAxis = d3.svg.axis()
        .scale(y)
       	.orient("left").ticks(5);

    	// Define the line
    	var valueline = d3.svg.line()
	    	.x(function(d) { return x( d.index ); })
	    	.y(function(d) { return y( d.made ); });

      // Add the X Axis
      svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
          return "rotate(-65)" 
        });

      // Add the Y Axis
      svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis);
	      $scope.svg = svg;
    }

    var drawGraph = function() {
	    var alteredData = bucketizeData($scope.turns);

			var graphDiv = d3.select('.average-ppt');

		  // Set the dimensions of the canvas / graph
			var margin = {top: 30, right: 20, bottom: 100, left: 50};
			var width = graphDiv[0][0].clientWidth - margin.left - margin.right;
			var height = 270 - margin.top - margin.bottom;

      // Adds the svg canvas
      var svg;
      if ($scope.svg) {
//        $scope.svg.selectAll("bar").remove();
        $scope.svg.selectAll("rect").remove();            
//        $scope.svg.selectAll("g").remove();
        svg = $scope.svg;
      } else {
        svg = graphDiv
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");   
      }

			// Set the ranges
			var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
			var y = d3.scale.linear().range([height, 0]);


      var xDomain = alteredData.map(function(turn) { return turn.index });
      var yDomain = [0, d3.max(alteredData, function(turn) { return turn.made })];

      x.domain(xDomain);
      y.domain(yDomain);

			drawAxis(svg, alteredData, x, y, width, height);

      drawData(svg, alteredData, x, y, width, height, true);
    }

  	// Vars
		$scope.games = $meteor.collection(function() {
      return Games.find({ user: $rootScope.currentUser ? $rootScope.currentUser._id : 'notauser' });
    });

		$scope.turns = $meteor.collection(function() {
//      return Turns.find({ user: $rootScope.currentUser ? $rootScope.currentUser._id : 'notauser' }, {sort: {index: -1}});
      return Turns.find({ user: $rootScope.currentUser ? $rootScope.currentUser._id : 'notauser' });
    }, false).subscribe('turns');

		$meteor.subscribe('turns').then(function(subscriptionHandle) {
			console.log('udpated turns.');
		})

    $scope.$watchCollection('turns', function(newValue, oldValue) {
    	console.log('more turns added:', arguments);
    	drawGraph();
    });
  }
]);