/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // The Home Controller Class/Function.
    function RegCtrl($scope, $state, $stateParams, authSvc) {
        var regUser = {
            userName: null,
            name: null,
            phoneNumber: null,
            password: null,
            confirmPassword: null,
            email: null,
            err: null
        };

        $scope.user = regUser;

        // funct to send register and display errors if any.
        $scope.register = function () {
            // clear out err's every time they try to register.
            $scope.user.err = null;

            // register.
            authSvc.register($scope.user).then(function (err) {
                if (!err[0]) {
                    // no errors, login & redirect.
                    authSvc.login($scope.user);
                } else {
                    // show errs.
                    $scope.user.err = err;
                }
            });
        };
    }

    // add controller to module
    angular.module("financeApp").controller("regCtrl", ["$scope", "$state", "$stateParams", "authSvc", RegCtrl]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=RegCtrl.js.map
