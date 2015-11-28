app.controller('FolderEmployeeFieldController', ['$scope', 'FolderService', 'filterFilter', '$timeout', 'MessageService', function ($scope, FolderService, filterFilter, $timeout, MessageService) {
    var EmployeeField = function (name, EmployeeFieldType, options, description) {

    };
    $scope.types = ['textarea', "select", "text", "file"];

    /**
     * for check EmployeeField in the table start
     * */
    $scope.selectEmployeeField = function () {
        $scope.selectedAllEmployeeField = $scope.EmployeeFieldNodeList.every(function (itm) {
            return itm.selected;
        })
    };
    $scope.selectAllEmployeeField = function () {
        var toggleStatus = !$scope.selectedAllEmployeeField;
        angular.forEach($scope.EmployeeFieldNodeList, function (itm) {
            itm.selected = !toggleStatus;
        });
    };
    /**
     * for check EmployeeField in the table end
     * */

        // hold all the EmployeeField nodes in the $scope.thisFolder
    $scope.EmployeeFieldNodeList = [];
    $scope.loadAllEmployeeFieldNodes = function () {
        $scope.EmployeeFieldTablePromise = FolderService.getElementBasedOnType($scope.thisFolder.id, "EMPLOYEE_FIELD")
            .then(
            function (data) {
                var EmployeeFields = MessageService.handleMsg(data);
                if (EmployeeFields) {
                    $scope.EmployeeFieldNodeList = EmployeeFields.children;
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };
    $timeout(function () {
        $scope.loadAllEmployeeFieldNodes()
    });

    /**
     * when click on the EmployeeField name in the table
     * */
    $scope.newEmployeeField = {};

    $scope.editEmployeeField = function (f) {
        if (!f.options) {
            f.options = [];
        }
        f.editing = true;
        f.name_ = f.name;
        f.description_ = f.description;
        f.EmployeeFieldType_ = f.EmployeeFieldType;
        f.options_ = angular.copy(f.options);
    };

    /**
     * save a EmployeeField to the folder($scope.thisFolder)
     * */
    $scope.saveEmployeeField = function (EmployeeField) {
        EmployeeField.name = EmployeeField.name_;
        EmployeeField.options = angular.copy(EmployeeField.options_);
        EmployeeField.description = EmployeeField.description_;
        EmployeeField.EmployeeFieldType = EmployeeField.EmployeeFieldType_;
        $scope.newEmployeeFieldPromise = FolderService.saveEmployeeField($scope.thisFolder.id, EmployeeField)
            .then(
            function (d) {
                var EmployeeField = MessageService.handleMsg(d);
                if (EmployeeField) {
                    $scope.EmployeeFieldNodeList.push(EmployeeField);
                    $scope.newEmployeeField.editing = false;
                    $scope.newEmployeeField = {};
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    /**
     * update a EmployeeField
     * */
    $scope.updateEmployeeField = function (EmployeeFieldNode) {

        EmployeeFieldNode.name = EmployeeFieldNode.name_;
        EmployeeFieldNode.description = EmployeeFieldNode.description_;
        EmployeeFieldNode.options = angular.copy(EmployeeFieldNode.options_);
        $scope.EmployeeFieldEditPromise = FolderService.updateEmployeeField($scope.thisFolder.id, EmployeeFieldNode)
            .then(
            function (data1) {
                var q = MessageService.handleMsg(data1);
                if (q) {
                    $scope.loadAllEmployeeFieldNodes();
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    $scope.deleteSelectedEmployeeField = function () {
        var r = confirm("Do you want to delete the selected item?");
        if (r == true) {
            var selected = [];
            for (var i = 0; i < $scope.EmployeeFieldNodeList.length; i++) {
                if ($scope.EmployeeFieldNodeList[i].selected) {
                    selected.push($scope.EmployeeFieldNodeList[i].id);
                }
            }
            $scope.EmployeeFieldTablePromise = FolderService.deleteSelectElements($scope.thisFolder.id, selected, "EMPLOYEE_FIELD").then(
                function (data) {
                    var elementsUnderParentFolderAfterDeleted = MessageService.handleMsg(data);
                    if (elementsUnderParentFolderAfterDeleted) {
                        $scope.EmployeeFieldNodeList = elementsUnderParentFolderAfterDeleted.children;

                        $scope.selectedAllEmployeeField = false;
                        $scope.selectAllEmployeeField();

                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        }
    };


    $scope.newOp = {name: '', value: ''};
    $scope.addOption = function (EmployeeField) {
        if (!EmployeeField.options_) {
            EmployeeField.options = [];
            EmployeeField.options_ = [];
        }
        EmployeeField.options_.push({name: $scope.newOp.name, value: $scope.newOp.value});
        $scope.newOp.name = '';
        $scope.newOp.value = '';
    };

    $scope.removeOption = function (EmployeeField, i) {
        EmployeeField.options_.splice(i, 1);
    }
}]);