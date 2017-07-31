/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // The Home Controller Class/Function.
    function ChooseHouseController($scope, $state, $stateParams, authSvc, WebAPI) {
        // get house memebers
        WebAPI.getHouseholdMembers().then(function (r) {
            $scope.members = r.data;
        });

        // get user info
        WebAPI.getUser().then(function (r) {
            $scope.user = r.data;
        });

        // get invites
        WebAPI.getInvites().then(function (r) {
            $scope.invites = r.data;
        });
    }

    // add controller to module
    angular.module("financeApp").controller("chooseHouseCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", ChooseHouseController]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=InviteCtrl.js.map
