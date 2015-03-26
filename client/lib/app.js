angular.module('HeatingUp', ['angular-meteor', 'ui.router']);

function onReady() {
  angular.bootstrap(document, ['HeatingUp']);
}

if (Meteor.isCordova) 
{
  angular.element(document).on("deviceready", onReady);
}
else
{
  angular.element(document).ready(onReady);
}
