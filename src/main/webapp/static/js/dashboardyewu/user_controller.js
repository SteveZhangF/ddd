'use strict';

app.controller('UserController', ['$scope', 'UserService', function ($scope, UserService) {
    var self = this;

    //[{"id":1,"ssoId":"123","password":"ddd","companyId":"4028809150452dc2015045377bd40005",
    // "email":"a@c.x","state":"Active","userProfiles":[{"id":1,"type":"USER"}]},
    //
    //
    // {"id":2,"ssoId":"111","password":"ddd","companyId":null,"email":"sdqfspd@live.com","state":"Active","userProfiles":[]},{"id":3,"ssoId":"admin","password":"ddd","companyId":null,"email":"zhangke3012@163.com","state":"Active","userProfiles":[]},{"id":4,"ssoId":"222","password":"qqq","companyId":null,"email":"qqq@www.mmm","state":"Active","userProfiles":[]},{"id":5,"ssoId":"www","password":"qqq","companyId":null,"email":"wwwW2@we","state":"Active","userProfiles":[]},{"id":6,"ssoId":"ddd","password":"www","companyId":null,"email":"ddd","state":"Active","userProfiles":[]},{"id":7,"ssoId":"012","password":"233","companyId":null,"email":"ss@dd.cc","state":"Active","userProfiles":[]},{"id":8,"ssoId":"nihaoma","password":"wohenhao","companyId":null,"email":"s@d.c","state":"Active","userProfiles":[]},{"id":13,"ssoId":"denglu","password":"e","companyId":null,"email":"d@a.c","state":"Active","userProfiles":[{"id":1,"type":"USER"}]}]Oct 10, 2015 8:15:54 PM org.springframework.context.support.GenericApplicationContext prepareRefresh

    self.user = {id: null, ssoId: '', companyId: '',email:"",state:"",userProfiles:[]};
    self.users = [];

    self.fetchAllUsers = function () {
        UserService.fetchAllUsers()
            .then(
            function (d) {
                self.users = d;
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

    self.submit = function () {
        if (self.user.id == null) {
            console.log('Saving New User', self.user);
            self.createUser(self.user);
        } else {
            self.updateUser(self.user, self.user.id);
            console.log('User updated with id ', self.user.id);
        }
        self.reset();
    };

    self.edit = function (id) {
        console.log('id to be edited', id);
        for (var i = 0; i < self.users.length; i++) {
            if (self.users[i].id == id) {
                self.user = angular.copy(self.users[i]);
                break;
            }
        }
    };

    self.remove = function (id) {
        console.log('id to be deleted', id);
        for (var i = 0; i < self.users.length; i++) {//clean form if the user to be deleted is shown there.
            if (self.users[i].id == id) {
                self.reset();
                break;
            }
        }
        self.deleteUser(id);
    };


    self.reset = function () {
        self.user = {id: null, username: '', address: '', email: ''};
        $scope.myForm.$setPristine(); //reset Form
    };

}]);