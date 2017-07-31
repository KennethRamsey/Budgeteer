/// <reference path="../app.ts" />

module FinanceApp {

    function Login(authSvc: AuthService) {
        return {

            restrict: "EA",
            scope: {},
            templateUrl: "/NgApp/Directives/Templates/Login.html",

            link: function (scope) {

                scope.loginData = { userName: null, password: null, err: null };
                scope.auth = authSvc.authentication;

                // init spin.
                scope.spin = false;


                scope.login = function () {
                    // clear out message everytime.
                    scope.loginData.err = null;

                    scope.spin = true; // add spinner

                    authSvc.login(scope.loginData)
                        .catch((rej) => {
                            scope.loginData.err = rej.error_description;
                            scope.spin = false; // stop
                        });

                    // always clearout password.
                    scope.loginData.password = null;
                };

                scope.logOut = function () { authSvc.logOut(); };
            }
        };
    }


    angular.module("financeApp").directive("faLogin", ["authSvc", Login]);
}