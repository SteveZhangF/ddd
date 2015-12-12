'use strict';

var app = angular.module('clientApp', ['ngRoute', 'ui.bootstrap','ngAnimate' , 'angularFileUpload', 'customizedDirective', 'smart-table', 'ngDialog', 'angularSpinner','cgBusy']);
var debug = false;
var redirect = function ($location) {
    console.log('debug:true');
    if (!debug) {
        $location.path('/login');
    }
};
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
                var path = $location.$$path;
                if (path == '/register' || path == '/login' || path == '/') {
                } else {
                    if ($window.sessionStorage["userInfo"]) {
                        var token = JSON.parse($window.sessionStorage["userInfo"]);
                        if (token) {
                            config.headers['X-AUTH-TOKEN'] = token.accessToken;
                        }
                    } else {
                        redirect($location);
                    }
                }
                return config;
            },
            'responseError': function (response) {
                console.log(response.status);
                if (response.status === 401 || response.status === 403) {
                    redirect($location);
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
                redirect($location);
            }
        });
        angular.element(document).on("click", function (e) {
            $rootScope.$broadcast("documentClicked", angular.element(e.target));
        });
    }]);

app.config(['$routeProvider', function ($routeProvider) {
    var resolve = {
        auth: ["$q", "LoginService", function ($q, LoginService) {
            var userInfo = LoginService.getUserInfo();
            if (userInfo != null && userInfo.accessToken != 0) {
                return $q.when(userInfo);
            } else {
                if(debug){
                    return $q.when(userInfo);
                }else{
                    return $q.reject({
                        authenticated: false
                    });
                }
                //return $q.reject({
                //    authenticated: false
                //});
            }
        }]
    };

    $routeProvider.
        when("/", {
            templateUrl: "user/user_index.html"
        })
        .when("/login", {
            templateUrl: "user/login.html"
        }).when("/company", {
            templateUrl: "user/company.html",
            resolve: resolve
        }).when("/workflows", {
            templateUrl: "user/moduel.html",
            resolve: resolve
        }).when("/register", {
            templateUrl: "user/register.html"
        }).when("/view_employee", {
            templateUrl: "user/employee_edit.html",
            resolve: resolve
        })
        .when("/config", {
            templateUrl: "user/user_config.html",
            resolve: resolve
        })
        .when("/document", {
            templateUrl: "user/document.html",
            resolve: resolve
        })
        .when("/company_edit", {
            templateUrl: "user/company_edit.html",
            resolve: resolve
        })
        .when("/employee_list", {
            templateUrl:"user/employee_list_card_style.html",
            resolve:resolve
        })
        .when("/view_document",{
            templateUrl:"user/document_view.html",
            resolve:resolve
        })
        .when("/start_document",{
            templateUrl:"user/document_start.html"
        })
        .when("/customized_element",{
            templateUrl:"user/customized_element_menu.html",
            resolve:resolve
        })
    ;
}]);

app.filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
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