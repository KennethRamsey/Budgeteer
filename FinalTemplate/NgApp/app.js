/// <reference path="services/dataservice.ts" />
/// <reference path="core/typings/angularjs/angular-resource.d.ts" />
//#region Scripts
/// <reference path="core/typings/angularjs/angular-animate.d.ts" />
/// <reference path="core/typings/angularjs/angular-cookies.d.ts" />
/// <reference path="core/typings/angularjs/angular-mocks.d.ts" />
/// <reference path="core/typings/angularjs/angular-resource.d.ts" />
/// <reference path="core/typings/angularjs/angular-route.d.ts" />
/// <reference path="core/typings/angularjs/angular-sanitize.d.ts" />
/// <reference path="core/typings/angularjs/angular-scenario.d.ts" />
/// <reference path="core/typings/angularjs/angular.d.ts" />
/// <reference path="core/typings/jquery/jquery.d.ts" />
/// <reference path="core/typings/angularjs/angular-ui-router.d.ts" />
/// <reference path="controllers/homectrl.ts" />
/// <reference path="controllers/navctrl.ts" />
/// <reference path="controllers/transactionctrl.ts" />
/// <reference path="controllers/registerctrl.ts" />
/// <reference path="services/authservice.ts" />
//#endregion
var FinanceApp;
(function (FinanceApp) {
    // function to Config angular module, sets up providers.
    function Config($stateProvider, $urlRouterProvider, $httpProvider //ng.IHttpProvider
    ) {
        // Add Interceptor
        // should intercept requests and add the bearer header
        // should redirect you to HOME page if response is 401(unauth).
        $httpProvider.interceptors.push(function ($q, $location, localStorageService) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    var authData = localStorageService.get("authorizationData");
                    if (authData)
                        config.headers.Authorization = "Bearer " + authData.token;
                    return config; // not async so return plain object
                },
                responseError: function (rejection) {
                    if (rejection.status === 401) {
                        $location.path("/");
                        // wanted to add auth.logout() for anytime I'm rejected on authentication, but this causes a circular reference b/c $http will then req authSvc (which req. $http).
                    }
                    return $q.reject(rejection); // is async so return promise resolver.
                }
            };
        });
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        $urlRouterProvider
            .otherwise("/");
        // Use $stateProvider to configure your states.
        $stateProvider
            .state("home", {
            url: "/",
            templateUrl: "/NgApp/Views/Home/home.html"
        })
            .state("register", {
            url: "/register",
            templateUrl: "/NgApp/Views/Home/Register.html"
        })
            .state("dashboard", {
            url: "/dashboard",
            templateUrl: "/NgApp/Views/Home/Dashboard.html"
        })
            .state("household", {
            url: "/household",
            templateUrl: "/NgApp/Views/Household/Details.html"
        })
            .state("householdBudget", {
            url: "/household/budget",
            templateUrl: "/NgApp/Views/Household/Budget.html"
        })
            .state("householdAccounts", {
            url: "/accounts",
            templateUrl: "/NgApp/Views/Account/Details.html"
        })
            .state("transactions", {
            url: "/transactions",
            templateUrl: "/NgApp/Views/Transaction/Create.html"
        })
            .state("personal", {
            url: "/personal",
            templateUrl: "/NgApp/Views/Home/Personal.html"
        })
            .state("personalHousehold", {
            url: "/household/choose",
            templateUrl: "/NgApp/Views/Household/ChooseHouse.html"
        });
        // WHAT are these doing??
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    }
    // function to Run after the config stage.
    function Run($rootScope, // ng.IRootScopeService really but TS didn't like adding properties to it.
        $state, $stateParams, $http, $interval, authSvc, WebAPISvc) {
        //OnLoad goes here if needed
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        // auto "login" if login token is still there.
        authSvc.fillAuthData();
        // check that auth token is still valid. (this is a one time check);
        if (authSvc.check() === false) {
            authSvc.logOut();
        }
    }
    // Create Angular Module.
    angular
        .module("financeApp", ["ui.router", "LocalStorageModule", "ngAnimate", "ngResource"])
        .config(["$stateProvider", "$urlRouterProvider", "$httpProvider", Config])
        .run(["$rootScope", "$state", "$stateParams", "$http", "$interval", "authSvc", "WebAPISvc", Run]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=app.js.map