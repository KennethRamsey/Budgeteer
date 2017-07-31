/// <reference path="../app.ts" />

module FinanceApp {

    function transaction(authSvc: AuthService) {
        return {

            restrict: "EA",
            scope: {
                onSubmit: "=",
                transaction: "=",
                incomeCat: "=",
                expenseCat: "=",
                houseMembers: "=",
                accounts: "="
            },
            templateUrl: "/NgApp/Directives/Templates/Transaction.html",

            link: function (scope) {

                scope.toggleIsDeposit = function () {
                    scope.transaction.isDeposit = !scope.transaction.isDeposit;
                };

            }
        };
    }


    angular.module("financeApp").directive("faTransaction", ["authSvc", transaction]);
}