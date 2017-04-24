(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('watchTransform', watchTransform);


watchTransform.$inject = ['$rootScope'];
  /* @ngInject */
  function watchTransform($rootScope) {

    var directive = {
      link: link,
      restrict: 'A',
      scope: {}
    };

    return directive;

    function link(scope, element, attrs) {

      scope.$watch(function () {

        return element.css('transform');
      }, styleChangedCallBack,
        true);

      function styleChangedCallBack(newValue, oldValue) {
        
        if (newValue === 'matrix(1, 0, 0, 1, 0, -64)') {
          
          $rootScope.$broadcast('page-bar-visible', true);
        }
        else if(newValue=== 'matrix(1, 0, 0, 1, 0, 0)')
        {
          $rootScope.$broadcast('page-bar-visible', false);
        }

      }

    }
  }
})();
