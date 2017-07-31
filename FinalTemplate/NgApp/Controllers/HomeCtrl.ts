/// <reference path="../app.ts" />


module FinanceApp {

    // The Home Controller Class/Function.
    function HomeController(
        $scope: any, //IScope,
        $state: ng.ui.IStateService,
        $stateParams: ng.ui.IStateParamsService,
        authSvc: AuthService,
        WebAPI: WebAPIService)
    {

        // currently, simplest way to clear out the registration mode it to set it to false when you go to the dashboard.
        authSvc.registering = false;


        // recent trans.
        WebAPI.getRecentTransactions()
            .then(result => { $scope.recentTrans = result.data; });

        // accounts
        WebAPI.getAccounts()
            .then(result => { $scope.accounts = result.data; });
    }

    // add controller to module
    angular.module("financeApp")
        .controller("homeCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", HomeController]);
}