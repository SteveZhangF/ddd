'use strict';

app.controller('UserController', ['$scope', 'UserService', 'ngDialog', function ($scope, UserService, ngDialog) {
    var self = this;

    $scope.user = {id: null, ssoId: '', companyId: '', email: "", state: "", userProfiles: []};
    $scope.users = [];


    self.fetchAllUsers = function () {
        UserService.fetchAllUsers()
            .then(
            function (d) {
                $scope.users = d;
            },
            function (errResponse) {
                console.error('Error while fetching Currencies');
            }
        );
    };

    self.createUser = function (user) {
        UserService.createUser(user)
            .then(
            self.fetchAllUsers,
            function (errResponse) {
                console.error('Error while creating User.');
            }
        );
    };

    self.updateUser = function (user, id) {
        UserService.updateUser(user, id)
            .then(
            self.fetchAllUsers,
            function (errResponse) {
                console.error('Error while updating User.');
            }
        );
    };

    self.deleteUser = function (id) {
        UserService.deleteUser(id)
            .then(
            self.fetchAllUsers,
            function (errResponse) {
                console.error('Error while deleting User.');
            }
        );
    };

    self.fetchAllUsers();


    self.remove = function (id) {
        self.deleteUser(id);
    };

    $scope.editor = function (user) {
        $scope.user = user;
        ngDialog.open({template: 'user-editor.html'});
    }
}]);