/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // The Home Controller Class/Function.
    function AccountController($scope, //IScope,
        $state, $stateParams, authSvc, WebAPI) {
        // var to signal if in registering mode or not.
        $scope.registering = authSvc.registering;
        // get accounts
        function getAccounts() {
            WebAPI.getAccounts()
                .then(function (result) {
                $scope.accounts = result.data;
            });
        }
        getAccounts();
        // init account object for form.
        $scope.account = { name: "" };
        $scope.addAccount = function () {
            WebAPI.postAccount($scope.account)
                .then(function (result) {
                getAccounts();
            });
        };
        $scope.deleteAccount = function (accountId) {
            WebAPI.deleteAccount(accountId)
                .then(function (result) {
                getAccounts();
            });
        };
    }
    // add controller to module
    angular.module("financeApp")
        .controller("accountCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", AccountController]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=AccountCtrl.js.map