/// <reference path="../app.ts" />

module FinanceApp {

    // The Home Controller Class/Function.
    function NavCtrl(
        $scope: any, //IScope,
        $state: ng.ui.IStateService,
        $stateParams: ng.ui.IStateParamsService,
        authSvc: AuthService) {

        $scope.auth = authSvc.authentication;

        $scope.logOut = function () {
            authSvc.logOut();
            // on login go to home.
            this.$state.go("home");
        };

        // func for having navebar buttons active when in state.
        $scope.in = function (state: string) {
            return $state.current.name.indexOf(state) !== -1;
        };

    }

    // add controller to module
    angular.module("financeApp")
        .controller("navCtrl", ["$scope", "$state", "$stateParams", "authSvc", NavCtrl]);
}