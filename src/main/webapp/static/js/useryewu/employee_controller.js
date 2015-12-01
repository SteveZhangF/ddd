'use strict';


app.controller('UserEmployeeController', ['$scope', 'EmployeeService', 'LoginService', 'MessageService', '$timeout', 'UserFolderService', function ($scope, EmployeeService, LoginService, MessageService, $timeout, UserFolderService) {
    $scope.employees = [];
    $scope.selectedAll = false;
    $scope.itemPerPage = 5;
    $scope.editing = false;
    $scope.editedEmployee = {uuid: -1};
    var userId = LoginService.getUserInfo().userId;
    var newEmployee = {isNew: true};
    $scope.loadAll = function () {
        $scope.employeeAllPromise = EmployeeService.getEmployeeByUserId(LoginService.getUserInfo().userId).then(
            function (data) {
                var list = MessageService.handleMsg(data);
                if (list) {
                    $scope.employees = list;
                    $scope.employees.push(newEmployee);
                    getCustomizedField();

                }
            }, function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    $timeout(function () {
        $scope.loadAll();
    });

    $scope.select = function () {
        $scope.selectedAll = $scope.employees.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAll = function () {
        var toggleStatus = !$scope.selectedAll;
        angular.forEach($scope.employees, function (itm) {
            itm.selected = !toggleStatus;
        });
    };


    $scope.deleteEmployee = function (employee) {
        var ids = [];
        ids.push(employee.uuid);
        var deleted = confirm("delete employee?");
        if (deleted) {
            EmployeeService.deleteEmployees(ids).then(function (response) {
                var list = MessageService.handleMsg(response);
                if (list) {
                    $scope.employees = list;
                }
            }, function (err) {
                MessageService.handleServerErr(err);
            });
        }
    };

    $scope.editEmployee = function (index) {
        $scope.editing = true;
        $timeout(function () {
            var all = angular.element('#card-parent').children('div');
            angular.element('#card-parent').animate({'scrollTop': all[index].offsetTop}, 500);
        });
        $scope.employeeEditPromise = EmployeeService.getEmployee(LoginService.getUserInfo().userId, $scope.employees[index].uuid)
            .then(
            function (msg) {
                var employee = MessageService.handleMsg(msg);
                if (employee) {
                    $scope.editedEmployee = employee;
                    setCustomizedEmployeeFieldsValue($scope.customizedEmployeeFields, employee.records);
                    //if($scope.viewingReports){
                    //    $scope.viewReports($scope.editedEmployee);
                    //}
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    $scope.saveEmployee = function (employee) {
        if (employee.isNew) {
            createEmployee(employee);
        } else {
            updateEmployee(employee);
        }
    };

    var createEmployee = function (employee) {
        var records = [];
        for (var i = 0; i < $scope.customizedEmployeeFields.length; i++) {
            var record = new Record($scope.customizedEmployeeFields[i].id, employee.uuid, LoginService.getUserInfo().userId, $scope.customizedEmployeeFields[i].value);
            records.push(record);
        }
        employee.records = records;
        $scope.employeeEditPromise = EmployeeService.createEmployee(userId, employee).then(
            function (data) {
                var list = MessageService.handleMsg(data);
                if (list) {
                    $scope.editedEmployee = {uuid: -1};
                    $scope.employees = list;
                    newEmployee = {isNew: true};
                    $scope.employees.push(newEmployee);
                    $scope.editing = false;
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    var updateEmployee = function (employee) {
        var records = [];
        for (var i = 0; i < $scope.customizedEmployeeFields.length; i++) {
            var record = new Record($scope.customizedEmployeeFields[i].id, employee.uuid, LoginService.getUserInfo().userId, $scope.customizedEmployeeFields[i].value);
            records.push(record);
        }
        employee.records = records;
        $scope.employeeEditPromise = EmployeeService.updateEmployee(userId, employee, employee.uuid).then(
            function (data) {
                var list = MessageService.handleMsg(data);
                if (list) {
                    $scope.editedEmployee = {uuid: -1};
                    $scope.employees = list;
                    newEmployee = {isNew: true};
                    $scope.employees.push(newEmployee);
                    $scope.editing = false;
                }
            },
            function (errData) {
                MessageService.handleServerErr(err);
            }
        );
    };

    $scope.customizedEmployeeFields = [];
    var getCustomizedField = function () {
        $scope.employeeAllPromise = EmployeeService.getEmployeeCustomizedField(LoginService.getUserInfo().userId)
            .then(
            function (data) {
                var f = MessageService.handleMsg(data);
                if (f) {
                    $scope.customizedEmployeeFields = f;
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    //var getCustomizedEmployeeFieldsValue  = function (employee) {
    //    setCustomizedEmployeeFieldsValue($scope.customizedEmployeeFields,employee.records);
    //}

    var setCustomizedEmployeeFieldsValue = function (fields, values) {
        for (var i = 0; i < fields.length; i++) {
            var j = 0;
            for (j = 0; j < values.length; j++) {
                if (fields[i].id == values[j].questionId) {
                    fields[i].value = values[j].value;
                    break;
                }
            }
            if (j == values.length) {
                fields[i].value = '';
            }
        }
    }
    var Record = function (questionId, oe_id, user_id, value) {
        this.questionId = questionId;
        this.oeId = oe_id;
        this.userId = user_id;
        this.value = value;
    };
    //var saveCustomizedEmployeeFieldsValue = function (employeeId) {
    //    var records = [];
    //    for(var i=0;i<$scope.customizedEmployeeFields.length;i++){
    //        var record = new Record($scope.customizedEmployeeFields[i].id,employeeId,LoginService.getUserInfo().userId,$scope.customizedEmployeeFields.value);
    //        records.push(record);
    //    }
    //
    //    $scope.employeeEditPromise = UserFormRecordService.saveQuestionValues(records)
    //        .then(
    //        function (data) {
    //            MessageService.handleMsg(data);
    //        },
    //        function (err) {
    //            MessageService.handleServerErr(err);
    //        }
    //    );
    //}

    // view report

    $scope.selectAndShowEmployee = function (employee) {
        angular.forEach($scope.employees, function (rep) {
            rep.selected = rep.uuid == employee.uuid;
        });
        $scope.viewEmployeeReportPromise = EmployeeService.getEmployee(LoginService.getUserInfo().userId, $scope.employees[index].uuid)
            .then(
            function (msg) {
                var employee = MessageService.handleMsg(msg);
                if (employee) {
                    $timeout(function () {
                        var reports=[];
                        reports.push($scope.folderTree.currentNode);
                        handleEmployeeReports(reports, employee);
                    });
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );


    };

    $scope.employeeReports = [];
    $scope.viewReports = function (employee) {
        if ($scope.employeeReports.length == 0) {
            $scope.employeeEditPromise = UserFolderService.getUserEmployeeReports(LoginService.getUserInfo().userId)
                .then(
                function (response) {
                    var rep = MessageService.handleMsg(response);
                    if (rep) {
                        $scope.employeeReports = rep;
                        handleEmployeeReports($scope.employeeReports, employee);
                        $scope.editedEmployee.viewingReports = true;
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        } else {
            handleEmployeeReports($scope.employeeReports, employee);
            $scope.editedEmployee.viewingReports = true;
        }
    };

    var handleEmployeeReports = function (reports, employee) {
        var customizedFields = employee.records;
        for (var i = 0; i < reports.length; i++) {
            var report = reports[i];
            var cfs = report.questions;
            var finish = 0;
            for (var k = 0; k < cfs.length; k++) {
                var j = 0;
                for (j = 0; j < customizedFields.length; j++) {
                    if (customizedFields[j].questionId == cfs[k].id) {
                        cfs[k].value = customizedFields[j].value;
                        if (cfs[k].value && cfs[k].value != '') {
                            finish++;
                        }
                        break;
                    }
                }
                if (j == customizedFields.length || cfs[k].value == '') {
                    cfs[k].value = '{PLEASE FILL FIELD ' + cfs[k].name + ' }';
                }
            }
            report.percent = 100 * finish / cfs.length;
        }
        $scope.selectAndShowReport(reports[0]);
    };

    $scope.selectAndShowReport = function (report) {
        angular.forEach($scope.employeeReports, function (rep) {
            rep.selected = rep.id == report.id;
        });
        $timeout(function () {
            viewPDF(report);
        });

    };

    var viewPDF = function (file) {
        var formElement = angular.element(file.content.replace(/{-/gi, '').replace(/-}/gi, ''));
        var records = file.questions;
        for (var j = 0; j < records.length; j++) {
            var record = records[j];
            var record_question_id = record.id;
            var questionElement = angular.element(formElement.find("plugin[question_id='" + record_question_id + "']"));
            var span = angular.element("<span></span>");
            span.text(record.value);
            questionElement.replaceWith(span);
        }
        angular.element('#form_container').html('').append(formElement);
        $scope.showPDF();
    }
    // show pdf
    $scope.showPDF = function () {
        var pdf = new jsPDF('p', 'pt', 'a4');
        var source = $('#form_container').get(0);
        angular.element(source).css("display", "block");
        var specialElementHandlers = {
            '#bypassme': function (element, renderer) {
                return true
            }
        };
        var margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 522
        };
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
        pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
            },

            function (dispose) {
                $scope.content = pdf.output("dataurlstring");
                //pdf.autoPrint();  // <<--------------------- !!
                //pdf.output('dataurlnewwindow');
            }, margins);
        angular.element(source).css("display", "none");
    };

}]);


//
//app.controller('UserEmployeeEditController', ['$scope', 'EmployeeService', 'UserEmploymentStatusService', 'UserJobTitleService', '$location', 'FileUploader', 'LoginService', 'usSpinnerService', function ($scope, EmployeeService, UserEmploymentStatusService, UserJobTitleService, $location, FileUploader, LoginService, usSpinnerService) {
//    $scope.editedEmployee = {};
//    $scope.newEmployee = true;
//
//    $scope.jobTitles = [];
//    $scope.employmentStatuses=[];
//
//    /**
//     * spinner start
//     * */
//    $scope.spinneractive = false;
//    $scope.startSpin = function () {
//        if (!$scope.spinneractive) {
//            console.log('loading');
//            usSpinnerService.spin('employee-edit-spinner');
//            $scope.spinneractive = true;
//        }
//    };
//    $scope.stopSpin = function () {
//        if ($scope.spinneractive) {
//            console.log('stoped');
//            usSpinnerService.stop('employee-edit-spinner');
//            $scope.spinneractive = false;
//        }
//    };
//
//    /**
//     * spanner end
//     * */
//
//    $scope.menus = [{name: 'Person Detail', url: 'user/employee_edit_persondetail.html', selected: true}, {
//        name: 'Job',
//        selected: false,
//        url: 'user/employee_edit_job.html'
//    }];
//    $scope.selectedMenu = $scope.menus[0];
//
//    $scope.employeeEditError = {hasError: {error: false, success: false}, msg: ""};
//    var userId = LoginService.getUserInfo().userId;
//    UserEmploymentStatusService.getEmploymentStatusByUserId(userId).then(function (data) {
//            $scope.employmentStatuses = data;
//        }, function (err) {
//            $scope.employmentStatuses=[{name:'NULL,Please create statuses first'}]
//        }
//    );
//
//    UserJobTitleService.getJobTitleByUserId(userId).then(
//        function (data) {
//            $scope.jobTitles = data;
//        },
//        function (err) {
//            $scope.jobTitles=[{name:'NULL,Please create Job Titles first'}]
//        }
//    );
//
//
//    var uuid = $location.search().employeeId;
//    if (uuid) {
//        $scope.startSpin();
//        EmployeeService.getEmployee(uuid).then(function (response) {
//            $scope.editedEmployee = response;
//            $scope.newEmployee = false;
//            $scope.stopSpin();
//            $scope.employeeEditError.hasError.error = false;
//            $scope.thumb.preview = false;
//            $scope.thumb.file = $scope.editedEmployee.imagePath;
//            $scope.thumb.headImageCount = 1;
//            $scope.contractPreview.preview = false;
//            $scope.contractPreview.file = $scope.editedEmployee.contractDetail;
//            $scope.contractPreview.pdfCount = 1;
//
//            //loading job titles and employment status .etc.
//
//        }, function (err) {
//            $scope.stopSpin();
//            $scope.employeeEditError.hasError.error = true;
//            $scope.employeeEditError.hasError.success = false;
//            $scope.employeeEditError.msg = "Error while loading employee information,Please try later!";
//        });
//    }
//
//    $scope.menuSelect = function (menu) {
//        angular.forEach($scope.menus, function (itm) {
//            itm.selected = itm.name === menu.name;
//        });
//        $scope.selectedMenu = menu;
//    };
//
//    $scope.save = function () {
//        if (uuid) {
//            updateEmployee();
//        } else {
//            createEmployee();
//        }
//    };
//
//    var createEmployee = function () {
//        $scope.startSpin();
//        $scope.editedEmployee.userId = LoginService.getUserInfo().userId;
//        EmployeeService.createEmployee($scope.editedEmployee).then(
//            function (data) {
//                $scope.editedEmployee = data;
//                $scope.employeeEditError.hasError.error = false;
//                $scope.employeeEditError.hasError.success = true;
//                $scope.employeeEditError.msg = "Success!";
//
//                if (data.uuid) {
//                    $location.search('employeeId', data.uuid);
//                }
//                $location.path('/view_employee');
//            },
//            function (err) {
//                $scope.stopSpin();
//                $scope.employeeEditError.hasError.error = true;
//                $scope.employeeEditError.hasError.success = false;
//                $scope.employeeEditError.msg = "Error while creating employee, please try later!";
//            }
//        );
//    };
//
//    var updateEmployee = function () {
//        $scope.startSpin();
//        EmployeeService.updateEmployee($scope.editedEmployee, $scope.editedEmployee.uuid).then(
//            function (data) {
//                $scope.stopSpin();
//                $scope.editedEmployee = data;
//                $scope.employeeEditError.hasError.error = false;
//                $scope.employeeEditError.hasError.success = true;
//                $scope.employeeEditError.msg = "Success!";
//            },
//            function (errData) {
//                $scope.stopSpin();
//                $scope.employeeEditError.hasError.error = true;
//                $scope.employeeEditError.hasError.success = false;
//                $scope.employeeEditError.msg = "Error while updating employee information, please try later!";
//            }
//        );
//    };
//
//
//    var headImageUploader = $scope.headImageUploader = new FileUploader({
//        url: '/upload/',
//        formData: [{type: 'employeeHead'}, {userId: LoginService.getUserInfo().userId}]
//    });
//    if (LoginService.getUserInfo().accessToken) {
//        var token = LoginService.getUserInfo();
//        if (token) {
//            headImageUploader.headers['X-AUTH-TOKEN'] = token.accessToken;
//        }
//    } else {
//        headImageUploader.headers['X-AUTH-TOKEN'] = '0';
//    }
//
//    headImageUploader.onAfterAddingFile = function (fileItem) {
//        headImageUploader.queue.length = 0;
//        headImageUploader.queue.push(fileItem);
//        $scope.thumb.preview = true;
//        $scope.thumb.file = fileItem._file;
//        $scope.thumb.headImageCount = $scope.thumb.headImageCount + 1;
//    };
//    headImageUploader.onSuccessItem = function (item, response, status, headers) {
//        console.log(response);
//        $scope.editedEmployee.imagePath = response;
//    };
//
//    $scope.thumb = {
//        preview: false,
//        file: $scope.editedEmployee.imagePath,
//        height: '50%',
//        width: '100%',
//        headImageCount: -1,
//    };
//
//    /**
//     *  contract uploader
//     * */
//    var contractUploader = $scope.contractUploader = new FileUploader({
//        url: '/upload/',
//        formData: [{type: 'employeeContract'}, {userId: LoginService.getUserInfo().userId}]
//    });
//
//    if (LoginService.getUserInfo().accessToken) {
//        var token = LoginService.getUserInfo();
//        if (token) {
//            contractUploader.headers['X-AUTH-TOKEN'] = token.accessToken;
//        }
//    } else {
//        contractUploader.headers['X-AUTH-TOKEN'] = '0';
//    }
//    contractUploader.onAfterAddingFile = function (fileItem) {
//        contractUploader.queue.length = 0;
//        contractUploader.queue.push(fileItem);
//        $scope.contractPreview.preview = true;
//        $scope.contractPreview.file = fileItem._file;
//        $scope.contractPreview.pdfCount = $scope.contractPreview.pdfCount + 1;
//    };
//    contractUploader.onSuccessItem = function (item, response, status, headers) {
//        $scope.editedEmployee.contractDetail = response;
//    };
//
//    $scope.contractPreview = {
//        preview: false,
//        file: $scope.editedEmployee.contractDetail,
//        pdfCount: -1,
//        height: '100%',
//        width: '100%'
//    }
//
//
//}]);
//
