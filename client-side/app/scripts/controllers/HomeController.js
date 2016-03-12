'use strict';

/**
 * @ngdoc function
 * @name telecomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
  .controller('HomeController', function ($scope, Auth, AuthToken, AuthInterceptor, $rootScope, $location, $cookieStore, SitesBlogFactory, socket,$state,StatisticsFactory) {
                //CHECK LOGIN USER OR NOT

    $scope.loggedIn = Auth.isLoggedIn();

     if ($scope.loggedIn && AuthToken.getToken()) {
      $scope.currentUser = $rootScope.globals.currentUser.data;
      $scope._id = $scope.currentUser.data._id;
      $scope.name = $scope.currentUser.data.name;

    }
    else {
      $state.go('app.login');
    }
           //CHART DATA THAT SHOW ON HOMEPAGE

    $scope.chartData = function () {
      $scope.dataPlan = 0;
      $scope.dataImplementation = 0;
      $scope.dataComplete = 0;
      $scope.dataHault = 0;


      StatisticsFactory.statistics().then(function (response) {
        $scope.labels = [];
        $scope.data = [];
        for (var i = 0; i < response.data.length; i++) {
          switch (response.data[i]._id) {
            case 1:
              $scope.label = 'Plan';
              $scope.dataPlan = response.data[i].total;
              break;
            case 2:
              $scope.label = 'Implementation';
              $scope.dataImplementation = response.data[i].total;
              break;
            case 3:
              $scope.label = 'Complete';
              $scope.dataComplete = response.data[i].total;
              break;
            case 4:
              $scope.label = 'Hault';
              $scope.dataHault = response.data[i].total;
              break;

          }          //PUSH ALL INFORMATION AND SEND BACK TO THE UI 

          $scope.labels.push($scope.label);
          $scope.data.push(response.data[i].total);
        }


        // body...
      });
    };
    $scope.chartData();

        //SOCKET ACTION WHEN SOMEONE CHANGE SITE STATUS IN EDIT SECTION(Plan,Complete,Incomplete,Hault)
    socket.on('chart', function () {
      $scope.chartData();
    });
  });
