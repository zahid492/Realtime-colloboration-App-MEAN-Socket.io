'use strict';

/**
 * @ngdoc function
 * @name telecomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
  .controller('UserProfileController', function ($scope, Auth, AuthToken, AuthInterceptor, $rootScope, $location, $cookieStore, ProfileFactory, $stateParams, SitesBlogFactory, socket,$state) {

//CHECK USER LOGIN OR NOT

    $scope.loggedIn = Auth.isLoggedIn();

     if ($scope.loggedIn && AuthToken.getToken()) {
      $scope.currentUser = $rootScope.globals.currentUser.data;
      $scope._id = $scope.currentUser.data._id;
      $scope.name = $scope.currentUser.data.name;

    }
    else {
      $state.go('app.login');
    }

    //GET SPECIFIC USER DATA 

    $scope.userId = $stateParams.id;
    $scope.prodfileData = function (id) {
      ProfileFactory.getProfilepost(id).then(function (response) {
        $scope.profilepost = response.data;
      }, function (err) {
        console.log(err);
      });
      // body...
    };

    $scope.prodfileData($scope.userId);


          //ADD COMMENT ACTION IN PROFILE PAGE

    $scope.site = [];
    $scope.addComment = function (siteId, postId) {

      var commentInformation = {
        commentContent: $scope.site[postId]
      };
      if (siteId) {

          var promiseComment = SitesBlogFactory.addComment(siteId, postId, commentInformation);
          promiseComment.then(function (response) {
            $scope.Message = 'Save Succesfully';
            $scope.site[postId]='';
            var notificationobj = {};
            notificationobj.messsage = $scope.name + ' comment on a post';
            notificationobj.siteId = siteId;
            notificationobj.postId = postId;
            notificationobj.userId = response.data.notificationlist;

            socket.emit('send-comment-notification', notificationobj); //DATA BROADCAST TO THE SERVER AND SERVER SEND BACK NOTIFICATION IN SPECIFIC CLIENT THAT ARE RELATED TO THE SPECIFIC POST
          }, function (err) {
            console.log(err);
          });
        
      }


    };


             //UPLOAD PROFILE PICTURE 

    $scope.uploadProfilePicture = function () {
      var file = $scope.myFile;
      console.log(file);
      if(file.type==='image/jpeg' || file.type==='image/jpg' || file.type==='image/png'  ){

      ProfileFactory.uploadFileToUrl(file, $scope._id);
      angular.element('input[type="file"]').val(null);

      }else{
         $scope.errorMessage='File Type Error';
      }
    };
    $scope.resetModal=function() {
      $scope.errorMessage='';
    };

        //CHANGE PASSWORD
    $scope.changePassword = function () {

      // // body...
      if ($scope.currentPassword && $scope.newPassword && $scope.confirmNewPassword) {
        if ($scope.newPassword === $scope.confirmNewPassword) {
          var passwordObj = {
            currentPassword: $scope.currentPassword,
            newPassword: $scope.newPassword,
            confirmNewPassword: $scope.confirmNewPassword
          };

          ProfileFactory.changePassword(passwordObj, $scope._id).then(function(response) {
          $scope.passwordErrorMessage=response.data.message;
            // body...
          });


        }
        else {
          $scope.passwordErrorMessage='Error in Update password';
        }

      }
    };


   //POST DELETE

    $scope.postDelete = function (siteId, postId) {
      SitesBlogFactory.deletePost(siteId, postId).then(function () {
            $scope.prodfileData($scope.userId);
      });

    };
     //COMMENT DELETE
    $scope.commentDelete = function (siteId, postId, commentId) {

      SitesBlogFactory.deleteComment(siteId, postId, commentId).then(function () {
     $scope.prodfileData($scope.userId);
      });

    };
        //COMMENT EDIT
    $scope.commentEdit = function (siteId, postId, commentId) {

      var comment = {
        commentContent: $scope.commentEditContent,
      };

      SitesBlogFactory.editComment(siteId, postId, commentId, comment).then(function () {
        angular.element('#commenteditModal').modal('hide');
    $scope.prodfileData($scope.userId);
      });

    };
     //POST EDIT
    $scope.postEdit = function (siteId, postId) {
      var post = {
        postContent: $scope.postEditContent,
      };

      SitesBlogFactory.editPost(siteId, postId, post).then(function () {
    $scope.prodfileData($scope.userId);
        angular.element('#posteditModal').modal('hide');
      });

    };


    //COMMENT EDIT MODAL
    $scope.commentEditmodal = function (siteId, postId, commentId, comment) {
      $scope.commentEditContent = comment;
      $scope.siteIdForCommentEdit = siteId;
      $scope.postIdForCommentEdit = postId;
      $scope.commentIdForCommentEdit = commentId;

    };
//POST EDIT MODAL
    $scope.postEditmodal = function (siteId, postId, post) {
      $scope.postEditContent = post;
      $scope.siteIdForPostEdit = siteId;
      $scope.postIdForPostEdit = postId;
    };

//SOCKET ACTION WHEN ANY USER POST AND COMMENT
    socket.on('actionBlogPostComment', function () {
    $scope.prodfileData($scope.userId);

    });
 //SOCKET ACTION WHEN USER CHANGE PROFILE PICTURE   
    socket.on('ChangeprofilePictureAction', function () {
    $scope.prodfileData($scope.userId); 

    });
  });
