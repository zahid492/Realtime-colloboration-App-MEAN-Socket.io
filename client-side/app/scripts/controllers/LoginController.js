'use strict';

/**
 * @ngdoc function
 * @name telecomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
  .controller('LoginController', function ($scope, Auth, AuthToken, AuthInterceptor, $rootScope, $location, $cookieStore, $state, socket) {


               //CHECK LOGIN USER OR NOT
    $scope.loggedIn = Auth.isLoggedIn();
    if (!$scope.loggedIn) {
        $state.go('app.login');
      }
    $rootScope.$on('$routeChangeStart', function () {

      $scope.loggedIn = Auth.isLoggedIn();
      if (!$scope.loggedIn) {
        $state.go('app.login');
      }else{
        $state.go('app.dashboard.home');
      }
    });
            //LOGIN ACTION AND PUT ALL INFORMATION IN COOKIES

    $scope.dologin = function () {

      $scope.processing = true;

      $scope.error = '';

      Auth.login($scope.username, $scope.password)
        .success(function (data) {
          if(!socket.connected){
            socket.connect();
          }
          $scope.message = data.message;
          if (data.success) {
            $rootScope.globals = {
              currentUser: {
                username: $scope.username,
                data: data
              }
            };
            
            
            $cookieStore.put('globals', $rootScope.globals);
            $state.go('app.dashboard.home');
          }
          else {
            $scope.error = data.message;
          }

        });
    };
  });
