/// <reference path="../app.ts" />
var FinanceApp;
(function (FinanceApp) {
    function graph(authSvc, WebAPI) {
        return {
            restrict: "EA",
            scope: {},
            templateUrl: "/NgApp/Directives/Templates/Graph.html",
            link: function (scope, elem) {
                // hook up graph.
                var d1, d2, data, chartOptions;
                scope.incomes = [];
                scope.expenses = [];
                scope.budgetLine = [];
                scope.monthLine = [];
                function getMonthSums() {
                    return WebAPI.getMonthSums().then(function (r) {
                        scope.sums = r.data;
                        // sort them into incomes and expenses
                        for (var i = 0; i < scope.sums.length; i++) {
                            var item = scope.sums[i];
                            if (item.isExpense) {
                                scope.expenses.push(item);
                            }
                            else {
                                scope.incomes.push(item);
                            }
                        }
                        ;
                        // transform expenses into two pairs
                        scope.budgetLine = [];
                        scope.monthLine = [];
                        for (var j = 0; j < scope.expenses.length; j++) {
                            var item = scope.expenses[j];
                            // budgetline point
                            var point = [];
                            point.push(j - .08); // must sub from x point to align with labels.
                            point.push(item.amount);
                            scope.budgetLine.push(point);
                            // monthline point
                            var point2 = [];
                            point2.push(j + .10); // must add .3 or whatever to the x point so that the graphs don't overlap.
                            point2.push(item.sum);
                            scope.monthLine.push(point2);
                        }
                        ;
                    });
                }
                function generateGraph() {
                    // get budget sums for the month.
                    getMonthSums().then(function () {
                        //// needs to be called after api completes.
                        // Line 1
                        d1 = scope.budgetLine;
                        // Line 2
                        d2 = scope.monthLine;
                        data = [
                            {
                                label: "Budget",
                                data: d1
                            }, {
                                label: "This Month",
                                data: d2
                            }
                        ];
                        var chartColors = ['#e5412d', '#f0ad4e', '#444', '#888', '#555', '#999', '#bbb', '#ccc', '#eee'];
                        // funct to get the budget names for each set of bars.
                        function xAxisLabelGenerator(index) {
                            var item = scope.expenses[index];
                            return (item) ? "   " + item.name : "";
                        }
                        // allows me to control CSS for some of the legend.
                        function legendFormatter(label, series) {
                            // series is the series object for the label
                            return '<span style="font-size: 1.4em; padding:10px;">' + label + '</span>';
                        }
                        chartOptions = {
                            xaxis: {
                                min: -.25,
                                max: scope.budgetLine.length - .25,
                                tickSize: .5,
                                tickFormatter: xAxisLabelGenerator,
                                alignTicksWithAxis: 1
                            },
                            yaxis: {
                                tickFormatter: function (num) { return '$ ' + num; }
                            },
                            bars: {
                                show: true,
                                barWidth: .25,
                                fill: true,
                                lineWidth: 0,
                                order: true,
                                fillColor: { colors: [{ opacity: .85 }, { opacity: .5 }] }
                            },
                            //series: { // this works for a line graph, but we want a bar graph...
                            //    lines: {
                            //        show: true,
                            //        fill: false,
                            //        lineWidth: 3
                            //    },
                            //    points: {
                            //        show: true,
                            //        radius: 4.5,
                            //        fill: true,
                            //        fillColor: "#ffffff",
                            //        lineWidth: 2.75
                            //    }
                            //},
                            grid: {
                                hoverable: true,
                                clickable: true,
                                borderWidth: 0
                            },
                            legend: {
                                show: true,
                                margin: 25,
                                backgroundColor: '#ffffff',
                                labelFormatter: legendFormatter
                            },
                            tooltip: true,
                            tooltipOpts: {
                                content: '%s: %y'
                            },
                            colors: chartColors
                        };
                        var holder = $("#graph-placeholder");
                        if (holder.length) {
                            // have to cast to compile.
                            $.plot(holder, data, chartOptions);
                        }
                    });
                }
                generateGraph();
            }
        };
    }
    // wire up directive.
    angular.module("financeApp").directive("graph", ["authSvc", "WebAPISvc", graph]);
})(FinanceApp || (FinanceApp = {}));
//# sourceMappingURL=Directive-graph.js.map