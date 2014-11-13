(function() {
  'use strict';

  // Sets the initial values for the scope
  function initScope($scope, $filter, $location, labs) {
    $scope.labTypeFilter = null;
    $scope.keys = {
      // keybinding to enable admin mode
      'a d m i n': $scope.toggleAdmin
    };
    $scope.labsTitle = 'All Apps';
    $scope.labs = labs;
    $scope.mostViewed = $filter('filter')(labs, {
      mostViewed: true
    });
    $scope.featured = $filter('filter')(labs, {
      featured: true
    });

    var search = $location.search();
    if (search && search.type) {
      $scope.labTypeFilter = search.type;
    }
    if ($scope.labTypeFilter) {
      $scope.filterLabs();
    }

  }

  function focusHack() {
    // Hack to clear focus from btn-group on uncheck
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  }

  angular.module('labsApp')
    .controller('LabsCtrl', function($scope, $filter, $location, $http, $preloaded) {
      var loaded_labs = $preloaded && $preloaded.labs;
      $scope.isAdmin = false;
      $scope.filterLabs = function() {
        var type = this.labTypeFilter;
        var search = {
          type: type || ''
        };
        if (type === null) {
          $scope.labsTitle = 'All';
          focusHack();
        } else {
          if (type === 'config') {
            $scope.labsTitle = 'Configuration';
          } else if (type === 'deploy') {
            $scope.labsTitle = 'Deployment';
          } else if (type === 'security') {
            $scope.labsTitle = 'Security';
          } else if (type === 'troubleshoot') {
            $scope.labsTitle = 'Troubleshooting';
          }
        }
        $location.replace();
        $location.search(search);
        $scope.labsTitle += ' Apps';
      };
      $scope.toggleAdmin = function() {
        if (!window.portal || !window.portal.user_info || !window.portal.user_info.authorized) {
          return false;
        }
        angular.element('body').toggleClass('admin');
        if ($scope.isAdmin) {
          return;
        }
        $http.jsonp('/services/user/status?jsoncallback=JSON_CALLBACK')
          .success(function(result) {
            $scope.isAdmin = (result.authorized && result.internal);
          });
      };
      $scope.updateLabs = function() {
        var labs = $scope.labs;
        if (this.labTypeFilter) {
          // Filtered labs - mixin featured and mostViewed
          labs = labs.concat($scope.featured, $scope.mostViewed);
        }
        $http.post('/labs/labs/', labs).success(function(labs) {
          loaded_labs = labs;
          initScope($scope, $filter, $location, labs);
        });
      };
      initScope($scope, $filter, $location, loaded_labs);
    });

})();
