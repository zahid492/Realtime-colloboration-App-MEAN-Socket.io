'use strict';

/**
 * @ngdoc function
 * @name telecomApp.service:authService
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
  .factory('SitesFactory', function ($resource, apiUrl) {


    return $resource(apiUrl + 'site/:id', {
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
  })
  .factory('socket', function (socketFactory) {

    var myIoSocket = io.connect('http://localhost:8080/');

    var socket = socketFactory({
      ioSocket: myIoSocket
    });

    return socket;
  })
  .service('SitesBlogFactory', function ($http, apiUrl, $q) {
    this.import = function (importData) {
      var request = $http({
        method: 'post',
        url: apiUrl + 'site/import',
        data: importData
      });
      return request;
    };
    this.checkUsername = function (username) {
      var deferred = $q.defer();
      $http.get(apiUrl + 'user/username/' + username).then(function (response) {
        deferred.resolve(response.data.length);
        return response.data.length;
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;

    };
    this.multipledelete = function (multipledeleteData) {
      var request = $http({
        method: 'post',
        url: apiUrl + 'site/multipledelete',
        data: multipledeleteData
      });
      return request;
    };
    this.multipleuserdelete = function (multipledeleteData) {
      var request = $http({
        method: 'post',
        url: apiUrl + 'user/multipledelete',
        data: multipledeleteData
      });
      return request;
    };

    this.addPost = function (siteId, postInformations) {
      var request = $http({
        method: 'post',
        url: apiUrl + 'blog/' + siteId,
        data: postInformations
      });
      return request;
    };
    this.addComment = function (siteId, postId, commentInformation) {
      var request = $http({
        method: 'post',
        url: apiUrl + 'blog/' + siteId + '/' + postId + '/comment',
        data: commentInformation
      });
      return request;
    };
    this.deleteComment = function (siteId, postId, commentId) {
      var request = $http({
        method: 'delete',
        url: apiUrl + 'comment/' + siteId + '/' + postId + '/' + commentId,
      });
      return request;
    };
    this.editComment = function (siteId, postId, commentId, comment) {
      var request = $http({
        method: 'put',
        url: apiUrl + 'comment/' + siteId + '/' + postId + '/' + commentId,
        data: comment
      });
      return request;
    };
    this.editPost = function (siteId, postId, post) {
      var request = $http({
        method: 'put',
        url: apiUrl + 'post/' + siteId + '/' + postId,
        data: post
      });
      return request;
    };
    this.deletePost = function (siteId, postId) {
      var request = $http({
        method: 'delete',
        url: apiUrl + 'post/' + siteId + '/' + postId,
      });
      return request;
    };

  })
 .service('NotificationFactory', function ($http, apiUrl) {
      this.notification = function (id) {
      var request = $http({
        method: 'get',
        url: apiUrl + 'notification/' + id
      });
      return request;
    };
    this.readflagNotification = function (id) {
      var request = $http({
        method: 'put',
        url: apiUrl + 'notification/' + id
      });
      return request;
    };

 })
  .service('ProfileFactory', function ($http, apiUrl) {

    this.getProfilepost = function (userId) {
      var request = $http({
        method: 'get',
        url: apiUrl + 'profile/' + userId
      });
      return request;
    };
    this.uploadFileToUrl = function (file, id) {

      var uploadUrl = apiUrl + 'uploadpic/' + id;
      var fd = new FormData();
      fd.append('file', file);
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
        .success(function () {
          $('#myModal').modal('hide');
        })
        .error(function () {
        });
    };
    this.changePassword = function (objpassword, userId) {
      var request = $http({
        method: 'post',
        url: apiUrl + 'updatepassword/' + userId,
        data: objpassword
      });
      return request;
    };

  })

.service('StatisticsFactory', function ($http, apiUrl) {
    this.statistics = function () {
      var request = $http({
        method: 'get',
        url: apiUrl + 'statistics/summary/'
      });
      return request;
    };
  });
 