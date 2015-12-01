app.controller('FolderEmployeeFieldController', ['$scope', 'FolderService', 'filterFilter', '$timeout', 'MessageService', function ($scope, FolderService, filterFilter, $timeout, MessageService) {
    var EmployeeField = function (name, questionType, options, description) {

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
        f.questionType_ = f.questionType;
        f.options_ = angular.copy(f.options);
    };

    /**
     * save a EmployeeField to the folder($scope.thisFolder)
     * */
    $scope.saveEmployeeField = function (EmployeeField) {
        EmployeeField.name = EmployeeField.name_;
        EmployeeField.options = angular.copy(EmployeeField.options_);
        EmployeeField.description = EmployeeField.description_;
        EmployeeField.questionType = EmployeeField.questionType_;
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
    };

    // for edit employee report
    $scope.froalaOptions = {
        heightMin: 600,
        heightMax: 800,
        events: {
            'froalaEditor.focus': function (e, editor) {
                editor.selection.restore();

            },
            'froalaEditor.blur': function (e, editor) {
                editor.selection.save();
            }
        }
    };

    $scope.editEmployeeReport = function () {
        $scope.employeeReportPromise = FolderService.loadEmployeeReport($scope.thisFolder.id)
            .then(
            function (data) {
                var report = MessageService.handleMsg(data);
                if (report) {
                    $scope.editedEmployeeReport = report;
                    $scope.editingEmployeeReport = true;
                    $scope.froalaOptions.froalaEditor('html.set', '');
                    if ($scope.editedEmployeeReport.content) {
                        var i = $scope.froalaOptions.froalaEditor('html.insert', $scope.editedEmployeeReport.content, true);
                    }
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    }

    $scope.selectEmployeeFieldForEmployeeReport = function (field) {
        angular.forEach($scope.EmployeeFieldNodeList, function (itm) {
            itm.selectedForReport = false;
        });
        field.selectedForReport = true;
        $scope.selectedEmployeeFieldForReport = field;
    };

    $scope.insertEmployeeFieldToEmployeeReport = function () {
        var data = $scope.selectedEmployeeFieldForReport;
        var plugin = angular.element('<plugin></plugin>');
        plugin.attr("question_id", data.id).attr('name', data.name).attr("questionType", data.questionType);

        var formField;
        switch (data.questionType) {
            case 'text':
                formField = angular.element('input');
                formField.attr('type', 'text');
                break;
            case 'select':
                formField = angular.element('select');
                var options = data.options;
                for (var i = 0; i < options.length; i++) {
                    var opt = angular.element("<option></option>");
                    opt.text(options[i].name);
                    opt.attr('value', options[i].value);
                    formField.append(opt);
                }
                if (options.length == 0) {
                    var optN = angular.element("<option></option>");
                    optN.text('Null');
                    formField.append(optN);
                }
                break;
            case 'textarea':
                formField = angular.element('textarea');
                break;
            case 'file':
                formField = angular.element('input');
                formField.attr('type', 'file');
                break;
        }
        formField.attr('disabled', 'true');
        plugin.append(formField);
        var el = angular.element("<div></div>");
        el.append(plugin);
        var txt = "{-" + el.html() + "-}";
        $scope.froalaOptions.froalaEditor('html.insert', txt, true);
        el = null;
    }


}]);