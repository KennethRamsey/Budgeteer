/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    function BudgetController($scope, //ng.IScope,
        $state, $stateParams, authSvc, WebAPI) {
        // var to signal if in registering mode or not.
        $scope.registering = authSvc.registering;
        // get budget sums for the month.
        function getMonthSums() {
            WebAPI.getMonthSums().then(function (r) {
                $scope.sums = r.data;
                $scope.incomes = [];
                $scope.expenses = [];
                // sort them into incomes and expenses
                for (var i = 0; i < $scope.sums.length; i++) {
                    var item = $scope.sums[i];
                    if (item.isExpense)
                        $scope.expenses.push(item);
                    else
                        $scope.incomes.push(item);
                }
                ;
            });
        }
        getMonthSums();
        $scope.clear = function () {
            $scope.budgetItem.id = null;
            $scope.budgetItem.name = null;
            $scope.budgetItem.amount = null;
            $scope.budgetItem.isExpense = true;
        };
        $scope.edit = function (item) {
            $scope.budgetItem.id = item.id;
            $scope.budgetItem.name = item.name;
            $scope.budgetItem.amount = item.amount;
            $scope.budgetItem.isExpense = item.isExpense;
        };
        // for highlighting budget item editting
        $scope.editting = function (id) { return id === $scope.budgetItem.id; };
        $scope.budgetItem = {
            id: null,
            name: null,
            amount: null,
            isExpense: true
        };
        $scope.updateBudget = function () {
            // update item if their's a id.
            if ($scope.budgetItem.id != null) {
                WebAPI.updateBudgetItem($scope.budgetItem).then(function (r) {
                    $scope.clear();
                    getMonthSums();
                });
            }
            else {
                WebAPI.createBudgetItem($scope.budgetItem).then(function (r) {
                    $scope.clear();
                    getMonthSums();
                });
            }
        };
        $scope.delete = function (budgetItem) {
            WebAPI.deleteBudgetItem(budgetItem).then(function (r) {
                getMonthSums();
            });
        };
    }
    // add controller to module
    angular.module("financeApp")
        .controller("budgetCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", BudgetController]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=BudgetCtrl.js.map