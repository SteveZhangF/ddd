'use strict';

/**
 * user information service
 * login out
 * */
app.service('LoginService', [
    '$http',
    '$q',
    '$window',
    'LogInData',

    function ($http, $q, $window, LoginData) {
        var userInfo = {
            accessToken: 0,
            userName: 0,
            userId: 0,
            companyId: 0,
            workflows: 0
        }

        function getUserInfo() {
            return userInfo;
        }

        /**
         * register
         * */
        function register(user) {
            return $http.post("/register", user)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    console.error('Error while register user');
                    return $q.reject(errResponse);
                }
            );
        }

        function refreshUserInfo() {
            $window.sessionStorage["userInfo"] = JSON
                .stringify(userInfo);
            console.log("refresh.." + $window.sessionStorage['userInfo']);
        }

        /**
         * login
         *
         * @param ssoid
         * @param password
         */
        function login(ssoId, password) {
            var deferred = $q.defer();
            $http.post("/login", {
                ssoId: ssoId,
                password: password
            }).then(
                function (result) {
                    userInfo = {
                        accessToken: result.data.accessToken,
                        userName: result.data.userName,
                        userId: result.data.userId,
                        companyId: result.data.companyId,
                        workflows: result.data.workflows
                    };
                    $window.sessionStorage["userInfo"] = JSON
                        .stringify(userInfo);

                    LoginData.userInfo = userInfo;
                    LoginData.isLogedIn = true;

                    console.log(LoginData);
                    deferred.resolve(userInfo);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        /**
         * log out
         */
        function logout() {
            var deferred = $q.defer();

            $http({
                method: "POST",
                url: "/logout"
            }).then(function (result) {
                $window.sessionStorage["userInfo"] = null;
                userInfo = null;
                LoginData.userInfo = userInfo;
                LoginData.isLogedIn = false;
                deferred.resolve(result);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function init() {
            if ($window.sessionStorage["userInfo"]) {
                userInfo = JSON.parse($window.sessionStorage["userInfo"]);

                LoginData.userInfo = userInfo;
                LoginData.isLogedIn = !(userInfo == null);
                console.log(LoginData.isLogedIn);
                console.log(LoginData.isLogedIn);
            }
        }

        function updateUser(user) {
            var deferred = $q.defer();
            $http.put("/updateUser", {
                ssoId: user.ssoId,
                password: user.password
            }).then(
                function (result) {
                    return result.data;
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        init();
        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo,
            register: register,
            refreshUserInfo: refreshUserInfo,
            updateUser: updateUser
        };
    }]);
app.controller('RegisterController', ['$scope', '$location', '$timeout', '$interval', 'LoginService', 'usSpinnerService', function ($scope, $location, $timeout, $interval, LoginService, usSpinnerService) {
    $scope.master = {};

    $scope.error = false;
    $scope.success = false;
    $scope.time = 3;

    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('registering-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function () {
        if ($scope.spinneractive) {
            usSpinnerService.stop('registering-spinner');
            $scope.spinneractive = false;
        }
    };
    $scope.update = function (user) {
        $scope.startSpin();
        LoginService.register(user).then(function (data) {
                $scope.stopSpin();
                $scope.success = true;
                var stop = $interval(function () {
                    $scope.time = $scope.time - 1;
                    if ($scope.time == 0) {
                        $location.path('/');
                        $interval.cancel(stop);
                    }
                }, 1000);

            },
            function (err) {
                $scope.stopSpin();
                $scope.error = true;
                var stop = $interval(function () {
                    $scope.time = $scope.time - 1;
                    if ($scope.time == 0) {
                        $location.path('/');
                        $interval.cancel(stop);
                    }
                }, 1000);
            });
    };
    $scope.reset = function (form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();
}]);

app.directive('pwd2', function () {

    return {
        scope: {
            pwd: '='
        },
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            scope.$watch(function (scope) {
                    return scope.pwd;
                },
                function () {
                    ctrl.$validate();
                });
            ctrl.$validators.pwd2 = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return true;
                }
                if (scope.pwd == modelValue) {
                    return true;
                }
                return false;
            };
        }
    };
});

app.controller('LoginController', ['$scope', 'LoginService', 'ngDialog', 'LogInData', 'usSpinnerService', '$location', function ($scope, LoginService, ngDialog, LogInData, usSpinnerService, $location) {

    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('login-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function () {
        if ($scope.spinneractive) {
            usSpinnerService.stop('login-spinner');
            $scope.spinneractive = false;
        }
    };
    $scope.loginError = {hasError: false, isError: false, msg: ''};
    $scope.login = function (user) {
        $scope.startSpin();
        LoginService.login(user.ssoId, user.password).then(function (response) {
            $scope.stopSpin();
            $scope.loginError.hasError = true;
            $scope.loginError.isError = false;
        }, function (err) {
            if (err.status == 404) {
                $scope.stopSpin();
                $scope.loginError.hasError = true;
                $scope.loginError.isError = true;
                $scope.loginError.msg = "no such user";
            } else if (err.status == 403) {
                $scope.stopSpin();
                $scope.loginError.hasError = true;
                $scope.loginError.isError = true;
                $scope.loginError.msg = "wrong username or password";
            }
        });
    };

    $scope.logout = function () {
        LoginService.logout().then(
            function () {
                $location.path('/');
            }
        );
    };

    $scope.forgetPassword = function () {

    };

    $scope.isLoginedIn = function () {
        return LogInData.isLogedIn;
    };

    //if ($scope.isLoginedIn()) {
    //    $location.path('/document');
    //}


}]);

app.directive('username', function ($q, $timeout) {
    return {
        link: function (scope, elm, attrs, ctrl) {
            var usernames = ['Jim', 'John', 'Jill', 'Jackie'];

            ctrl.$asyncValidators.username = function (modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty model valid
                    return $q.when();
                }

                var def = $q.defer();

                $timeout(function () {
                    // Mock a delayed response
                    if (usernames.indexOf(modelValue) === -1) {
                        // The username is available
                        def.resolve();
                    } else {
                        def.reject();
                    }

                }, 2000);

                return def.promise;
            };
        }
    };
});