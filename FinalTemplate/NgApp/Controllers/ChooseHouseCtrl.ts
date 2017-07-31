/// <reference path="../app.ts" />


module FinanceApp {

    // The Home Controller Class/Function.
    function ChooseHouseController(
        $scope: any, //IScope,
        $state: ng.ui.IStateService,
        $stateParams: ng.ui.IStateParamsService,
        authSvc: AuthService,
        WebAPI: WebAPIService)
    {
        // flag to signal if in registering mode or not.
        $scope.registering = authSvc.registering;


        // get house memebers
        WebAPI.getHouseholdMembers().then(r => {
            $scope.members = r.data;
        });

        // get user info
        WebAPI.getUser().then(r => {
            $scope.user = r.data;
        });

        // get invites
        function getInvites() {
            WebAPI.getInvites().then(r => {
                $scope.invites = r.data;
            });
        }
        getInvites();


        // if in registering mode, go to accounts next, instead of household.
        var destination: string = ($scope.registering) ? "householdAccounts" : "household"

        // make new home
        $scope.startHouse = function () {
            WebAPI.createNewHousehold().then(r => {
                $state.go(destination);
            });
        };

        // accept invite
        $scope.acceptInvite = function (inviteId: number) {
            WebAPI.acceptInvite(inviteId).then(r => {
                $state.go("household");
            });
        };

        // decline invite
        $scope.declineInvite = function (inviteId: number) {
            WebAPI.declineInvite(inviteId).then(r => {
                getInvites();
            });
        };
        
    }

    // add controller to module
    angular.module("financeApp")
        .controller("chooseHouseCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", ChooseHouseController]);
}