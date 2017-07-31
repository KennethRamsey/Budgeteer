/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // The Home Controller Class/Function.
    function TransactionController($scope, //ng.IScope,
        $state, $stateParams, authSvc, WebAPI) {
        $scope.transaction = { date: new Date() }; // should init date.
        $scope.incomeCat = [];
        $scope.expenseCat = [];
        // incomes
        WebAPI.getIncomes().then(function (r) {
            $scope.incomeCat = r.data;
        });
        // expenses
        WebAPI.getExpenses().then(function (r) {
            $scope.expenseCat = r.data;
        });
        // accounts
        WebAPI.getAccounts().then(function (r) {
            $scope.accounts = r.data;
        });
        // members
        WebAPI.getHouseholdMembers().then(function (r) {
            $scope.members = r.data;
        });
        // field to tell if entry form is active or searching is active.
        $scope.enter = true;
        $scope.enterPage = function () { $scope.enter = true; };
        $scope.searchPage = function () { $scope.enter = false; };
        // for transaction filtering/searching options
        var options = {
            date: null,
            //type: null,
            amount: null,
            categoryId: null,
            userName: null,
            accountId: null
            //reconciled: null,
            //budgetItemId: null
        };
        $scope.options = options;
        // Get Transaction Table, Aleady applies Filtering.
        function getTransactions() {
            $scope.spin = true; // show spinnerx
            WebAPI.getTransactions(options).then(function (r) {
                $scope.transactionList = r.data;
                $scope.spin = false;
            });
        }
        getTransactions();
        // set up watch to search on any change.
        $scope.$watch('options', function () { getTransactions(); }, true);
        $scope.sort = function (field) {
            // set order to asc same field and already desc.
            if (field === options.sort && options.order === 'desc') {
                options.order = 'asc';
            }
            else {
                options.order = 'desc';
            }
            options.sort = field;
            getTransactions();
        };
        // would like to have a dropdown for the household members so you can enter for others, but for now, if you enter it, you purchased it!
        //WebAPI.getHouseholdMembers().then(result => { $scope.houseMembers = result.data; });
        $scope.onSubmit = function () {
            WebAPI.postTransaction($scope.transaction)
                .then(function (r) {
                getTransactions();
                $scope.cancel(); // to clear out form.
            });
        };
        $scope.cancel = function () {
            $scope.transaction.amount = null;
            $scope.transaction.reconciled = false;
            $scope.transaction.isDeposit = false;
            $scope.transaction.budgetItemId = null;
            $scope.transaction.accountId = null;
            $scope.transaction.description = null;
            $scope.transaction.date = new Date();
            $scope.transaction.id = 0; // sends back null suprisingly.
        };
        $scope.edit = function (tr) {
            $scope.transaction.amount = tr.amount;
            $scope.transaction.reconciled = tr.reconciled;
            $scope.transaction.isDeposit = tr.isDeposit;
            $scope.transaction.budgetItemId = tr.budgetItemId;
            $scope.transaction.accountId = tr.accountId;
            $scope.transaction.description = tr.description;
            $scope.transaction.date = new Date(tr.date.slice(0, 10));
            $scope.transaction.id = tr.id;
        };
    }
    // add controller to module
    angular.module("financeApp")
        .controller("transactionCtrl", ["$scope", "$state", "$stateParams", "authSvc", "WebAPISvc", TransactionController]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=transactionctrl.js.map