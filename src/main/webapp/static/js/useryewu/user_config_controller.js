'use strict';

app.controller('UserConfigController', ['$scope', function ($scope) {
    $scope.menus = [
        {name: 'Account Config', url: 'user/account_config.html', selected: true},
        {name: 'Job', selected: false, subMenu:
            [
                {name:'Job Titles',url:'user/job_title_config.html',selected:false},
                {name:'Employment Status',url:'user/job_employment_status_config.html',selected:false}
            ]
        }
    ];
    $scope.selectedMenu = $scope.menus[0];
    $scope.menuSelect = function (menu) {
        angular.forEach($scope.menus, function (itm) {
            itm.selected = itm.name === menu.name;
        });
        $scope.selectedMenu = menu;
    };
    $scope.subMenuSelect = function (subMenu) {
        angular.forEach($scope.selectedMenu.subMenu, function (itm) {
            itm.selected = itm.name === subMenu.name;
        });
        $scope.selectedMenu.url = subMenu.url;
    }
}]);

app.controller("AccountConfigController", ['$scope', 'LoginService', function ($scope, LoginService) {
    $scope.user = {ssoId: LoginService.getUserInfo().userName, email: 'd@d', password: 's'};
    $scope.hasError = {error: false, success: false};
    $scope.update = function (user) {
        LoginService.updateUser(user).then(
            function (response) {
                LoginService.login(user.ssoId, user.password);
                $scope.hasError.error = false;
                $scope.hasError.success = true;
            },
            function (err) {
                $scope.hasError.error = true;
                $scope.hasError.success = false;
            }
        );
    }

}]);

