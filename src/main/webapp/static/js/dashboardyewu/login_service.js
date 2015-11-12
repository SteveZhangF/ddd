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
        var userInfo;

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
                    console.error('Error while fetching users');
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
                        companyId: result.data.companyId
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
        }

        /**
         * log out
         */
        function logout() {
            var deferred = $q.defer();

            $http({
                method: "POST",
                url: "/logout",
                headers: {
                    // "access_token" : userInfo.accessToken
                }
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

        init();
        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo,
            register: register,
            refreshUserInfo: refreshUserInfo
        };
    }]);
app.controller('loginController', ['$scope', 'LoginService', 'LogInData',
    function ($scope, LoginService, LogInData) {
        $scope.ssoId = "";
        $scope.password = "";
        $scope.logindata = LogInData;
        $scope.login = function () {
            console.log($scope.ssoId);
            LoginService.login($scope.ssoId, $scope.password);

        }
        $scope.logout = function () {
            console.log("logout");
            LoginService.logout();
        }
    }]);
// controller the modal to show
app.controller('LoginModalCtrl', ['$scope', '$modal', 'LogInData',
    function ($scope, $modal, LogInData) {


        $scope.logindata = LogInData;
        $scope.open = function (size) {
            console.log("open");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'loginModalContent.html',
                controller: 'loginModalController',
                size: size,
                resolve: {}
            });
        };
    }]);
// modal instance contoller
app.controller('loginModalController', ['$scope', '$modalInstance',
    'LoginService', 'LogInData',
    function ($scope, $modalInstance, $LoginService, LogInData) {
        $scope.ssoId = "";
        $scope.password = "";
        $scope.email = "";
        $scope.password2 = "";
        $scope.loginData = LogInData;

        $scope.ifnewuser = false;
        $scope.login = function () {
            $scope.ifnewuser = false;
        };
        $scope.register = function () {
            $scope.ifnewuser = true;
        };
        $scope.message = {};
        $scope.ok = function () {
            if ($scope.ifnewuser) {// register
                var user = {
                    ssoId: $scope.ssoId,
                    password: $scope.password,
                    email: $scope.email
                }
                console.log(user);
                $scope.message = $LoginService.register(user);


                $modalInstance.close();
            } else {//login
                $LoginService.login($scope.ssoId, $scope.password);
                $modalInstance.close();
            }

        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);