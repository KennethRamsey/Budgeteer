/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    function MySpinner() {
        return {
            restrict: "EA",
            scope: {
                offset: "="
            },
            template: "<div style=\"position:relative; height: {{85 + offset}}px;\"></div>",
            link: function (scope, elem) {
                var opts = {
                    lines: 15,
                    length: 25,
                    width: 4,
                    radius: 24,
                    corners: 1,
                    rotate: 0,
                    direction: 1,
                    color: '#000',
                    speed: 0.8,
                    trail: 42,
                    shadow: true,
                    hwaccel: false,
                    className: 'spinner',
                    zIndex: 2e9,
                    top: '50%',
                    left: '50%' // Left position relative to parent
                };
                // make spinner, don't need to score contents in variable since we won't be manipulating it.
                new Spinner(opts).spin(elem.find("div")[0]);
            }
        };
    }
    angular.module("financeApp").directive("spinner", [MySpinner]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=Directive-Spinner.js.map