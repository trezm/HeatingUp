Games = new Mongo.Collection('games');

Games.allow({
  insert: function (userId, game) {
    return userId && game.user === userId;
  },
  update: function (userId, game, fields, modifier) {
    if (userId !== game.user) {    	
      return false;
    }

    return true;
  },
  remove: function (userId, game) {
    if (userId !== game.user) {
      return false;
    }

    return true;
  }
});