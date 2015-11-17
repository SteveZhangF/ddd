'use strict';

app.controller('UserNavController', ['$scope', function ($scope) {
    $scope.myMenu =
        [
            {name: "Home", subMenu: [], href: "#/"},
            {name: "My Company", subMenu: [], href: "#/company"},
            {
                name: "My Documents", subMenu: [], href: "#/document"
            },
            {
                name: "Config", subMenu: [], href: "#/config"
            }
        ]
    ;
    $scope.selectedMenu = $scope.myMenu[0];
    $scope.menuClicked = function (menu) {
        $scope.selectedMenu = menu;
        $scope.subMenu = menu.subMenu;
    };

}]);