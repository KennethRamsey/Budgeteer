/// <reference path="../app.ts" />

module FinanceApp {

    export interface IRegisterUser {
        userName: string;
        name: string;
        phoneNumber: string;
        password: string;
        confirmPassword: string;
        email: string;
        err: string[];
        newPassword?: string;
        confirmNewPassword?: string;
    }


    // The Home Controller Class/Function.
    function RegCtrl(
        $scope: any, //IScope,
        $state: ng.ui.IStateService,
        $stateParams: ng.ui.IStateParamsService,
        authSvc: AuthService) {
        

        var regUser: IRegisterUser = {
            userName: null,
            name: null,
            phoneNumber: null,
            password: null,
            confirmPassword: null,
            email: null,
            err: null
        };

        $scope.user = regUser;


        // funct to send register and display errors if any.
        $scope.register = function () {
            // clear out err's every time they try to register.
            $scope.user.err = null;

            // register.
            authSvc.register($scope.user)
                .then(err => {
                    if (!err[0]) {
                        // no errors, login; don't redirect to dashboard.
                        // because of house long it takes to log in, the requests after this are getting rejectect b/c their not authed.
                        // make sure to do the next state after authorization is established.
                        authSvc.login($scope.user, false).then(() => { 
                            authSvc.registering = true; // flag that registration mode.
                            $state.go("personalHousehold"); // use register to signal guided registration mode for each page.
                        });
                    }
                    else {
                        // show errs.
                        $scope.user.err = err;
                    }
                });
        };

    }

    // add controller to module
    angular.module("financeApp")
        .controller("regCtrl", ["$scope", "$state", "$stateParams", "authSvc", RegCtrl]);
}