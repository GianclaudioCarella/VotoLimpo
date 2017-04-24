(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);

  ShellController.$inject = ['$mdSidenav','$rootScope', '$timeout', 'config', 'logger', 'dataservice'];
  /* @ngInject */
  function ShellController($mdSidenav,$rootScope, $timeout, config, logger, dataservice) {
    var vm = this;
    vm.busyMessage = 'Please wait ...';
    vm.isBusy = true;
    vm.pageBarVisible=true;
    vm.toggleSideNav=toggleSideNav;
    $rootScope.showSplash = true;

    vm.user = {
        displayName : 'Gianclaudio Carella',
        mail: 'gcarella@pqs.com.ar',
    };

    vm.navline = {
      title: config.appTitle,
      docTitle: config.docTitle
    };

    
    $rootScope.$on('page-bar-visible', function (event, data) {
       vm.pageBarVisible=data; 
    });

    activate();

    function activate() {
      logger.success(config.appTitle + ' loaded!', null);
      hideSplash();
    }

    function hideSplash() {
      //Force a 1 second delay so we can see the splash.
      $timeout(function() {
        $rootScope.showSplash = false;
      }, 1000);
    }

    function toggleSideNav(){
      console.log('mainSideNav-antes');
      $mdSidenav('mainSideNav').toggle();
      console.log('mainSideNav-despues');
    }

  }
})();
