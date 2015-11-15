'use strict';

var app = angular.module('dashboardApp', ['ngRoute', 'ui.bootstrap','ngDialog', 'ui.bootstrap.contextMenu', 'customizedDirective','angularBootstrapNavTree','virtualList','smart-table','froala','angularSpinner']);

// add an interceptor to add the token to the request head
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$location', '$window', function ($q, $location, $window) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage["userInfo"]) {
                    var token = JSON.parse($window.sessionStorage["userInfo"]);
                    if (token) {
                        config.headers['X-AUTH-TOKEN'] = token.accessToken;
                    }
                } else {
                    //$location.path('/');
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/');
                }
                return $q.reject(response);
            }
        };
    }]);
}]);
//store the login data
app.factory('LogInData', function () {
    return {
        isLogedIn: false,
        userInfo: null
    }
});
//watch the route changes and check the login information
app.run([
    "$rootScope",
    "$location",
    function ($rootScope, $location) {
        $rootScope.$on("$routeChangeSuccess", function (userInfo) {
            console.log(userInfo);
        });

        $rootScope.$on("$routeChangeError", function (event, current,
                                                      previous, eventObj) {
            if (eventObj.authenticated === false) {
                // $location.path("/login");
                // show the log in page
            }
        });
    }]);
//router
app.config(['$routeProvider', function ($routeProvider) {
    var resolve = {
        auth: ["$q", "LoginService", function ($q, LoginService) {
            var userInfo = LoginService.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({
                    authenticated: false
                });
            }
        }]
    }
    $routeProvider.when("/", {
        resolve: resolve
    }).when("/users", {
        templateUrl: "dashboard/user_list.html",
        //TODO remove resolve
        //resolve: resolve
    }).when("/forms",{
        templateUrl:"dashboard/form_list.html",
        //TODO remove resolve commit
        //resolve: resolve
    }).when("/workflows",{
        templateUrl:"dashboard/workflow.html"
    }).when("/questions",{templateUrl:"dashboard/question_list.html"})
        .when("/table_forms",{
            templateUrl:"dashboard/table_form_list.html",
            //resolve:resolve
        })
        .when("/table_form_edit",
        {
            templateUrl:"dashboard/table_form_edit.html",
            //resolve:resolve
        })
    ;

}]);
app.filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
});

app.controller('DropdownCtrlz', function ($scope, $log) {
    $scope.status = {
        isopen: false
    };

    $scope.toggled = function (open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
});

app.controller('flowDesignerController',function($scope){
    $scope.datajson = [{id:'1',label:'dddd'}];
    return {
    }
});


