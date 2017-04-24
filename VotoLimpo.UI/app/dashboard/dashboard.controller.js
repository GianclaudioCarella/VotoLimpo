(function () {
    'use strict';

    angular
      .module('app.dashboard')
      .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$interval', '$filter', 'logger', 'dataservice', '$mdDialog'];
    /* @ngInject */
    function DashboardController($interval, $filter, logger, dataservice, $mdDialog) {
        var vm = this;
        vm.title = 'Admin';
        vm.isServiceRunning = false;
        vm.timer = null;
        vm.mailsPendientes = 0;
        vm.mailsError = 0;
        vm.mailsEnviados = 0;
        vm.message = 'Service stopped.';
        vm.showEnviados = false;
        vm.showErrors = false;
        vm.showPendiente = true;
        vm.errorView = false;

        //methods

        activate();

        function activate() {
            logger.info('Activated Admin View');
        }


    }
})();
