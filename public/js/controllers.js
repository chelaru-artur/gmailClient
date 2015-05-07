 'use strict';


/* Controllers */

var appControllers = angular.module('appControllers', ['ngResource']);


appControllers.controller('MainCtrl', ['$scope','$routeParams','API',
function ($scope,$routeParams,API) {
    $scope.authUrl = '';
    API.generateAuthUrl(function(data){
        $scope.authUrl = data.url;
    });
}]);

