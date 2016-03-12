 'use strict';

/**
 * @ngdoc function
 * @name telecomApp.service:authService
 * @description
 * # MainCtrl
 * Controller of the telecomApp
 */
angular.module('telecomApp')
 .directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }])
  .directive('csvReader', [
    function () {
      // Function to convert to JSON
      var convertToJSON = function (content) {
        // Declare our variables
        var lines = content.csv.split(
            '\n'),
          headers = lines[0].split(
            content.separator),
          columnCount = lines[0].split(
            content.separator).length,
          results = [];
        // For each row
        for (var i = 1; i < lines.length -
        1; i++) {
          // Declare an object
          var obj = {};
          // Get our current line
          var line = lines[i].split(
            new RegExp(content.separator +
              '(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'
            ));
          // For each header
          for (var j = 0; j <
          headers.length; j++) {
            // Populate our object
            obj[headers[j].replace(/(?:\\[rn]|[\r\n]+)+/g, "")] = line[
              j].replace(/(?:\\[rn]|[\r\n]+)+/g, "");
          }
          // Push our object to our result array
          results.push(obj);
        }
        // Return our array
        return results;
      };
      return {
        restrict: 'A',
        scope: {
          results: '=',
          separator: '=',
          callback: '&saveResultsCallback'
        },
        link: function (scope, element,
                        attrs) {
          // Create our data model
          var data = {
            csv: null,
            separator: scope.separator ||
            ','
          };
          // When the file input changes
          element.on('change',
            function (e) {
              // Get our files
              var files = e.target
                .files;
              // If we have some files
              if (files && files.length) {
                // Create our fileReader and get our file
                var reader = new FileReader();
                var file = (e.srcElement ||
                e.target).files[
                  0];
                // Once the fileReader has loaded
                reader.onload =
                  function (e) {
                    // Get the contents of the reader
                    var contents =
                      e.target.result;
                    // Set our contents to our data model
                    data.csv =
                      contents;
                    // Apply to the scope
                    scope.$apply(
                      function () {
                        // Our data after it has been converted to JSON
                        scope.results =
                          convertToJSON(
                            data
                          );
                        // Call our callback function
                        scope.callback(
                          scope
                            .result
                        );
                      });
                  };
                // Read our file contents
                reader.readAsText(
                  file);
              }
            });
        }
      };
    }
  ])
  .directive('ngReallyClick', ['$uibModal',
    function ($uibModal) {

      var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
        $scope.ok = function () {
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      };

      return {
        restrict: 'A',
        scope: {
          ngReallyClick: "&"
        },
        link: function (scope, element, attrs) {
          element.bind('click', function () {
            var message = attrs.ngReallyMessage || "Are you sure ?";

            var modalHtml = '<div class="modal-body">' + message + '</div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

            var modalInstance = $uibModal.open({
              template: modalHtml,
              controller: ModalInstanceCtrl
            });

            modalInstance.result.then(function () {
              scope.ngReallyClick();
            }, function () {
              //Modal dismissed
            });

          });

        }
      }
    }
  ]).
directive('validFile',function(){
  return {
    require:'ngModel',
    link:function(scope,el,attrs,ngModel){
      //change event is fired when file is selected
      el.bind('change',function(){
        scope.$apply(function(){
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        })
      })
    }
  }
});