/// <reference path="../app.ts" />

module FinanceApp {

    export interface ITransactionOptions {
        householdId?: number;
        accountId?: number;
        categoryId?: number;
        amount?: number;
        isDeposit?: boolean;
        reconciled?: boolean;
        date?: Date;
        updated?: Date;
        userName?: string;
        sort?: string;
        order?: string;
        budgetItemId?: number;
    }


    export interface ITransaction {
    }

    export interface IAccount {

    }

    export interface IBudgetItem {
    }

    export interface IHousehold {

    }


    // Service to handle Authentication.
    export class WebAPIService {

        constructor(
            public $q: ng.IQService,
            public $http: ng.IHttpService,
            public $state: ng.ui.IStateService,
            public localStorageService: any,
            public $resource: ng.resource.IResourceService
            ) { }

        // --------- User Info ----------------
        getUser() {
            return this.$http.get("/api/authentication/user");
        }

        postUser(user: IRegisterUser) {
            return this.$http.post("/api/authentication/user", user);
        }


        // --------- household ----------------
        createNewHousehold() {
            return this.$http.post("/api/household/new", null);
        }

        leaveHousehold() {
            return this.$http.post("/api/household/leave", null);
        }

        getHouseholdMembers() {
            return this.$http.get("/api/household/members");
        }



        // --------- Invites ----------------
        getInvites() {
            return this.$http.get("/api/household/invites");
        }

        createInvite(email: string) {
            return this.$http.post("/api/household/invite", email);
            // implicently deletes these
        }

        acceptInvite(inviteId: number) {
            return this.$http.post("/api/household/invite/act", { inviteId: inviteId, action: "accept" });
        }

        declineInvite(inviteId: number) {
            return this.$http.post("/api/household/invite/act", { inviteId: inviteId, action: "decline" });
        }



        // --------- accounts ----------------
        getAccounts() {
            return this.$http.get("/api/accounts");
        }

        postAccount(account) {
            return this.$http.post("/api/accounts", account);
        }

        updateAccount(account) {
            return this.$http.post("/api/accounts/" + account.id, account);
        }

        deleteAccount(accountId: number) {
            return this.$http.delete("/api/accounts/" + accountId);
        }


        // -------- transactions ---------------
        getTransactions(options: ITransactionOptions) {
            return this.$http.get("/api/transactions", { params: options });
        }

        getRecentTransactions() {
            return this.$http.get("/api/transactions/recent");
        }

        // post for create and update of transaction
        postTransaction(transaction) {
            return this.$http.post("/api/transactions", transaction);
        }

        deleteTransaction(transaction) {
            return this.$http.delete("/api/transaction/" + transaction.id);
        }


        // -------- BudgetItems ---------------
        getBudget() {
            return this.$http.get("/api/budget");
        }

        getIncomes() {
            return this.$http.get("/api/budget/incomes");
        }

        getExpenses() {
            return this.$http.get("/api/budget/expenses");
        }

        createBudgetItem(budgetItem) {
            return this.$http.post("/api/budget", budgetItem);
        }

        updateBudgetItem(budgetItem) {
            return this.$http.post("/api/budget/" + budgetItem.id, budgetItem);
        }

        deleteBudgetItem(budgetItem) {
            return this.$http.delete("/api/budget/" + budgetItem.id);
        }

        getMonthSums() {
            return this.$http.get("/api/budget/thisMonth");
        }


    }

    // add service to module.
    angular.module("financeApp")
        .service("WebAPISvc", ["$q", "$http", "$state", "localStorageService", "$resource", WebAPIService]);
}