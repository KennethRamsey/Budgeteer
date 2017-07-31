/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // The Home Controller Class/Function.
    function ChooseHouseController($scope, //IScope,
        $state, $stateParams, authSvc, WebAPI) {
        // flag to signal if in registering mode or not.
        $scope.registering = authSvc.registering;
        // get house memebers
        WebAPI.getHouseholdMembers().then(function (r) {
            $scope.members = r.data;
        });
        // get user info
        WebAPI.getUser().then(function (r) {
            $scope.user = r.data;
        });
        // get invites
        function getInvites() {
            WebAPI.getInvites().then(function (r) {
                $scope.invites = r.data;
            });
        }
        getInvites();
        // if in registering mode, go to accounts next, instead of household.
        var destination = ($scope.registering) ? "householdAccounts" : "household";
        // make new home
        $scope.startHouse = function () {
            WebAPI.createNewHousehold().then(function (r) {
                $state.go(destination);
            });
        };
        // accept invite
        $scope.acceptInvite = function (inviteId) {
            WebAPI.acceptInvite(inviteId).then(function (r) {
                $state.go("household");
            });
        };
        // decline invite
        $scope.declineInvite = function (inviteId) {
            WebAPI.declineInvite(inviteId).then(function (r) {
                getInvites();
            });
        };
    }
    // add controller to module
    angular.module("financeApp")
        .controller("chooseHouseCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", ChooseHouseController]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=ChooseHouseCtrl.js.map