'use strict';

var app = angular.module('clientApp', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.contextMenu', 'angularBootstrapNavTree', 'dndLists']);

app.factory('LogInData', function () {
    return {
        isLogedIn: false,
        userInfo: null
    }
});


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
                    $location.path('/');
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
            }
        });
    }]);
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
    };

    $routeProvider.when("/", {
        //templateUrl : "index.html",
        resolve: resolve

    }).when("/company", {
        templateUrl: "user/company.html",
        resolve: resolve
    }).when("/login", {
        template: "<script>console.log(coconfigurationuration)<script>",
        controller: ""
    }).when("/test", {templateUrl: "user/company_menu.html"})
}]);

app.controller("SimpleDemoController", function ($scope) {

    $scope.models = {
        selected: null,
        lists: {"A": [], "B": []}
    };

    // Generate initial model
    for (var i = 1; i <= 3; ++i) {
        console.log(i);
        $scope.models.lists.A.push({label: "Item A" + i, children: [{label: "a.children"}]});
        $scope.models.lists.B.push({label: "Item B" + i});
    }

    // Model to JSON for demo purpose
    $scope.$watch('models', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});
app.filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
});

app.controller('DropdownCtrl', function ($scope, $log) {
    $scope.items = ['The first choice!', 'And another choice for you.',
        'but wait! A third!'];

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

