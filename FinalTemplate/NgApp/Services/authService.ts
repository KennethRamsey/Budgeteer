/// <reference path="../app.ts" />

module FinanceApp {

    export interface IAuthData {
        isAuth: boolean;
        userName: string;
        name: string;
        claims: Object;
        token: string;
    }

    export interface ILoginData {
        userName: string;
        password: string;
    }


    // Service to handle Authentication.
    export class AuthService {

        constructor(
            public $q: ng.IQService,
            public $http: ng.IHttpService,
            public $state: ng.ui.IStateService,
            public localStorageService: any
            ) { }

        // auth is in every controller, so this is the quickest way to carry data about whether registering to all of the contrllers.
        registering: boolean = false;


        // a backup of the data will be stored in local storage.
        // THIS should be the ONLY time this object is directly changed.
        authentication: IAuthData = {
            isAuth: false,
            userName: "",
            name: "",
            token: "",
            claims: null
        };

        // func to check on start up if my authentication token is still valid.
        check() {
            if (this.authentication.isAuth = false) return false;

            this.$http.get("\authentication\check")
                .success(() => true)
                .error(() => false);
        }

        //function to fill the auth data if there is info in the local storage (meaning your logged in).
        fillAuthData() {

            var authData: IAuthData = this.localStorageService.get("authorizationData");

            if (authData) {
                // reset the properties, NOT the authentication object.
                this.authentication.isAuth = true;
                this.authentication.userName = authData.userName;
                this.authentication.name = authData.name;
                this.authentication.claims = authData.claims;
                this.authentication.token = authData.token;
            };
        }


        //function to log out a user. also clears out all previous auth data from the program.
        logOut() {

            // should remove from local storage.
            this.localStorageService.remove("authorizationData");

            // update PROPERTIES.
            this.authentication.isAuth = false;
            this.authentication.userName = "";
            this.authentication.name = "";
            this.authentication.claims = null;
            this.authentication.token = "";
        }


        // function to register a user.
        register(user) {

            this.logOut(); // logout will delete local storage.

            // the api returns an array of errors, or empty array if success.
            return this.$http
                .post("/api/authentication/register", user)
                .then((response) => response.data);
        }


        // function to convert a serialized claims object into a dictionary.
        deserializeClaims(claimsString: string) {

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
        }


        // function to call on login?
        login(loginData: ILoginData, redirect = true ) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            var deferred = this.$q.defer();

            //post to '/token' to get a new login token.
            this.$http.post("/token", data, { headers: { "Content-Type": "application/x-www-form-urlencoded" }})
                .success(
                    (response: { claims; access_token; givenName }) => {

                        var claims = this.deserializeClaims(response.claims);

                        // update Properties of authentication.
                        this.authentication.isAuth = true;
                        this.authentication.userName = <string>claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"][0];
                        this.authentication.name = <string>response.givenName;
                        this.authentication.claims = <string>claims;
                        this.authentication.token = <string>response.access_token;

                        // update local storage
                        this.localStorageService.set("authorizationData", this.authentication);

                        // on login, if normal redirect, go to dashboard.
                        if (redirect) {
                            this.$state.go("dashboard");
                        }

                        deferred.resolve(response);
                })
                .error(
                    (err, status) => {
                        this.logOut();
                        deferred.reject(err);
                });

            return deferred.promise;
        }

    }

    // add service to module.
    angular.module("financeApp")
        .service("authSvc", ["$q", "$http", "$state", "localStorageService", AuthService]);
}