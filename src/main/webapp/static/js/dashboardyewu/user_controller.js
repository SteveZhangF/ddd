'use strict';

app.controller('UserController', ['$scope', 'UserService', 'WorkFlowService', 'ngDialog', function ($scope, UserService, WorkFlowService, ngDialog) {
    var self = this;

    //$scope.user = {id: null, ssoId: '', companyId: '', email: "", state: "", userProfiles: []};
    $scope.users = [{
        "id": 1,
        "ssoId": "123",
        "password": "",
        "workFlowCurrentNode": {},
        "companyId": "40288085509cd0ce01509cd374b20000",
        "email": "s@s.c",
        "state": "Active",
        "userProfiles": [{"id": 3, "type": "USER"}]
    }, {
        "id": 2,
        "ssoId": "1111111",
        "password": "1111111",
        "workFlowCurrentNode": {},
        "companyId": null,
        "email": "z@k.c",
        "state": "Active",
        "userProfiles": [{"id": 3, "type": "USER"}]
    }, {
        "id": 3,
        "ssoId": "2222222",
        "password": "1111111",
        "workFlowCurrentNode": {},
        "companyId": "4028808550ea5bfa0150ea5eb5350000",
        "email": "sdqfspd@live.com",
        "state": "Active",
        "userProfiles": [{"id": 3, "type": "USER"}]
    }];


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
            self.fetchAllUsers(),
            function (errResponse) {
                console.error('Error while creating User.');
            }
        );
    };

    self.updateUser = function (user, id) {
        UserService.updateUser(user, id)
            .then(
            self.fetchAllUsers(),
            function (errResponse) {
                console.error('Error while updating User.');
            }
        );
    };

    self.deleteUser = function (id) {
        UserService.deleteUser(id)
            .then(
            self.fetchAllUsers(),
            function (errResponse) {
                console.error('Error while deleting User.');
            }
        );
    };

    self.fetchAllUsers();


    self.remove = function (id) {
        self.deleteUser(id);
    };

    $scope.workflow = {
        all: [{
            id: 1, name: "diyige", index: '1'
        }, {
            id: 2, name: "dierge", index: '2'
        }],
        checked: []
    };
    var dialog;
    $scope.ok = function () {
        for (var i = 0; i < $scope.workflow.checked.length; i++) {
            if ($scope.user.workFlowCurrentNode[$scope.workflow.checked[i]] == undefined) {
                $scope.user.workFlowCurrentNode[$scope.workflow.checked[i]] = '';
            }
        }
        UserService.updateUserWorkflow($scope.user.id, $scope.user.workFlowCurrentNode);
        if (dialog) {
            dialog.close("");
        }

    };

    $scope.cancel = function () {
        if (dialog) {
            dialog.close("");
        }
    };


    $scope.editor = function (user) {
        $scope.user = user;
        var wf = $scope.workflow.all;
        $scope.workflow.checked.length = 0;
        console.log(user.workFlowCurrentNode);
        for (var i = 0; i < wf.length; i++) {
            if (user.workFlowCurrentNode[wf[i].id] != undefined) {
                console.log("true");
                $scope.workflow.checked.push(wf[i].id);
            }
        }
        WorkFlowService.fetchAllWorkFlow().then(function (wf) {
            $scope.workflow.all = wf;
            $scope.workflow.checked.length = 0;
            for (var i = 0; i < wf.length; i++) {
                if (user.workFlowCurrentNode[wf.id]) {
                    $scope.workflow.checked.push(wf[i]);
                }
            }
            //for (var i = 0; i < wf.length; i++) {
            //    $scope.workflow.checked.push(wf[i]);
            //}
        });
        dialog = ngDialog.open({
            template: 'user-editor.html',
            scope: $scope
        });
    }

}]);