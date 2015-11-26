'use strict';

var app = angular.module('dashboardApp', ['ngRoute','ngAnimate', 'ui.bootstrap', 'ngDialog', 'customizedDirective', 'cgBusy','smart-table', 'froala', 'angularSpinner', 'angularjs-dropdown-multiselect']);

// add an interceptor to add the token to the request head
var debug = true;
var redirect = function ($location) {
    if (!debug) {
        $location.path('/login');
    }
};
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$location', '$window', function ($q, $location, $window) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                var path = $location.$$path;
                if (path == '/login' || path == '/') {

                } else {
                    if ($window.sessionStorage["userInfo"]) {
                        var token = JSON.parse($window.sessionStorage["userInfo"]);
                        if (token) {
                            config.headers['X-AUTH-TOKEN'] = token.accessToken;
                        }
                    } else {
                        redirect($location);
                        //$location.path('/login');
                    }
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    redirect($location);
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
        });

        $rootScope.$on("$routeChangeError", function (event, current,
                                                      previous, eventObj) {
            if (eventObj.authenticated === false) {
                redirect($location);
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
        templateUrl: 'dashboard/index.html',
        //resolve: resolve
    }).when("/users", {
        templateUrl: "dashboard/user_list.html",
        resolve: resolve
    })
        .when("/table_forms", {
            templateUrl: "dashboard/table_form_list.html",
            resolve: resolve
        })
        .when("/table_form_edit",
        {
            templateUrl: "dashboard/table_form_edit.html",
            resolve: resolve
        })
        .when("/form_folders", {
            templateUrl: "dashboard/folder_list2.html",
            resolve: resolve
        })
        .when("/login", {
            templateUrl: 'dashboard/login.html',
            //resolve: resolve
        })
    ;

}]);
app.filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
});


// used to handle all the recieved message from server, and show the related tusi
app.service('MessageService', ['$rootScope',
    function ($rootScope) {
        return {
            handleMsg: function (message) {
                $rootScope.$broadcast('message-received', message);
                return message.content;
            },
            handleServerErr: function (err) {
                $rootScope.$broadcast('server-error-received', err);
            }
        }
    }]);
app.controller("MessageController", ['$scope', '$interval', function ($scope, $interval) {
    $scope.$on('message-received', function (event, args) {
        addMessage(args);
    });
    $scope.$on('server-error-received', function (event, args) {
        addError(args);
    });

    $scope.messages = [];
    var msg = {
        title: "",
        description: '',
        content: {}
    };
    var error = {
        status: '',
        statusText: ''

    };
    var addMessage = function (msg) {
        $scope.messages.push(msg);
    };
    var addError = function (error) {
        console.log('00000');
        var msgError = {
            title: 'FAIL',
            description: "Server Error "+error.status +  " -x> " + error.statusText
        };
        $scope.messages.push(msgError);
        console.log(msgError)
    };

    $interval(function () {
        if($scope.messages.length>0){
            $scope.messages.splice(0,1);
        }
    }, 2000);
}]);