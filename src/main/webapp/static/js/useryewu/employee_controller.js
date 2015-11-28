'use strict';


app.controller('UserEmployeeController', ['$scope', 'EmployeeService', 'LoginService', 'usSpinnerService', '$location', 'MessageService', '$timeout', function ($scope, EmployeeService, LoginService, usSpinnerService, $location, MessageService, $timeout) {
    $scope.employees = [];
    $scope.selectedAll = false;
    $scope.itemPerPage = 5;
    $scope.editing = false;
    $scope.editedEmployee={uuid:-1};
    var userId = LoginService.getUserInfo().userId;
    var newEmployee = {isNew: true};
    $scope.loadAll = function () {
        EmployeeService.getEmployeeByUserId(LoginService.getUserInfo().userId).then(
            function (data) {
                var list = MessageService.handleMsg(data);
                if (list) {
                    $scope.employees = list;
                    $scope.employees.push(newEmployee);
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
        EmployeeService.deleteEmployees(ids).then(function (response) {
            var list = MessageService.handleMsg(response);
            if (list) {
                $scope.employees = list;
            }
        }, function (err) {
            MessageService.handleServerErr(err);
        });
    };

    //$scope.deleteSelectedEmployees = function () {
    //    var ids = [];
    //    angular.forEach($scope.employees, function (itm) {
    //        if (itm.selected === true) {
    //            ids.push(itm.uuid);
    //        }
    //    });
    //    EmployeeService.deleteEmployees(ids).then(function (response) {
    //        $scope.stopSpin();
    //        $scope.loadAll();
    //        $scope.employeeError.success = true;
    //        $scope.employeeError.msg = "Success!";
    //        $scope.employeeError.hasError = false;
    //    }, function (err) {
    //        $scope.stopSpin();
    //        $scope.employeeError.hasError = true;
    //        $scope.employeeError.success = false;
    //        $scope.employeeError.msg = "Error while loading data, please try later!";
    //    });
    //};
    $scope.editEmployee = function (index) {
        $scope.editing = true;
        $scope.editedEmployee = $scope.employees[index];
        $timeout(function () {
            var all = angular.element('#card-parent').children('div');
            //angular.element(angular.element('#card-parent')).scrollTop(all[index].offsetTop);
            $timeout(function () {
                var all = angular.element('#card-parent').children('div');
                angular.element('#card-parent').animate({'scrollTop':all[index].offsetTop},500);
            });
        });
    };

    $scope.saveEmployee = function (employee) {
        if (employee.isNew) {
            createEmployee(employee);
        } else {
            updateEmployee(employee);
        }
        $scope.editing = false;
    };

    var createEmployee = function (employee) {
        EmployeeService.createEmployee(userId, employee).then(
            function (data) {
                var list = MessageService.handleMsg(data);
                if (list) {
                    $scope.editedEmployee={};
                    $scope.employees = list;
                    newEmployee = {isNew:true};
                    $scope.employees.push(newEmployee);
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    var updateEmployee = function (employee) {
        EmployeeService.updateEmployee(userId, employee, employee.uuid).then(
            function (data) {
                var list = MessageService.handleMsg(data);
                if (list) {
                    $scope.editedEmployee={uuid:-1};
                    $scope.employees = list;
                    newEmployee = {isNew:true};
                    $scope.employees.push(newEmployee);
                }
            },
            function (errData) {
                MessageService.handleServerErr(err);
            }
        );
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