app.controller("JobTitleController", ['$scope', 'usSpinnerService', '$timeout', 'LoginService', 'UserJobTitleService', function ($scope, usSpinnerService, $timeout, LoginService, UserJobTitleService) {
    /**
     * spinner start
     * */
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('job-title-list-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function () {
        if ($scope.spinneractive) {
            usSpinnerService.stop('job-title-list-spinner');
            $scope.spinneractive = false;
        }
    };

    /**
     * spanner end
     * */
    $scope.hasError = {error:false,success:false};
    $scope.setError = function (ifError,data) {
        console.log(data);
        $scope.hasError.error=ifError;
        $scope.hasError.success = !ifError;
    };

    $scope.loadAll = function () {
        $scope.startSpin();
        var userId = LoginService.getUserInfo().userId;
        UserJobTitleService.getJobTitleByUserId(userId).then(
            function (data) {
                $scope.jobTitles = data;
                $scope.employmentStatusesDisplay = angular.copy($scope.employmentStatuses);
                $scope.stopSpin();
                $scope.setError(false,data);
            },
            function (err) {
                $scope.setError(true,err);
                $scope.stopSpin();
            }
        );
    };

    $scope.loadAll();

    $scope.select = function () {
        $scope.selectedAll = $scope.jobTitles.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAll = function () {
        var toggleStatus = !$scope.selectedAll;
        angular.forEach($scope.jobTitles, function (itm) {
            itm.selected = !toggleStatus;
        });
    };

    $scope.deleteSelectedJobTitles = function () {
        var ids = [];
        $scope.startSpin();
        angular.forEach($scope.jobTitles, function (itm) {
            if (itm.selected === true) {
                ids.push(itm.uuid);
            }
        });
        console.log(ids);
        UserJobTitleService.deleteJobTitles(ids).then(
            function (data) {
                $scope.loadAll();
                $scope.setError(false,data);
            },
            function (err) {
                $scope.loadAll();
                $scope.setError(true,err);
            }
        );
        //delete
    };

    $scope.newJobTitle = {name: '', description: '', editing: false,isNew:true};
    $scope.editJobTitle = function (jobTitle) {
        jobTitle.editing = !jobTitle.editing;
    };

    $scope.saveTitle = function (jobTitle) {
        jobTitle.userId = LoginService.getUserInfo().userId;

        if(jobTitle.isNew){

            UserJobTitleService.saveJobTitle(jobTitle).then(
                function (data) {
                    $scope.newJobTitle.name="";
                    $scope.newJobTitle.description="";
                    $scope.newJobTitle.editing = false;
                    $scope.newJobTitle.isNew = true;
                    $scope.loadAll();
                    $scope.setError(false,data);
                },
                function (err) {
                    $scope.loadAll();
                    $scope.setError(true,err);
                }
            );
        }else{
            UserJobTitleService.updateJobTitle(jobTitle).then(
                function (data) {
                    $scope.loadAll();
                    $scope.setError(false,data);
                },
                function (err) {
                    $scope.loadAll();
                    $scope.setError(true,err);
                }
            )
        }

    };

    $scope.cancelTitle = function (jobTitle) {
        $scope.loadAll();
    }
}]);

app.controller("EmploymentStatusController", ['$scope',  'usSpinnerService', '$timeout', 'LoginService', 'UserEmploymentStatusService',function ($scope,usSpinnerService,$timeout,LoginService,UserEmploymentStatusService) {
    /**
     * spinner start
     * */
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('employment-status-list-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function () {
        if ($scope.spinneractive) {
            usSpinnerService.stop('employment-status-list-spinner');
            $scope.spinneractive = false;
        }
    };

    /**
     * spanner end
     * */
    $scope.hasError = {error:false,success:false};
    $scope.setError = function (ifError,data) {
        console.log(data);
        $scope.hasError.error=ifError;
        $scope.hasError.success = !ifError;
    };

    $scope.loadAll = function () {
        $scope.startSpin();
        var userId = LoginService.getUserInfo().userId;
        UserEmploymentStatusService.getEmploymentStatusByUserId(userId).then(
            function (data) {
                $scope.employmentStatuses = data;
                $scope.employmentStatusesDisplay = angular.copy($scope.employmentStatuses);
                $scope.stopSpin();
                $scope.setError(false,data);
            },
            function (err) {
                $scope.setError(true,err);
                $scope.stopSpin();
            }
        );
    };

    $scope.loadAll();

    $scope.select = function () {
        $scope.selectedAll = $scope.employmentStatuses.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAll = function () {
        var toggleStatus = !$scope.selectedAll;
        angular.forEach($scope.employmentStatuses, function (itm) {
            itm.selected = !toggleStatus;
        });
    };

    $scope.deleteSelectedEmploymentStatuses = function () {
        var ids = [];
        $scope.startSpin();
        angular.forEach($scope.employmentStatuses, function (itm) {
            if (itm.selected === true) {
                ids.push(itm.uuid);
            }
        });
        console.log(ids);
        UserEmploymentStatusService.deleteEmploymentStatus(ids).then(
            function (data) {
                $scope.loadAll();
                $scope.setError(false,data);
            },
            function (err) {
                $scope.loadAll();
                $scope.setError(true,err);
            }
        );
        //delete
    };

    $scope.newEmploymentStatus = {name: '', description: '', editing: false,isNew:true};
    $scope.editEmploymentStatus = function (employmentStatus) {
        employmentStatus.editing = !employmentStatus.editing;
    };

    $scope.saveEmploymentStatus = function (employmentStatus) {
        employmentStatus.userId = LoginService.getUserInfo().userId;

        if(employmentStatus.isNew){

            UserEmploymentStatusService.saveEmploymentStatus(employmentStatus).then(
                function (data) {
                    $scope.newEmploymentStatus.name="";
                    $scope.newEmploymentStatus.description="";
                    $scope.newEmploymentStatus.editing = false;
                    $scope.newEmploymentStatus.isNew = true;
                    $scope.loadAll();
                    $scope.setError(false,data);
                },
                function (err) {
                    $scope.loadAll();
                    $scope.setError(true,err);
                }
            );
        }else{
            UserEmploymentStatusService.updateEmploymentStatus(employmentStatus).then(
                function (data) {
                    $scope.loadAll();
                    $scope.setError(false,data);
                },
                function (err) {
                    $scope.loadAll();
                    $scope.setError(true,err);
                }
            )
        }

    };

}]);