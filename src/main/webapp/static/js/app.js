'use strict';

var app = angular.module('clientApp', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.contextMenu', 'angularBootstrapNavTree', 'dndLists', 'ui.tree', 'ngDialog', 'angularSpinner']);

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
                //TODO for development
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

app.run([
    "$rootScope",
    "$location",
    function ($rootScope, $location) {
        $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        });

        $rootScope.$on("$routeChangeError", function (event, current,
                                                      previous, eventObj) {
            if (eventObj.authenticated === false) {
                alert('Please log in');
            }
        });
    }]);
app.config(['$routeProvider', function ($routeProvider) {
    var resolve = {
        // for development
        //auth: ["$q", "LoginService", function ($q, LoginService) {
        //    var userInfo = LoginService.getUserInfo();
        //    if (userInfo.accessToken!=0) {
        //        return $q.when(userInfo);
        //    } else {
        //        return $q.reject({
        //            authenticated: false
        //        });
        //    }
        //}]
    };

    $routeProvider.when("/", {

    }).when("/company", {
        templateUrl: "user/company_edit.html",
        resolve: resolve
    }).when("/workflows", {
        templateUrl: "user/moduel.html",
        resolve: resolve
    }).when("/register", {
        templateUrl: "user/register.html"
    });
}]);

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

app.directive('ngAutocomplete', function ($parse) {
    return {

        scope: {
            details: '=',
            ngAutocomplete: '=',
            options: '='
        },

        link: function (scope, element, attrs, model) {

            //options for autocomplete
            var opts;

            //convert options provided to opts
            var initOpts = function () {
                opts = {}
                if (scope.options) {
                    if (scope.options.types) {
                        opts.types = []
                        opts.types.push(scope.options.types)
                    }
                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds
                    }
                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        }
                    }
                }
            }
            initOpts();

            //create new autocomplete
            //reinitializes on every change of the options provided
            var newAutocomplete = function () {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
//              if (scope.details) {
                        scope.details = scope.gPlace.getPlace();
//              }
                        scope.ngAutocomplete = element.val();
                    });
                })
            };
            newAutocomplete();

            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts();
                newAutocomplete();
                element[0].value = '';
                scope.ngAutocomplete = element.val();
            }, true);
        }
    };
});