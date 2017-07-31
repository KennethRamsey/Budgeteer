/// <reference path="../app.ts" />


module FinanceApp {

    // The Home Controller Class/Function.

    function AccountController (
        $scope: any, //IScope,
        $state: ng.ui.IStateService,
        $stateParams: ng.ui.IStateParamsService,
        authSvc: AuthService,
        WebAPI: WebAPIService)
    {

        // var to signal if in registering mode or not.
        $scope.registering = authSvc.registering;


        // get accounts
        function getAccounts() {
            WebAPI.getAccounts()
                .then(result => {
                    $scope.accounts = result.data;
                });
        }
        getAccounts();

        // init account object for form.
        $scope.account = {name: ""};
        
        $scope.addAccount = function () {
            WebAPI.postAccount($scope.account)
                .then(result => {
                    getAccounts();
                });
        };

        $scope.deleteAccount = function (accountId: number) {
            WebAPI.deleteAccount(accountId)
                .then(result => {
                    getAccounts();
                });
        };





    }

    // add controller to module
    angular.module("financeApp")
        .controller("accountCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", AccountController]);
}