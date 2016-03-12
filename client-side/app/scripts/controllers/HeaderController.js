'use strict';

/**
 * @ngdoc function
 * @name telecomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */

angular.module('telecomApp').controller('HeaderController', function ($scope, Auth, AuthToken, AuthInterceptor, $rootScope, $location, $cookieStore, socket, SitesBlogFactory, Notification, UserFactory, $state, $timeout, $anchorScroll,NotificationFactory) {

               //CHECK LOGIN USER OR NOT
  $scope.loggedIn = Auth.isLoggedIn();

                                          
  if ($scope.loggedIn && AuthToken.getToken()) {
    $scope.currentUser = $rootScope.globals.currentUser.data;
    $scope._id = $scope.currentUser.data._id;

    socket.emit('add-user', {'user_id': $scope._id});
  }
  else {
    $scope.doLogout();
  }
            ///////GET SPECIFIC LOGGED IN USER DATA

  $scope.loginUserdata = function () {
    UserFactory.get({
      id: $scope._id
    }).$promise.then(function (response) {
        $scope.name = response.name;
        $scope.status = response.status;
        $scope.createDate = response.createDate;
        $scope.role = response.role;
        $scope.image = response.image;
      }, function (err) {
        console.log(err);
        $state.go('app.dashboard.404');
      });
  };

             ///SCROLL TO COMMENT PAGE 
  $scope.scrollToComment = function (id, divid) {
    $location.path('dashboard/site/' + id);
    $timeout(function () {
      $location.hash(divid);
      $anchorScroll();
    }, 100);

  };

         //LOGOUT FUNCTION
  $scope.doLogout = function () {
    Auth.logout();
    $state.go('app.login');
    socket.disconnect();
      $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
  });

  };
        //GET ALL NOTIFICATION IN A LOGGED IN USER
  $scope.getNotification = function (id) {
    NotificationFactory.notification(id).then(function (response) {
      $scope.notifications = response.data;
      $scope.notificationsLength = $scope.notifications.length;
      $scope.unreadNotification = 0;
      for (var i = 0; i < $scope.notifications.length; i++) {
        if ($scope.notifications[i].read === false) {
          $scope.unreadNotification++;
        }
      }
      //console.log($scope.unreadNotification);

    });
  };


  $scope.loginUserdata($scope._id);
  $scope.getNotification($scope._id);

           //AFTER CLICK NOTIFICATION ICON ALL UNREAD NOTIFICATION STATUS CHANGE TO READ IN DB

  $scope.afterClickNotification = function (id) {


    setTimeout(function () {
      NotificationFactory.readflagNotification(id).then(function () {
        $scope.getNotification($scope._id);
      });
    }, 1000);
  };

            //AFTER CHANGE PROFILE PICTURE SOCKET ACTION THAT UPDATE USER IMAGE IN HEADER AND SIDEBAR 
  socket.on('ChangeprofilePictureAction', function () {

    $scope.loginUserdata($scope._id);
  });

  

         //GET NOTIFICATION WHEN ADMIN ASSIGNED TO A JOB IN SPECIFIC USER 
  socket.on('send-job-notification-client', function (response) {
    Notification.success({
      message: '<a href="#/dashboard/site/' + response.jobId + '">' + response.messsage + '</a>',
      title: 'Job Assigned!!!',
    });
    $scope.getNotification(response.userId);
  });
 
       //GET NOTIFICATION WHEN SOMEONE COMMENT ON A POST THAT HAVE RELATED TO LOGGGED IN USER.
  socket.on('send-comment-notification-client', function (response) {
    Notification.success({message: '<a href="#/dashboard/site/' + response.siteId+'#'+response.postId+'">' + response.messsage + '</a>', title: 'Comment Notification'});
    $scope.getNotification($scope._id);

  });
  

});
