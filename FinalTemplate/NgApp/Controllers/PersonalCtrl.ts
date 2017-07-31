/// <reference path="../app.ts" />


module FinanceApp {

    // The Home Controller Class/Function.
    function PersonalController(
        $scope: any, //IScope,
        $state: ng.ui.IStateService,
        $stateParams: ng.ui.IStateParamsService,
        authSvc: AuthService,
        WebAPI: WebAPIService)
    {

        WebAPI.getUser().then(r => {
            $scope.user = r.data;
            $scope.user.newPassword = null;
            $scope.user.confirmNewPassword = null;
        });

        $scope.editable = false;
        $scope.edit = function () {
            $scope.editable = !$scope.editable;
        };


        $scope.updateUser = function () {
            $scope.user.confirmPassword = $scope.user.password; // need confirm to have valid model.

            // save user, on success set editable to false, on fail alert, on all clear passwords.
            WebAPI.postUser($scope.user)
                .then(result => {
                    $scope.editable = false;
                }
                , err => {
                    alert("could not update profile.");
                })
                .finally(() => {
                    $scope.user.password = null;
                    $scope.user.confirmPassword = null;
                    $scope.user.newPassword = null;
                    $scope.user.confirmNewPassword = null;
                });
        };




    }

    // add controller to module
    angular.module("financeApp")
        .controller("personalCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", PersonalController]);
}