 'use strict';
/**
 * @ngdoc function
 * @name telecomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp').controller('MemberController', ['$scope', 'SitesFactory', 'socket', 'Auth', 'AuthToken', 'AuthInterceptor', '$rootScope', '$location', 'UserFactory', function ($scope, SitesFactory, socket, Auth, AuthToken, AuthInterceptor, $rootScope, $location, UserFactory) {



           //GET ALL USER INFORMATION
    UserFactory.query().$promise.then(function (response) {
      $scope.users = response;
    }, function (err) {
      console.log(err);
    });
    


}]);
