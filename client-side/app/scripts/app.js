'use strict';

/**
 * @ngdoc overview
 * @name telecomApp
 * @description
 * # telecomApp
 *
 * Main module of the application.
 */
var telecomApp = angular
  .module('telecomApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngSanitize', 'ngCookies', 'angularUtils.directives.dirPagination','ngCsv', 'ngMessages', 'ui-notification', 'ngAnimate', 'chart.js', 'angularMoment', 'btford.socket-io']); 
telecomApp.constant('apiUrl', 'http://localhost:8080/api/');
telecomApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', 'NotificationProvider',
  function ($httpProvider, $stateProvider, $urlRouterProvider, NotificationProvider) {

    $stateProvider
      .state('app', {
        template: '<ui-view/>'
      })
      .state('app.login', {
        url: '/login',
        templateUrl: '../views/login.html',
        controller: 'LoginController'
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: '../views/dashboard.html',
      })
      .state('app.dashboard.chat', {
        url: '/chat',
        templateUrl: '../views/chat.html',
      })
      .state('app.dashboard.users', {
        url: '/users',
        templateUrl: '../views/users.html',
        controller: 'UsersController',
        data: {pageTitle: 'User Manager'}
      })
      .state('app.dashboard.sites', {
        url: '/sites',
        templateUrl: '../views/sites.html',
        controller: 'SitesController',
        data: {pageTitle: 'Site Manager'}
      })
      .state('app.dashboard.home', {
        url: '/home',
        templateUrl: '../views/home.html',
        controller: 'HomeController',
        data: {pageTitle: 'Home'}
      })
      .state('app.dashboard.site', {
        url: '/site/:id',
        templateUrl: '../views/site.html',
        controller: 'SiteController',
        data: {pageTitle: 'Site Manager'}

      }).
      state('app.dashboard.member', {
        url: '/member',
        templateUrl: '../views/member.html',
        controller: 'MemberController',
        data: {pageTitle: 'Member'}

      }).
      state('app.dashboard.profile', {
        url: '/profile/:id',
        templateUrl: '../views/profile.html',
        controller: 'UserProfileController',
        data: {pageTitle: 'Profile'}

      }).
      state('app.dashboard.404', {
        url: '/404',
        templateUrl: '../views/404.html',
        data: {pageTitle: '404'}

      });

    $urlRouterProvider.otherwise('/dashboard/sites');

    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.defaults.useXDomain = true;


    NotificationProvider.setOptions({
      delay: 10000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'left',
      positionY: 'bottom'
    });
  }
])


  .run(['$rootScope', '$location', '$http', 'Auth', '$cookieStore', '$state', '$stateParams',
    function ($rootScope, $location, $http, Auth, $cookieStore, $state, $stateParams) {
      // keep user logged in after page refresh


      $rootScope.globals = $cookieStore.get('globals') || {};
      // //console.log($rootScope.globals.currentUser.username);
      if (!$rootScope.globals.currentUser) {
        $location.path('/login');

      }
      $rootScope.showgraphSidebar = false;
      $rootScope.sidebar = function () {
        $rootScope.showgraphSidebar = !$rootScope.showgraphSidebar;
      };
      $rootScope.$on('$locationChangeStart', function (event, next, current) {

        var loggedIn = Auth.isLoggedIn();


        if ($location.path() !== '/login' && loggedIn === false) {
          $location.path('/login');
        }

      });


      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;


    }])

  .directive('scrollTo', function ($location, $anchorScroll) {
    return function (scope, element, attrs) {

      element.bind('click', function (event) {
        event.stopPropagation();
        var off = scope.$on('$locationChangeStart', function (ev) {
          off();
          ev.preventDefault();
        });
        var location = attrs.scrollTo;
        $location.hash(location);
        $anchorScroll();
      });

    };
  });
