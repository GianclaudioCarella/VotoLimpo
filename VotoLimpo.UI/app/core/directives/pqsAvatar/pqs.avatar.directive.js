(function () {
    'use strict';
    /*
        <pqs-avatar ng-hide="persona==null" pqs-avatar-data="{name: persona.Apellido }" class="large"></pqs-avatar>
        <pqs-avatar ng-hide="persona==null" pqs-avatar-data="{lastName:'Apellido',firstName:'Nombre' }" class="large"></pqs-avatar>
        <pqs-avatar ng-hide="persona==null" pqs-avatar-data="{displayInitials:'RB' }" class="large"></pqs-avatar>
    */
    angular.module('app.core')
        .directive('pqsAvatar', ["pqsAvatarService", function (avatarService) {
            var controller = function ($scope) {
                $scope.$watch('pqsAvatarData', function (pqsAvatarData) {
                    $scope.GenericAvatar = avatarService.getAvatar(pqsAvatarData);
                });
        };

        return {
            restrict: 'E',
            scope: {
                pqsAvatarData: '=pqsAvatarData'
            },
            templateUrl: 'app/core/directives/pqsAvatar/pqs.avatar.html',
            controller: controller
        };

    }]).factory("pqsAvatarService", function () {
        var avatarService = function (user) {
            var colorPalette = [
               '#1abc9c', '#2ecc71', '#3498db',
               '#9b59b6', '#34495e', '#16a085',
               '#27ae60', '#2980b9', '#8e44ad',
               '#2c3e50', '#f1c40f', '#e67e22',
               '#e74c3c', '#95a5a6', '#f39c12',
               '#d35400', '#c0392b', '#bdc3c7',
               '#7f8c8d'
            ];

            var i1 = '', i2 = '', nameArray = [];
            
            if (angular.isDefined(user.name)) {                     //solo nombre user:{name:'Nombre Apellido'} 
                i1 = angular.uppercase(user.name.charAt(0));
                nameArray = user.name.split(' ');
                if (nameArray.length > 1) {
                    i2 = angular.uppercase(nameArray[1].charAt(0));
                } else {
                    i2 = '';
                }
            } else if (angular.isDefined(user.firstName)) {         //nombre y apellido user:{lastName:'Apellido',firstName:'Nombre' } 
                i1 = angular.uppercase(user.firstName.charAt(0));
                nameArray = user.lastName.split(' ');
                if (nameArray.length > 2) {
                    i2 = nameArray[nameArray.length - 1].charAt(0);
                } else {
                    i2 = angular.uppercase(nameArray[0].charAt(0));
                }
            } else if (angular.isDefined(user.displayInitials)) {   //iniciales directamente  user:{displayInitials:'RB'} 
                i1 = user.displayInitials;
            }
            var initials = i1 + i2;

            var index = (initials || ' ').charCodeAt(0) - 65;

            if (index < 0) { index = 0; }

            var background = colorPalette[index % colorPalette.length];



            return { 'initials': initials, 'background': background };
        };
        return {
            getAvatar: avatarService
        };
    });

})();
