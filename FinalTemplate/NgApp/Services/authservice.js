/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    // Service to handle Authentication.
    var AuthService = (function () {
        function AuthService($q, $http, $state, localStorageService) {
            this.$q = $q;
            this.$http = $http;
            this.$state = $state;
            this.localStorageService = localStorageService;
            // auth is in every controller, so this is the quickest way to carry data about whether registering to all of the contrllers.
            this.registering = false;
            // a backup of the data will be stored in local storage.
            // THIS should be the ONLY time this object is directly changed.
            this.authentication = {
                isAuth: false,
                userName: "",
                name: "",
                token: "",
                claims: null
            };
        }
        // func to check on start up if my authentication token is still valid.
        AuthService.prototype.check = function () {
            if (this.authentication.isAuth = false)
                return false;
            this.$http.get("\authentication\check")
                .success(function () { return true; })
                .error(function () { return false; });
        };
        //function to fill the auth data if there is info in the local storage (meaning your logged in).
        AuthService.prototype.fillAuthData = function () {
            var authData = this.localStorageService.get("authorizationData");
            if (authData) {
                // reset the properties, NOT the authentication object.
                this.authentication.isAuth = true;
                this.authentication.userName = authData.userName;
                this.authentication.name = authData.name;
                this.authentication.claims = authData.claims;
                this.authentication.token = authData.token;
            }
            ;
        };
        //function to log out a user. also clears out all previous auth data from the program.
        AuthService.prototype.logOut = function () {
            // should remove from local storage.
            this.localStorageService.remove("authorizationData");
            // update PROPERTIES.
            this.authentication.isAuth = false;
            this.authentication.userName = "";
            this.authentication.name = "";
            this.authentication.claims = null;
            this.authentication.token = "";
        };
        // function to register a user.
        AuthService.prototype.register = function (user) {
            this.logOut(); // logout will delete local storage.
            // the api returns an array of errors, or empty array if success.
            return this.$http
                .post("/api/authentication/register", user)
                .then(function (response) { return response.data; });
        };
        // function to convert a serialized claims object into a dictionary.
        AuthService.prototype.deserializeClaims = function (claimsString) {
            var claimsArray = eval(claimsString);
            var claimsDist = {};
            // see if claim (of type?) exists, if not create an array and add the claim.
            for (var i = 0; i < claimsArray.length; i++) {
                //if (!claimsDist[claimsArray[i].ClaimType]);
                if (typeof claimsDist[claimsArray[i].ClaimType] === "undefined") {
                    claimsDist[claimsArray[i].ClaimType] = [];
                }
                claimsDist[claimsArray[i].ClaimType].push(claimsArray[i].ClaimValue);
            }
            return claimsDist;
        };
        // function to call on login?
        AuthService.prototype.login = function (loginData, redirect) {
            var _this = this;
            if (redirect === void 0) { redirect = true; }
            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
            var deferred = this.$q.defer();
            //post to '/token' to get a new login token.
            this.$http.post("/token", data, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
                .success(function (response) {
                var claims = _this.deserializeClaims(response.claims);
                // update Properties of authentication.
                _this.authentication.isAuth = true;
                _this.authentication.userName = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"][0];
                _this.authentication.name = response.givenName;
                _this.authentication.claims = claims;
                _this.authentication.token = response.access_token;
                // update local storage
                _this.localStorageService.set("authorizationData", _this.authentication);
                // on login, if normal redirect, go to dashboard.
                if (redirect) {
                    _this.$state.go("dashboard");
                }
                deferred.resolve(response);
            })
                .error(function (err, status) {
                _this.logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };
        return AuthService;
    }());
    FinanceApp.AuthService = AuthService;
    // add service to module.
    angular.module("financeApp")
        .service("authSvc", ["$q", "$http", "$state", "localStorageService", AuthService]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=authservice.js.map