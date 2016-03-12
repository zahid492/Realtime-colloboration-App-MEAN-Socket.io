'use strict';
/**
 * @ngdoc function
 * @name telecomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp').controller('UsersController', ['$scope', 'SitesFactory', 'socket', 'Auth', 'AuthToken', 'AuthInterceptor', '$rootScope', '$location', 'UserFactory', 'SitesBlogFactory', 'filterFilter', function ($scope, SitesFactory, socket, Auth, AuthToken, AuthInterceptor, $rootScope, $location, UserFactory, SitesBlogFactory, filterFilter) {


  $scope.loggedIn = Auth.isLoggedIn();

   if ($scope.loggedIn && AuthToken.getToken()) {
    $scope.currentUser = $rootScope.globals.currentUser.data;
    $scope._id = $scope.currentUser.data._id;
    $scope.role = $scope.currentUser.data.role;

  } else {
    $scope.doLogout();
  }
      //GET ALL USER

  $scope.get = function () {
    $scope.$watch('search', function (newVal) {
      UserFactory.query().$promise.then(function (response) {
        $scope.users = response;
        $scope.filtered = filterFilter($scope.users, newVal);
      }, function (err) {
        console.log(err);
      });
    });
  };
   //ADD AND EDIT FUNCTION
  $scope.add = function (id, isNewRecord) {
    var information = {
      name: $scope.user.name,
      username: $scope.user.username,
      password: $scope.user.password,
      role: $scope.user.role,
      designation: $scope.user.designation,
      status: $scope.user.status
    };

    var flag = true;
    $scope.error = [];
    if ($scope.user.name && !$scope.user.name.match(/^[a-zA-Z0-9-_ ]{3,40}$/)) {
      flag = false;
      $scope.error.push('Name error it should be 3-40 letter');
    }
    if ($scope.user.username && !$scope.user.username.match(/^[a-zA-Z0-9-_ ]{3,15}$/)) {
      flag = false;
      $scope.error.push('Username error it should be 3-15 letter');
    }

    SitesBlogFactory.checkUsername($scope.user.username).then(function (data) {

      if (flag) {
        if (id && isNewRecord === 0) {
          var promisePut = UserFactory.update({
            id: id
          }, information);
          promisePut.$promise.then(function () {

            $scope.actionMessage = 'Edit Succesfully';
            angular.element('#myModal').modal('hide');

          }, function (err) {
            console.log(err);
          });
        } else {
          if ($scope.user.password === $scope.user.confirmPassword) {
            if (data === 0) {
              var promisePost = UserFactory.post(information);
              promisePost.$promise.then(function () {
                $scope.actionMessage = 'Save Succesfully';
                $scope.resetmodal();


                angular.element('#myModal').modal('hide');

              }, function (err) {
                console.log(err);
              });

            } else {
              $scope.error.push('Username  Exist');
            }

          } else {
            $scope.error.push('Password does not match');
          }


        }
      }
      else {
        console.log('Form Validation Error');
      }
    });


  };
//VIEW SINGLE USER
  $scope.passwordRequired = true;
  $scope.view = function view(id, isNewRecord) {
    UserFactory.get({
      id: id
    }).$promise.then(function (response) {
        $scope.user = response;
        $scope.IsNewRecord = 0;
        $scope.passwordRequired = false;
        $scope.user['IsNewRecord'] = isNewRecord;
        console.log($scope.user);
        return $scope.user;
      }, function (err) {
         console.log(err);
      });
  };
//DELETE SINGLE USER
  $scope.delete = function (id) {
    UserFactory.delete({
      id: id
    }).$promise.then(function () {
        $scope.actionMessage = 'Delete Succesfully';
      }, function (err) {
        console.log(err);
      });
  };
  $scope.currentPage = 1;
  $scope.pageSize = 20;


  $scope.resetmodal = function () {
    $scope.user = [];
    $scope.IsNewRecord = 1;
    $scope.user.IsNewRecord = 1;
  };
  $scope.get();

     //CSV HEADER
  $scope.getheader = function getheader() {
    return ['name', 'username', 'role', 'designation'];
  };
   //CSV EXPORT
  $scope.csvDatagetArray = function () {
    var CsvData = [];
    if ($scope.checkBoxSelection().length > 0) {
      $scope.checkboxData = $scope.checkBoxSelection();

      for (var j = 0; j < $scope.checkboxData.length; j++) {
        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.checkboxData[j] === $scope.users[i]._id) {
            var item = $scope.users[i];
            CsvData.push({
              'name': item.name,
              'username': item.username,
              'role': item.role,
              'designation': (item.designation) ? item.designation : ''
            });
          }
        }
      }
    } else {
      for (var ja = 0; ja < $scope.users.length; ja++) {
        var itemOne = $scope.users[ja];
        CsvData.push({
          'name': itemOne.name,
          'username': itemOne.username,
          'role': itemOne.role,
          'designation': (itemOne.designation) ? itemOne.designation : ''

        });
      }
    }


    return CsvData;
  };




  $scope.selection = [];
  $scope.afterCheckboxButton = true;
  $scope.buttonExtendedName = 'all';
  // CHECKBOX SELECTION

  $scope.checkBoxSelection = function checkBoxSelection(id) {
    var idx = $scope.selection.indexOf(id);
    // is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }
    // is newly selected
    else {
      if (id !== undefined) {
        $scope.selection.push(id);
      }

    }
    if ($scope.selection.length > 0) {
      $scope.afterCheckboxButton = false;
      $scope.buttonExtendedName = 'selected item';
    } else {

      $scope.afterCheckboxButton = true;
      $scope.buttonExtendedName = 'all';
    }
    return $scope.selection;
  };
 //DELETE MULTIPLE SELECTED ITEM

  $scope.deleteSelectedItem = function () {

    SitesBlogFactory.multipleuserdelete($scope.checkBoxSelection()).then(function (response) {
      $scope.errorMessage = response;
      $scope.actionMessage = 'Delete selected user done';
    });


  };

/////////SOCKET ACTION FOR ADD/EDIT/DELETE//////////////////////

  socket.on('userAction:add', function (response) {
    $scope.user = response.data;
    $scope.users.push($scope.user);

  });
  socket.on('userAction:edit', function (data) {
    var item = data.user;
    var id = item[0]._id;
    angular.element('tr#' + id + ' td.name').html('<a href="#/dashboard/user/' + item[0]._id + '">' + item[0].name + '</a>');
    angular.element('tr#' + id + ' td.username').text(item[0].username);
    angular.element('tr#' + id + ' td.role').text(item[0].role);
    angular.element('tr#' + id + ' td.designation').text(item[0].designation);

    angular.element('tr#' + id + ' td.status').text(item[0].status);
    if (item[0].status === 1) {
      angular.element('tr#' + id + ' td.status').html('<span id="plan" class="badge bg-purple">Active</span>');
    }
    if (item[0].status === 2) {
      angular.element('tr#' + id + ' td.status').html('<span id="implementation" class="badge bg-blue">Inactive</span>');
    }


  });
  socket.on('userAction:delete', function (data) {
    var whatIndex = null;
    angular.forEach($scope.users, function (cb, index) {
      if (cb._id === data.data) {

        whatIndex = index;
        $scope.users.splice(whatIndex, 1);
      }
    });


  });


  socket.on('userAction:multipleDelete', function (response) {
    var whatIndex = null;
    for (var i = 0; i <= response.data.length; i++) {
      angular.forEach($scope.users, function (cb, index) {
        if (cb._id === response.data[i]) {
          whatIndex = index;
          $scope.users.splice(whatIndex, 1);
        }
      });
    }


  });


}]);
