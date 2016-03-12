'use strict';

/**
 * @ngdoc function
 * @name telecomApp.service:authService
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
  .factory('Auth', function ($http, $q, AuthToken,apiUrl,$window,$cookieStore) {


    var authFactory = {};


    authFactory.login = function (username, password) {

      return $http.post(apiUrl+'login', {
        username: username,
        password: password
      })
        .success(function (data) {
          AuthToken.setToken(data.token);
          return data;
        });
    };

    authFactory.logout = function () {
      AuthToken.setToken();
    };

    authFactory.isLoggedIn = function () {
      if (AuthToken.getToken())
        return true;
      else
        return false;
    };

    return authFactory;

  })
  .factory('AuthToken', function ($window, $rootScope, $cookieStore) {

    var authTokenFactory = {};

    authTokenFactory.getToken = function () {
      return $window.localStorage.getItem('token');
    };

    authTokenFactory.setToken = function (token) {

      if (token) {
        $window.localStorage.setItem('token', token);
      }
      else {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $window.localStorage.removeItem('token');
      }


    };

    return authTokenFactory;

  })
  .factory('AuthInterceptor', function ($q, $location, AuthToken) {

    var interceptorFactory = {};


    interceptorFactory.request = function (config) {

      var token = AuthToken.getToken();

      if (token) {

        config.headers['x-access-token'] = token;

      }

      return config;

    };


    return interceptorFactory;
  });
