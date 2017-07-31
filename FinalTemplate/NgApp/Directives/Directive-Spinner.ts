/// <reference path="../app.ts" />

declare var Spinner;

module FinanceApp {

    function MySpinner() {
        return {

            restrict: "EA",

            scope: {
                offset: "="
            },

            template: "<div style=\"position:relative; height: {{85 + offset}}px;\"></div>",

            link: function (scope, elem: JQuery) {

                var opts = {
                    lines: 15, // The number of lines to draw
                    length: 25, // The length of each line
                    width: 4, // The line thickness
                    radius: 24, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: '#000', // #rgb or #rrggbb or array of colors
                    speed: 0.8, // Rounds per second
                    trail: 42, // Afterglow percentage
                    shadow: true, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: '50%', // Top position relative to parent
                    left: '50%' // Left position relative to parent
                };


                // make spinner, don't need to score contents in variable since we won't be manipulating it.
                new Spinner(opts).spin(elem.find("div")[0]);
            }
        };
    }


    angular.module("financeApp").directive("spinner", [MySpinner]);
}