/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // The Home Controller Class/Function.
    function HomeController($scope, //IScope,
        $state, $stateParams, authSvc, WebAPI) {
        // currently, simplest way to clear out the registration mode it to set it to false when you go to the dashboard.
        authSvc.registering = false;
        // recent trans.
        WebAPI.getRecentTransactions()
            .then(function (result) { $scope.recentTrans = result.data; });
        // accounts
        WebAPI.getAccounts()
            .then(function (result) { $scope.accounts = result.data; });
    }
    // add controller to module
    angular.module("financeApp")
        .controller("homeCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", HomeController]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=homectrl.js.map