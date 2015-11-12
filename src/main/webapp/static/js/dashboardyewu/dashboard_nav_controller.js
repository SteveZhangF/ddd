'use strict';
var app = angular.module("dashboardApp");
app.controller('DashBoardNavController', ['$scope', function ($scope) {
    $scope.myMenu =
        [
            {name:"Home",subMenu:[],href:"#/index"},
            {name: "My Company",
                subMenu: [{name: "Company Information", subMenu: [],href:"#/company"},
                    {name: "Employee List", subMenu: [],href:"#/employees"}
                ]},
            {name:"My Documents",subMenu:[
                {name:"Start Document",subMenu:[],href:"#/workflows"},
                {name:"View Document",subMenu:[],href:"#/form"}
            ]},
            {name:"Config",subMenu:[],href:"#/config"
            }
        ]
    ;
    $scope.result1 = '';
    $scope.selectedMenu=$scope.myMenu[0];
    $scope.selectedSubMenu = null;
    $scope.menuClicked = function (menu) {
        $scope.selectedMenu = menu;
    };


}]);