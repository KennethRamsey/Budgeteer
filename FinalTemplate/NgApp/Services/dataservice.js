/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // Service to handle Authentication.
    var WebAPIService = (function () {
        function WebAPIService($q, $http, $state, localStorageService, $resource) {
            this.$q = $q;
            this.$http = $http;
            this.$state = $state;
            this.localStorageService = localStorageService;
            this.$resource = $resource;
        }
        // --------- User Info ----------------
        WebAPIService.prototype.getUser = function () {
            return this.$http.get("/api/authentication/user");
        };
        WebAPIService.prototype.postUser = function (user) {
            return this.$http.post("/api/authentication/user", user);
        };
        // --------- household ----------------
        WebAPIService.prototype.createNewHousehold = function () {
            return this.$http.post("/api/household/new", null);
        };
        WebAPIService.prototype.leaveHousehold = function () {
            return this.$http.post("/api/household/leave", null);
        };
        WebAPIService.prototype.getHouseholdMembers = function () {
            return this.$http.get("/api/household/members");
        };
        // --------- Invites ----------------
        WebAPIService.prototype.getInvites = function () {
            return this.$http.get("/api/household/invites");
        };
        WebAPIService.prototype.createInvite = function (email) {
            return this.$http.post("/api/household/invite", email);
            // implicently deletes these
        };
        WebAPIService.prototype.acceptInvite = function (inviteId) {
            return this.$http.post("/api/household/invite/act", { inviteId: inviteId, action: "accept" });
        };
        WebAPIService.prototype.declineInvite = function (inviteId) {
            return this.$http.post("/api/household/invite/act", { inviteId: inviteId, action: "decline" });
        };
        // --------- accounts ----------------
        WebAPIService.prototype.getAccounts = function () {
            return this.$http.get("/api/accounts");
        };
        WebAPIService.prototype.postAccount = function (account) {
            return this.$http.post("/api/accounts", account);
        };
        WebAPIService.prototype.updateAccount = function (account) {
            return this.$http.post("/api/accounts/" + account.id, account);
        };
        WebAPIService.prototype.deleteAccount = function (accountId) {
            return this.$http.delete("/api/accounts/" + accountId);
        };
        // -------- transactions ---------------
        WebAPIService.prototype.getTransactions = function (options) {
            return this.$http.get("/api/transactions", { params: options });
        };
        WebAPIService.prototype.getRecentTransactions = function () {
            return this.$http.get("/api/transactions/recent");
        };
        // post for create and update of transaction
        WebAPIService.prototype.postTransaction = function (transaction) {
            return this.$http.post("/api/transactions", transaction);
        };
        WebAPIService.prototype.deleteTransaction = function (transaction) {
            return this.$http.delete("/api/transaction/" + transaction.id);
        };
        // -------- BudgetItems ---------------
        WebAPIService.prototype.getBudget = function () {
            return this.$http.get("/api/budget");
        };
        WebAPIService.prototype.getIncomes = function () {
            return this.$http.get("/api/budget/incomes");
        };
        WebAPIService.prototype.getExpenses = function () {
            return this.$http.get("/api/budget/expenses");
        };
        WebAPIService.prototype.createBudgetItem = function (budgetItem) {
            return this.$http.post("/api/budget", budgetItem);
        };
        WebAPIService.prototype.updateBudgetItem = function (budgetItem) {
            return this.$http.post("/api/budget/" + budgetItem.id, budgetItem);
        };
        WebAPIService.prototype.deleteBudgetItem = function (budgetItem) {
            return this.$http.delete("/api/budget/" + budgetItem.id);
        };
        WebAPIService.prototype.getMonthSums = function () {
            return this.$http.get("/api/budget/thisMonth");
        };
        return WebAPIService;
    }());
    FinanceApp.WebAPIService = WebAPIService;
    // add service to module.
    angular.module("financeApp")
        .service("WebAPISvc", ["$q", "$http", "$state", "localStorageService", "$resource", WebAPIService]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=dataservice.js.map