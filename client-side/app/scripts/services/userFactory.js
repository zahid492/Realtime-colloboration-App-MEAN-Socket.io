'use strict';
/**
 * @ngdoc function
 * @name telecomApp.service:authService
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
  .factory('UserFactory', function ($resource, apiUrl) {


    return $resource(apiUrl + 'user/:id', {
      id: '@id'
    }, {
      post: {
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        isArray: true
      },
      get: {
        method: 'GET',
        isObject: true
      },
      delete: {
        method: 'DELETE'
      }
    });
  });
