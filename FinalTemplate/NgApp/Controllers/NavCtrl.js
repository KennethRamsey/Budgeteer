/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // The Home Controller Class/Function.
    function NavCtrl($scope, //IScope,
        $state, $stateParams, authSvc) {
        $scope.auth = authSvc.authentication;
        $scope.logOut = function () {
            authSvc.logOut();
            // on login go to home.
            this.$state.go("home");
        };
        // func for having navebar buttons active when in state.
        $scope.in = function (state) {
            return $state.current.name.indexOf(state) !== -1;
        };
    }
    // add controller to module
    angular.module("financeApp")
        .controller("navCtrl", ["$scope", "$state", "$stateParams", "authSvc", NavCtrl]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=navctrl.js.map