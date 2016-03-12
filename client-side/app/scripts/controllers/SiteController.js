'use strict';

/**
 * @ngdoc function
 * @name telecomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
  .controller('SiteController', ['$scope', 'SitesFactory', '$stateParams', '$state', 'SitesBlogFactory', 'socket', 'Auth', 'AuthToken', 'AuthInterceptor', '$rootScope', function ($scope, SitesFactory, $stateParams, $state, SitesBlogFactory, socket, Auth, AuthToken, AuthInterceptor, $rootScope) {

            //CHECK LOGIN USER OR NOT
    $scope.loggedIn = Auth.isLoggedIn();

     if ($scope.loggedIn && AuthToken.getToken()) {
      $scope.currentUser = $rootScope.globals.currentUser.data;
      $scope._id = $scope.currentUser.data._id;
      $scope.name = $scope.currentUser.data.name;
    }

    $scope.siteParamsId = $stateParams.id;

       //GET SPECIFIC SITE DATA BY ID
    $scope.view = function view(id) {
      SitesFactory.get({
        id: id
      }).$promise.then(function (response) {
          $scope.site = response;
          // if (!$scope.site._id) {
          //   $state.go('app.dashboard.404');
          // }

        }, function (err) {
          console.log(err);
          $state.go('app.dashboard.404');
        });
    };

    
    $scope.view($scope.siteParamsId);
            //ADD POST IN SPECIFIC SITE

    $scope.addPost = function (siteId) {
      var postInformation = {
        postContent: $scope.postContent
      };
      if (siteId) {
          var promisePost = SitesBlogFactory.addPost(siteId, postInformation);
          promisePost.then(function () {
            $scope.postContent='';
          }, function (err) {
            console.log(err);
          });
        
      }

    };
        //ADD COMMENT IN SPECIFIC SITE AND POST
    $scope.addComment = function (siteId, postId) {

      var commentInformation = {
        commentContent: $scope.site[postId]
      };
      if (siteId) {

          var promiseComment = SitesBlogFactory.addComment(siteId, postId, commentInformation);
          promiseComment.then(function (response) {
            $scope.site[postId]='';
            $scope.view($scope.siteParamsId);
            var notificationobj = {};
            notificationobj.messsage = $scope.name + ' comment on a post';
            notificationobj.siteId = siteId;
            notificationobj.postId = postId;
            notificationobj.userId = response.data.notificationlist;

            socket.emit('send-comment-notification', notificationobj); //DATA BROADCAST TO THE SERVER AND SERVER SEND BACK NOTIFICATION IN SPECIFIC CLIENT THAT ARE RELATED TO THE SPECIFIC POST
          }, function (err) {
            console.log(err);
            $state.go('app.dashboard.404');
          });

      }

    };
        //POST DELETE
    $scope.postDelete = function (siteId, postId) {
      SitesBlogFactory.deletePost(siteId, postId).then(function () {
        $scope.view($scope.siteParamsId);
      });

    };
        //COMMENT DELETE
    $scope.commentDelete = function (siteId, postId, commentId) {
      SitesBlogFactory.deleteComment(siteId, postId, commentId).then(function () {
         $scope.view($scope.siteParamsId);
      });

    };

       //POST EDIT
    $scope.postEdit = function (siteId, postId) {
      var post = {
        postContent: $scope.postEditContent,
      };

      SitesBlogFactory.editPost(siteId, postId, post).then(function () {
        
         angular.element('#posteditModal').modal('hide');
         $scope.view($scope.siteParamsId);
      });

    };    
       //COMMENT EDIT
    $scope.commentEdit = function (siteId, postId, commentId) {
      var comment = {
        commentContent: $scope.commentEditContent,
      };

      SitesBlogFactory.editComment(siteId, postId, commentId, comment).then(function () {
         $scope.view($scope.siteParamsId);
        angular.element('#commenteditModal').modal('hide');
      });

    };


      //SHOW POST-EDIT-MODAL WHEN CLICK POST EDIT ICON
    $scope.postEditmodal = function (siteId, postId, post) {
      $scope.postEditContent = post;
      $scope.siteIdForPostEdit = siteId;
      $scope.postIdForPostEdit = postId;
    };


     //SHOW COMMENT-EDIT-MODAL WHEN CLICK EDIT ICON
    $scope.commentEditmodal = function (siteId, postId, commentId, comment) {
      $scope.commentEditContent = comment;
      $scope.siteIdForCommentEdit = siteId;
      $scope.postIdForCommentEdit = postId;
      $scope.commentIdForCommentEdit = commentId;
    };


    socket.on('actionBlogPostComment', function () {
       $scope.view($scope.siteParamsId);
    });


  }]);
