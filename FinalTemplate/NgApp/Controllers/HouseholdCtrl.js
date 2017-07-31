/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // The Home Controller Class/Function.
    function HouseholdController($scope, //IScope,
        $state, $stateParams, authSvc, WebAPI) {
        // get house memebers
        WebAPI.getHouseholdMembers().then(function (r) {
            $scope.members = r.data;
        });
        // get user info
        WebAPI.getUser().then(function (r) {
            $scope.user = r.data;
        });
        $scope.leaveHousehold = function () {
            WebAPI.leaveHousehold().then(function (r) {
                $state.go("personalHousehold");
            });
        };
        // field holding email.
        $scope.invite = {
            toEmail: null
        };
        $scope.sendInvite = function () {
            WebAPI.createInvite($scope.inviteEmail).then(function (r) {
                $scope.inviteEmail.toEmail = null; // ADD ERR HANDLING LATER.
            });
        };
    }
    // add controller to module
    angular.module("financeApp")
        .controller("householdCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", HouseholdController]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=HouseholdCtrl.js.map