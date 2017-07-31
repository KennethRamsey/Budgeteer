/// <reference path="../app.ts" />


module FinanceApp {

    // The Home Controller Class/Function.
    function HouseholdController(
        $scope: any, //IScope,
        $state: ng.ui.IStateService,
        $stateParams: ng.ui.IStateParamsService,
        authSvc: AuthService,
        WebAPI: WebAPIService)
    {

        // get house memebers
        WebAPI.getHouseholdMembers().then(r => {
            $scope.members = r.data;
        });

        // get user info
        WebAPI.getUser().then(r => {
            $scope.user = r.data;
        });


        $scope.leaveHousehold = function () {
            WebAPI.leaveHousehold().then(r => {
                $state.go("personalHousehold");
            });
        };

        // field holding email.
        $scope.invite = {
            toEmail: null
        };

        $scope.sendInvite = function () {
            WebAPI.createInvite($scope.inviteEmail).then(r => {
                $scope.inviteEmail.toEmail = null; // ADD ERR HANDLING LATER.
            });
        };

    }

    // add controller to module
    angular.module("financeApp")
        .controller("householdCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", HouseholdController]);
}