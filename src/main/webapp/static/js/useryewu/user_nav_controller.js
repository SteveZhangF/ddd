'use strict';

app.controller('UserNavController', ['$scope', function ($scope) {
    $scope.myMenu =
        [
            {name: "Home", subMenu: [], href: "#/"},
            {
                name: "My Company", subMenu: [
                {name: "Company Information", subMenu: [], href: "#/company_edit"},
                {name: "Employee List", subMenu: [], href: "#/employee_list"}]
            },
            {
                name: "My Documents", subMenu: [
                {name:"Start Document",href:"#/start_document"},
                {name:"View Document",href:"#/view_document"}
            ]
            },
            {
                name: "Config", subMenu: [], href: "#/config"
            }
        ]
    ;
    $scope.selectedMenu = {selectedParentMenu: {}, selectedChildMenu: {}};
}]);

app.directive("dropdown", function ($rootScope) {
    return {
        restrict: "E",
        templateUrl: "template/dropdown.html",
        scope: {
            allMenu: "=",
            selected: "=",
            displayName: "@",
            href: "@"
        },
        replace: true,
        link: function (scope) {
            scope.listVisible = false;
            scope.isPlaceholder = true;

            scope.childMenuClicked = function (parent,item) {
                scope.selected.selectedParentMenu = parent;
                scope.selected.selectedChildMenu = item;
            };

            scope.isParentMenuSelected = function (menu) {
                return menu.name === scope.selected.selectedParentMenu.name;
            };

            scope.isSelected = function (item) {
                return item.name === scope.selected.selectedChildMenu.name;
            };

            scope.parentMenuClicked = function (item) {
                if(item.subMenu.length<=0){
                    scope.selected.selectedParentMenu = item;
                    scope.selected.selectedChildMenu = {};
                }
                for(var i=0;i<scope.allMenu.length;i++){
                    scope.allMenu[i].listVisible = false;
                }

                item.listVisible = true;
            };

            $rootScope.$on("documentClicked", function (inner, target) {
                if (!$(target[0]).hasClass("dropdown-display") && !$(target[0]).parents(".dropdown-display.clicked").length > 0)
                    scope.$apply(function () {
                        //scope.menu.listVisible = false;
                        for(var i=0;i<scope.allMenu.length;i++){
                            scope.allMenu[i].listVisible = false;
                        }
                    });
            });
        }
    }
});
