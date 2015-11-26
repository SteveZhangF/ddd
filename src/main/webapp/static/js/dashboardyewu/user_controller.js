'use strict';

app.controller('UserController', ['$scope', 'UserService', 'FolderService', 'MessageService',function ($scope, UserService,FolderService,MessageService) {
    $scope.loadAll = function () {
        $scope.userListPromise = UserService.fetchAllUsers()
            .then(
            function (d) {
                var users = MessageService.handleMsg(d);
                if(users){
                    $scope.users = users;
                }
            },
            function (errResponse) {
                MessageService.handleServerErr(errResponse);
            }
        );
    };

    $scope.loadFolders = function () {
        $scope.userListPromise = FolderService.getFolderForSelect().then(
            function (response) {
                var folders = MessageService.handleMsg(response);
                if(folders){
                    $scope.folders = folders;
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };


    $scope.updateUser = function (user) {
        $scope.userListPromise = UserService.updateUser(user, user.id)
            .then(
            function (data) {
                var userb = MessageService.handleMsg(data);
                if(userb){
                    user.editing = false;
                    angular.copy(userb,user);
                }
            },
            function (errResponse) {
                MessageService.handleServerErr(errResponse);
            }
        );
    };

    $scope.editUser = function (user) {
        user.editSetting = {
            enableSearch: true,
            scrollableHeight: '300px',
            scrollable: true,
            displayProp: 'name', idProp: 'id',
            externalIdProp: ''
        };
        user.editing = true;

        return {
            deleteFolder: function deleteFolder(f) {
                for(var i=0;i<user.folders.length;i++){
                    if(user.folders[i].id == f.id){
                        user.folders.splice(i,1);
                    }
                }
            }
        }

    };

    /**
     * for check question in the table start
     * */
    $scope.selectUser = function () {
        $scope.selectedAllUsers = $scope.users.every(function (itm) {
            return itm.selected;
        })
    };
    $scope.selectAllUsers = function () {
        var toggleStatus = !$scope.selectedAllUsers;
        angular.forEach($scope.users, function (itm) {
            itm.selected = !toggleStatus;
        });
    };

    $scope.folders = [];
    $scope.loadAll();
    $scope.loadFolders();


}]);