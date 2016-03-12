'use strict';
/**
 * @ngdoc function
 * @name telecomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
  .controller('SitesController', ['$scope', 'SitesFactory', 'socket', 'Auth', 'AuthToken', 'AuthInterceptor', '$rootScope', '$location', 'UserFactory', 'SitesBlogFactory', '$state', '$stateParams', 'filterFilter', function ($scope, SitesFactory, socket, Auth, AuthToken, AuthInterceptor, $rootScope, $location, UserFactory, SitesBlogFactory, $state, $stateParams, filterFilter) {


         ////CHECK LOGIN USER OR NOT
    $scope.loggedIn = Auth.isLoggedIn();

     if ($scope.loggedIn && AuthToken.getToken()) {
      $scope.currentUser = $rootScope.globals.currentUser.data;
      $scope._id = $scope.currentUser.data._id;
      $scope.role = $scope.currentUser.data.role;
      $scope.name = $scope.currentUser.data.name;

    } else {
      $state.go('app.login');
    }
     //GET ALL SITE LIST AND SHOW IN TABLE

    $scope.get = function () {

      // body...
      $scope.$watch('search', function (newVal) {
        SitesFactory.query().$promise.then(function (response) {
          $scope.sites = response;
          $scope.filtered = filterFilter($scope.sites, newVal);
        }, function (err) {
          console.log(err);
        });


      });
    };
        //GET SITE DATA WHEN EDIT
    $scope.view = function view(id, isNewRecord) {
      $scope.site1 = {};
      SitesFactory.get({
        id: id
      }).$promise.then(function (response) {
          $scope.site = response;
          $scope.IsNewRecord = 0;
          $scope.site['IsNewRecord'] = isNewRecord;
          return $scope.site;
        }, function (err) {
          console.log(err);
        });
    };

         //SITE DELETE ACTION
    $scope.delete = function (id) {
      SitesFactory.delete({
        id: id
      }).$promise.then(function () {
          $scope.actionMessage = 'Delete Succesfully';
        }, function (err) {
          console.log(err);
        });
    };   

//////SITE ADD AND EDIT ACTION
    $scope.add = function (id, isNewRecord) {
      var information = {
        assignedTo: ($scope.site.assignedTo===""|| $scope.site.assignedTo==='undefined')?undefined:$scope.site.assignedTo,
        siteName: $scope.site.siteName,
        siteCode: $scope.site.siteCode,
        e1Code: $scope.site.e1Code,
        bsc: $scope.site.bsc,
        description: $scope.site.description,
        status: $scope.site.status
      };

      var flag = true;
           //SITE FORM VALIDATION & CORSSPONDING MESSAGE
      $scope.error = [];
      if ($scope.site.siteName && !$scope.site.siteName.match(/^[a-zA-Z0-9-_ ]{3,15}$/)) {
        flag = false;
        $scope.error.push('Site Name error it should be 3-15 letter');
      }
      if ($scope.site.siteCode && !$scope.site.siteCode.match(/^[a-zA-Z0-9-_ ]{3,15}$/)) {
        flag = false;
        $scope.error.push('Site Code error it should be 3-15 letter');
      }
      if ($scope.site.e1Code && !$scope.site.e1Code.match(/^[a-zA-Z0-9-_ ]{3,15}$/)) {
        flag = false;
        $scope.error.push('E1 Code error it should be 3-15 letter');
      }
      if (!$scope.site.bsc) {
        flag = false;
        $scope.error.push('BSC required');
      }
      if (flag) {
        if (id && isNewRecord === 0) {
          information['assignedBy'] = id;
          var promisePut = SitesFactory.update({
            id: id
          }, information);
          promisePut.$promise.then(function () {
            if (typeof $scope.site.assignedTo === 'string') {
              var flag = 1;
                            //START OF SEND NOTIFICATION TO THE SPECIFIC USER THAT HAVE ASSIGNED JOB 
              socket.emit('send-job-notification', {
                messsage: $scope.name + ' edit a job recently that have assigned to you1',
                jobId: id,
                userId: $scope.site.assignedTo
              });
            }
            if ($scope.site.assignedTo && $scope.site.assignedTo._id) {

              if (flag !== 1) {

                socket.emit('send-job-notification', {
                  messsage: $scope.name + ' edit a job recently that have assigned to you2',
                  jobId: id,
                  userId: $scope.site.assignedTo._id
                });

              }
              //END OF SEND NOTIFICATION TO THE SPECIFIC USER THAT HAVE ASSIGNED JOB 
            }

            $scope.actionMessage = 'Edit Succesfully';
            angular.element('#myModal').modal('hide');

          }, function (err) {
            console.log(err);
          });
        } else {
          console.log(information);
          var promisePost = SitesFactory.post(information);
          promisePost.$promise.then(function (response) {
            console.log(response);
            var notifiId = response.data._id;
            var userId = $scope.site.assignedTo;
             
            $scope.actionMessage = 'Save Succesfully';
            $scope.resetmodal();

                    //START OF SEND NOTIFICATION TO THE SPECIFIC USER THAT HAVE ASSIGNED JOB WHEN SAVE SITE

            socket.emit('send-job-notification', {
              messsage: $scope.name + '(admin) assigned a new job to you',
              jobId: notifiId,
              userId: userId
            });

            angular.element('#myModal').modal('hide');

          }, function (err) {
            console.log(err);
          });

        }
      }
      else {
        console.log('Form Validation required');
      }

    };    

  //GET ALL USER DATA THAT NEED IN SITE ADD AND EDIT SECTION "ASSIGNED TO"
    UserFactory.query().$promise.then(function (response) {
      $scope.users = response;
      $scope.selectedusers = [];
      for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i].role === 'User') {
          $scope.selectedusers.push($scope.users[i]);
        }

      }
      $scope.users = $scope.selectedusers;

    }, function (err) {
      console.log(err);
    });


      ///PAGINATION SETTING
    $scope.currentPage = 1;
    $scope.pageSize = 20;



      //RESET MODAL AFTER ADD SITE BUTTON
    $scope.resetmodal = function () {
      $scope.site = [];
      $scope.site.IsNewRecord = 1;
      $scope.errorMessage='';
    };

    //REFRESH PAGE FIRST TIME
    $scope.get();

    //CSV HEADER FOR EXPORT

    $scope.getCsvheader = function getheader() {
      // body...
      return ['siteName', 'siteCode', 'e1Code', 'bsc', 'assignedBy', 'assignedTo'];
    };

          //DATA EXPORT
    $scope.csvSiteDatagetArray = function () {
      var CsvData = [];
      if ($scope.checkBoxSelection().length > 0) {
        $scope.checkboxData = $scope.checkBoxSelection();

        for (var j = 0; j < $scope.checkboxData.length; j++) {
          for (var i = 0; i < $scope.sites.length; i++) {
            if ($scope.checkboxData[j] === $scope.sites[i]._id) {
              var item = $scope.sites[i];
              CsvData.push({
                'siteName': item.siteName,
                'siteCode': item.siteCode,
                'e1Code': item.e1Code,
                'bsc': (item.bsc) ? item.bsc : '',
                'assignedBy': (item.assignedBy) ? item.assignedBy.name : '',
                'assignedTo': (item.assignedTo) ? item.assignedTo.name : ''
              });
            }
          }
        }
      } else {
        for (var ja = 0; ja < $scope.sites.length; ja++) {
          var itemOne = $scope.sites[ja];
          CsvData.push({
            'siteName': itemOne.siteName,
            'siteCode': itemOne.siteCode,
            'e1Code': itemOne.e1Code,
            'bsc': (itemOne.bsc) ? itemOne.bsc : '',
            'assignedBy': (itemOne.assignedBy) ? itemOne.assignedBy.name : '',
            'assignedTo': (itemOne.assignedTo) ? itemOne.assignedTo.name : ''

          });
        }
      }


      return CsvData;
    };


     //IMPORT ACTION
    $scope.importResults = [];
    $scope.importData = function () {
      console.log($scope.importResults);
      if ($scope.importResults[0].siteName && $scope.importResults[0].siteCode) {
        $scope.validateData = [];
        $scope.invalidData = [];
        $scope.errorpanel = false;
        $scope.successMessage = false;
        var charRegex = /^[a-zA-Z0-9-_ ]{3,15}$/;
        for (var i = 0; i < $scope.importResults.length; i++) {
          var importResult = $scope.importResults[i];
          ///CHECK THAT ARRAY THAT MUST BE CONSIST OF siteName and siteCode
          if (importResult.siteName.match(charRegex) && importResult.siteCode.match(charRegex)) {
            $scope.validateData.push(importResult);
          } else {
            importResult.Remarks = 'Not Import data please check siteCode,siteName,e1Code,it must be 3-15 letter';
            $scope.invalidData.push(importResult);
          }


        }
        if ($scope.validateData.length > 0) {
          SitesBlogFactory.import($scope.validateData).then(function () {
            $scope.actionMessage = $scope.validateData.length + ' data import succesfully';
            angular.element('#importModal').modal('hide');
          }, function (err) {
            console.log(err);
            $scope.errorMessage = 'Import not done,please try again';
          });

        }else{
            $scope.errorMessage = 'Import not done,please try again';
        }

        if ($scope.invalidData.length > 0) {
          $scope.csvError = true;
        }

           
      }else{
        $scope.errorMessage = 'Not Import, data must be csv header siteCode,siteName,e1Code,bsc and it must be 3-15 letter';
      }
      angular.element("input[type='file']").val(null);
    };

            //GET INVALID HEADER THAT NEED TO SHOW  
    $scope.getInvalidHeader = function () {
      $scope.objectHeaders = [];
      for (var property in $scope.invalidData[0]) {
        $scope.objectHeaders.push(property);
      }
      return $scope.objectHeaders;
    };
    $scope.selection = [];

    $scope.afterCheckboxButton = true;
    $scope.buttonExtendedName = 'all';
    // checkbox selection for a given site
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

        //AFTER CHECK CHECKBOX
      if ($scope.selection.length > 0) {
        $scope.afterCheckboxButton = false;
        $scope.buttonExtendedName = 'selected item';
      } else {

        $scope.afterCheckboxButton = true;
        $scope.buttonExtendedName = 'all';
      }

      return $scope.selection;
    };


        //DELETE SELECTED ITEM

    $scope.deleteSelectedItem = function () {

      SitesBlogFactory.multipledelete($scope.checkBoxSelection()).then(function () {
        $scope.actionMessage = 'Multiple delete done';
      }, function () {
        $scope.errorMessage = 'Multiple delete not done,please try again';
      });


    };

//SOCKET ACTION: WHEN ADD SITE IN ANY USER FROM ANY TERMINAL AND IT UPDATE ON ALL CONNECTED BROWSER
    socket.on('siteAction:add', function (response) {
      $scope.site = response.data;
      $scope.sites.push($scope.site);

    });
//SOCKET ACTION: WHEN EDIT SITE IN ANY USER FROM ANY TERMINAL AND IT UPDATE ON ALL CONNECTED BROWSER    
    socket.on('siteAction:edit', function (data) {
      var item = data.site;
      var id = item[0]._id;
      angular.element('tr#' + id + ' td.e1Code').html('<a href="#/dashboard/site/' + item[0]._id + '">' + item[0].e1Code + '</a>');
      angular.element('tr#' + id + ' td.siteName').text(item[0].siteName);
      angular.element('tr#' + id + ' td.bsc').text(item[0].bsc);
      angular.element('tr#' + id + ' td.assigned_by_name').html('<a href="#/dashboard/profile/' + item[0].assignedBy._id + '">' + item[0].assignedBy.name + '</a>');
      if (item[0].assignedTo) {

        angular.element('tr#' + id + ' td.assigned_to_name').html('<a href="#/dashboard/profile/' + item[0].assignedTo._id + '">' + item[0].assignedTo.name + '</a>');

      }

      angular.element('tr#' + id + ' td.status').text(item[0].status);
      if (item[0].status === 1) {
        angular.element('tr#' + id + ' td.status').html('<span id="plan" class="badge bg-purple">Plan</span>');
      }

      if (item[0].status === 2) {
        angular.element('tr#' + id + ' td.status').html('<span id="implementation" class="badge bg-blue">Implementation</span>');
      }
      if (item[0].status === 3) {
        angular.element('tr#' + id + ' td.status').html('<span id="complete" class="badge bg-green">Complete</span>');
      }
      if (item[0].status === 4) {
        angular.element('tr#' + id + ' td.status').html('<span id="hault" class="badge bg-red">Hault</span>');
      }


    });
//SOCKET ACTION: WHEN DELETE SITE IN ANY USER FROM ANY TERMINAL AND IT UPDATE ON ALL CONNECTED BROWSER   
    socket.on('siteAction:delete', function (data) {
      var whatIndex = null;
      angular.forEach($scope.sites, function (cb, index) {
        if (cb._id === data.data) {
          whatIndex = index;
          $scope.sites.splice(whatIndex, 1);
        }
      });


    });
//SOCKET ACTION: WHEN IMPORT SITE IN ANY USER FROM ANY TERMINAL AND IT UPDATE ON ALL CONNECTED BROWSER   

    socket.on('siteAction:import', function () {
      $scope.get();

    });

//SOCKET ACTION: WHEN MULTIPLE  SITE DELETE IN ANY USER FROM ANY TERMINAL AND IT UPDATE ON ALL CONNECTED BROWSER   
    socket.on('siteAction:multipleDelete', function (response) {
      var whatIndex = null;
      for (var i = 0; i <= response.data.length; i++) {
        angular.forEach($scope.sites, function (cb, index) {
          if (cb._id === response.data[i]) {
            whatIndex = index;
            $scope.sites.splice(whatIndex, 1);
          }
        });
      }


    });


  }]);
