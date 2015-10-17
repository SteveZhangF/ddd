'use strict';
app.directive('checkList', function () {
    return {
        scope: {
            list: '=checkList',
            numList: '=checkNumList',
            value: '@',
            'check': '&onCheck'
        },
        link: function (scope, elem, attrs) {
            var handler = function (setup) {
                var checked = elem.prop('checked');
                var index = scope.list.indexOf(scope.value);

                if (checked && index == -1) {
                    if (setup) {
                        elem.prop('checked', false);
                    } else {
                        scope.list.push(scope.value);
                        scope.numList ? scope.numList.push(attrs.reqNum) : "";
                    }
                } else if (!checked && index != -1) {
                    if (setup) {
                        elem.prop('checked', true);
                    } else {
                        scope.list.splice(index, 1);
                        scope.numList ? scope.numList.splice(index, 1) : "";
                    }

                }
            };

            var setupHandler = function () {
                handler(true);
            };
            var changeHandler = function () {
                handler(false);
            };

            elem.bind('change', function () {
                scope.$apply(changeHandler);
            });
            scope.$watch('list', setupHandler, true);
        }
    };
});
app.controller('UserController', ['$scope', 'UserService', 'WorkFlowService', 'ngDialog', function ($scope, UserService, WorkFlowService, ngDialog) {
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

    $scope.workflow = {
        all: [{
            id: 1, name: "diyige", index: '1'
        }, {
            id: 2, name: "dierge", index: '2'
        }],
        checked: [],
        checkedname: []
    }
    var dialog;
    $scope.ok = function () {
        UserService.updateUserWorkflow($scope.user.id, $scope.workflow.checked);
        console.log($scope.workflow.checked);
        if(dialog){
            dialog.close("");
        }

    }

    $scope.cancel = function () {
        if(dialog){
            dialog.close("");
        }
    }


    $scope.editor = function (user) {
        $scope.user = user;
        WorkFlowService.fetchAllWorkFlow().then(function (wf) {
            $scope.workflow.all = wf;
            $scope.workflow.checked.length = 0;
            var wf = eval(user.workflows);
            for (var i = 0; i < wf.length; i++) {
                $scope.workflow.checked.push(wf[i]);
            }
        });
        dialog = ngDialog.open({
            template: 'user-editor.html',
            scope: $scope
        });
    }

}]);