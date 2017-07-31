/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    function Login(authSvc) {
        return {
            restrict: "EA",
            scope: {},
            templateUrl: "/NgApp/Directives/Templates/Login.html",
            link: function (scope) {
                scope.loginData = { userName: null, password: null };
                scope.auth = this.authSvc.authentication;

                scope.login = function () {
                    this.authSvc.login(scope.loginData);
                    scope.loginData.password = null; // clearout password.
                };

                scope.logOut = function () {
                    this.authSvc.logOut();
                };
            }
        };
    }

    angular.module("financeApp").directive("faLogin", ["authSvc", Login]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=Directive - Login.js.map
