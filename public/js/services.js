'use strict';
/* Services */

var apiService = angular.module('apiService', ['ngResource']);


apiService.factory('API', ['$resource','params',
              function($resource,params){
return $resource('/', { },
        {
            'generateAuthUrl':  {
                url:    '/generateAuthUrl',
                method: 'POST'
            }
        });
}]);



