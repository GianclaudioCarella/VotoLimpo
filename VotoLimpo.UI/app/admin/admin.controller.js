(function () {
    'use strict';

    angular
      .module('app.admin')
      .controller('AdminController', AdminController);

    AdminController.$inject = ['$interval', '$filter', 'logger', 'dataservice'];
    /* @ngInject */
    function AdminController($interval, $filter, logger, dataservice) {

        var vm = this;
        vm.title = 'Admin';

        //methods

        activate();

        function activate() {
      
        }

    }
})();
