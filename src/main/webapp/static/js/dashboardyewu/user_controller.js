'use strict';

app.controller('UserController', ['$scope', 'UserService', 'WorkFlowService', 'ngDialog','usSpinnerService','FolderService', function ($scope, UserService, WorkFlowService, ngDialog,usSpinnerService,FolderService) {
    var self = this;

    //$scope.user = {id: null, ssoId: '', companyId: '', email: "", state: "", userProfiles: []};
    //$scope.users = [{
    //    "id": 1,
    //    "ssoId": "123",
    //    "password": "",
    //    "workFlowCurrentNode": {},
    //    "companyId": "40288085509cd0ce01509cd374b20000",
    //    "email": "s@s.c",
    //    "state": "Active",
    //    "userProfiles": [{"id": 3, "type": "USER"}, {"id": 3, "type": "ADMIN"}],
    //    folders: []
    //}, {
    //    "id": 2,
    //    "ssoId": "1111111",
    //    "password": "1111111",
    //    "workFlowCurrentNode": {},
    //    "companyId": null,
    //    "email": "z@k.c",
    //    "state": "Active",
    //    "userProfiles": [{"id": 3, "type": "USER"}],
    //    folders: []
    //}, {
    //    "id": 3,
    //    "ssoId": "2222222",
    //    "password": "1111111",
    //    "workFlowCurrentNode": {},
    //    "companyId": "4028808550ea5bfa0150ea5eb5350000",
    //    "email": "sdqfspd@live.com",
    //    "state": "Active",
    //    "userProfiles": [{"id": 3, "type": "USER"}],
    //    folders: []
    //}];



    /**
     * spinner start
     * */

    $scope.errorMsg = {hasMsg: false, isError: false};
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('user-list-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function (flag,msg) {
        if ($scope.spinneractive) {
            usSpinnerService.stop('user-list-spinner');
            $scope.errorMsg.hasMsg = true;
            $scope.errorMsg.isError = !flag;
            $scope.errorMsg.msg = msg;
            $scope.spinneractive = false;
        }
    };

//user-list-spinner
    $scope.loadAll = function () {
        $scope.startSpin();
        UserService.fetchAllUsers()
            .then(
            function (d) {
                $scope.users = d;
                $scope.loadFolders();
            },
            function (errResponse) {
                $scope.stopSpin(false,"error while loading users,please try later");
                console.error('Error while fetching users');
            }
        );
    };

    $scope.loadFolders = function () {
        $scope.startSpin();
        FolderService.getFolderForSelect().then(
            function (response) {
                $scope.folders = response;
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false,"error while loading folders,please try later");
            }
        );
    };


    $scope.updateUser = function (user) {
        $scope.startSpin();
        UserService.updateUser(user, user.id)
            .then(
            function (data) {
                $scope.stopSpin(true);
                user.editing =false;
            },
            function (errResponse) {
                $scope.stopSpin(false,"error while updating user, please try later");
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

    $scope.folders = [];

    $scope.loadAll();


}]);