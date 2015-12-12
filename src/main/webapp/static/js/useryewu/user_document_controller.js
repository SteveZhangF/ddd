

app.controller("UserDocumentNavController", ['$scope', function ($scope) {
    $scope.menus = [
        //{name: "Start Document", subMenu: [], href: "user/document_start.html"},
        {name: "View Document", subMenu: [], href: "user/document_view.html"}
    ];
    $scope.selectedMenu = $scope.menus[0];
    $scope.menuSelect = function (menu) {
        angular.forEach($scope.menus, function (itm) {
            itm.selected = itm.name === menu.name;
        });
        $scope.selectedMenu = menu;
    };
}])
;