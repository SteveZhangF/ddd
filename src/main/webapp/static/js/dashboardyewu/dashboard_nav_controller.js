'use strict';
var app = angular.module("dashboardApp");
app.controller('DashBoardNavController', ['$scope', function ($scope) {
    //<div id="sidebar-nav">
    //    <ul id="dashboard-menu">
    //    <li><a href="index.html"><span>Home</span>
    //    </a></li>
    //<li><a href="#/users"><span>Users</span></a></li>
    //<li><a href="#/forms"><span>All Forms</span></a></li>
    //<li><a href="#/workflows"><span>Work Flow</span></a></li>
    //<li><a href="#/questions"><span>Questions</span></a></li>
    //</ul>
    //</div>
    $scope.myMenu =
        [
            {name:"Home",subMenu:[],href:"#/"},
            {name: "Users",href:"#/users"},
           // {name:"Forms",href:"#/forms"},
            {name:"Form Folders",href:'#/form_folders'},
            {name:"Questions Sequences",href:"#/workflows"},
          //  {name:"Questions",href:"#/questions"},
            {name:"Table Forms",href:"#/table_forms"}

        ]
    ;
    $scope.menuClicked = function (menu) {
        $scope.selectedMenu = menu;
    };


}]);