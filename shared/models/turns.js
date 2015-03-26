Turns = new Mongo.Collection('turns');

Turns.allow({
  insert: function (userId, turn) {
    return userId && turn.user === userId;
  },
  update: function (userId, turn, fields, modifier) {
    if (userId !== turn.user) {    	
      return false;
    }

    return true;
  },
  remove: function (userId, turn) {
    if (userId !== turn.user) {
      return false;
    }

    return true;
  }
});

if (Meteor.isServer) {
  Meteor.publish("turnsForUser", function(userId, gameId) {
    return Turns.find({game: gameId, user: userId}, {sort: {index: -1}});
  });
}