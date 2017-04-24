(function () {
    'use strict';

    angular
      .module('app.core')
      .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'exception', 'logger', 'config'];
    /* @ngInject */
    function dataservice($http, $q, exception, logger, config) {

        var service = {
            playService: playService,
            getStatusIsRunning: getStatusIsRunning,
            getMailsPendientes: getMailsPendientes,
            getMailsEnviados: getMailsEnviados,
            getMailsError: getMailsError,
            marcarReenvio: marcarReenvio,
            getAuthorization: getAuthorization
        };

        return service;


        function playService() {

            var url = config.serviceRoot + 'api/mail/start';

            return $http({
                method: 'POST',
                url: url
            }).then(sucess, errorCallback);

            function sucess(response) {
                return response;
            }

            function errorCallback(response) {
                return self._errorCallback('No fue posible startar el servicio');
            }
        }

        function marcarReenvio(mailId) {

            var url = config.serviceRoot + 'api/mail/actualizaStatus?mailId=' + mailId;

            return $http({
                method: 'POST',
                url: url,
            }).then(sucess);

            function sucess(response) {
                return response;
            }
        }

        function getStatusIsRunning() {

            var url = config.serviceRoot + 'api/mail/status';

            return $http({
                method: 'GET',
                url: url
            }).then(sucess);

            function sucess(response) {
                return response;
            }

        }

        function getMailsPendientes() {

            var url = config.serviceRoot + 'api/mail/pendientes';

            return $http({
                method: 'GET',
                url: url
            }).then(sucess);

            function sucess(response) {
                return response.data;
            }
        }

        function getMailsError() {

            var url = config.serviceRoot + 'api/mail/conError';

            return $http({
                method: 'GET',
                url: url
            }).then(sucess);

            function sucess(response) {
                return response.data;
            }
        }

        function getMailsEnviados() {

            var url = config.serviceRoot + 'api/mail/enviados';

            return $http({
                method: 'GET',
                url: url
            }).then(sucess);

            function sucess(response) {
                return response.data;
            }
        }

        function getAuthorization() {

            var url = config.serviceRoot + 'api/mail/authorization_site';

            return $http({
                method: 'GET',
                url: url
            }).then(sucess);

            function sucess(response) {
                return response.data;
            }
        }

    }
})();
