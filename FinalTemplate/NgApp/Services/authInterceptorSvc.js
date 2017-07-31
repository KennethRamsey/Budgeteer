/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // Service to handle Intercepting Http requests and append the auth information.
    var InterceptService = (function () {
        function InterceptService($q, $location, localStorageService) {
            this.$q = $q;
            this.$location = $location;
            this.localStorageService = localStorageService;
        }
        // function to add the required headers for webAPI appropriatly and return them.
        InterceptService.prototype.request = function (config) {
            config.headers = config.headers || {};

            var authData = this.localStorageService.get("authorizationData");

            if (authData) {
                config.headers.Authroization = "Bearer " + authData.token;
            }
            ;

            return config;
        };

        // function should redirect you to HOME page if receive 401(unauth).
        InterceptService.prototype.responseError = function (rejection) {
            if (rejection.status === 401) {
                this.$location.path("/");
            }

            return this.$q.reject(rejection);
        };
        return InterceptService;
    })();
    FinanceApp.InterceptService = InterceptService;

    // add service to module.
    angular.module("financeApp").service("authInterceptorSvc", ["$q", "$location", "localStorageService", InterceptService]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=authInterceptorSvc.js.map
