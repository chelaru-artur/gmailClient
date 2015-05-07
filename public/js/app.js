/* App Module */

var app = angular.module('app', [
  'ngSanitize',                                               
  'ngRoute',
  'appControllers',
  'apiService'
]);

//app.config(['$routeProvider',
//  function($routeProvider) {
//    $routeProvider.
//      when('/', {
//        templateUrl: '/',
//        controller: 'MainCtrl'
//      }).
//      when('/login', {
//          templateUrl: 'partials/getaccess.html',
//        }).
//      otherwise({
//        redirectTo: '/login'
//      });
//  }]);
