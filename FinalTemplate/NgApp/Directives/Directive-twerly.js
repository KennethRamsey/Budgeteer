/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    function Login(authSvc) {
        return {
            restrict: "EA",
            scope: {},
            templateUrl: "/NgApp/Directives/Templates/Login.html",
            link: function (scope) {
                scope.loginData = { userName: null, password: null, err: null };
                scope.auth = authSvc.authentication;

                scope.login = function () {
                    //clear out message everytime.
                    scope.loginData.err = null;

                    authSvc.login(scope.loginData).catch(function (rej) {
                        scope.loginData.err = rej.error_description;
                    });

                    // always clearout password.
                    scope.loginData.password = null;
                };

                scope.logOut = function () {
                    authSvc.logOut();
                };
            }
        };
    }

    angular.module("financeApp").directive("faLogin", ["authSvc", Login]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=Directive-twerly.js.map
