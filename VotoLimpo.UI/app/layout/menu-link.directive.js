(function () {
    'use strict';

    angular
        .module('app.layout')
        .directive('menuLink', menuLink);

    /* @ngInject */
    function menuLink() {
        // Item de menu tipo vinculo
        // Usage:
        //  <menu-link section="section" ng-if="section.type === 'link'"></menu-link>
        // Creates:
        //  <menu-link section="section" ng-if="section.type === 'link'"></menu-link>
        var directive = {
            scope: {
                section: '='
            },
            templateUrl: 'app/layout/menu-link.tmpl.html',
            link: link
        };

        return directive;

        function link($scope, $element, $attrs) {
            var controller = $element.parent().controller();
            $scope.isSelected = function () {
                return controller.isSelected($scope.section);
            };

            $scope.focusSection = function () {
                // set flag to be used later when
                // $locationChangeSuccess calls openPage()
                controller.autoFocusContent = true;
            };
        }
    }
})();