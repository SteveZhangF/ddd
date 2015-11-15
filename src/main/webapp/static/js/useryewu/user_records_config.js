'use strict';

app.controller('RecordsController', ['$scope', '$filter', 'usSpinnerService', 'RecordService', 'LoginService', 'EmployeeService',function ($scope, $filter, usSpinnerService, RecordService, LoginService,EmployeeService) {

    /**
     * spinner start
     * */

    $scope.errorMsg = {hasMsg: false, isError: false};
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            $scope.errorMsg.hasMsg = true;
            usSpinnerService.spin('user-records-spinner');
            $scope.spinneractive = true;

            $scope.errorMsg.hasMsg = false;
        }
    };
    $scope.stopSpin = function (flag) {
        if ($scope.spinneractive) {
            usSpinnerService.stop('user-records-spinner');
            $scope.errorMsg.hasMsg = true;
            $scope.errorMsg.isError = !flag;
            $scope.spinneractive = false;
        }
    };

    $scope.dayOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Every Day'
    ];
    /**
     * spanner end
     * */

    $scope.loadAll = function () {
        $scope.startSpin();
        RecordService.getAllRecord()
            .then(
            function (data) {
                $scope.records = data;
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
    };

    $scope.loadEmployees = function () {
        var userId = LoginService.getUserInfo().userId;
        $scope.startSpin();
        EmployeeService.getEmployeeByUserId(userId).then(
            function (response) {
                $scope.employees = response;
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
    };

    $scope.loadAll();

    $scope.recordSelect = function (record) {
        $scope.startSpin();
        var userId = LoginService.getUserInfo().userId;
        RecordService.getOneRecord(userId, record.id)
            .then(
            function (response) {
                $scope.selectedRecordConfig = response;
                $scope.loadEmployees();
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);

            }
        );
    };

    $scope.saveRecord = function () {
        $scope.startSpin();
        RecordService.updateRecord($scope.selectedRecordConfig).then(
            function (response) {
                $scope.selectedRecordConfig = response;
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
    };

    $scope.isPreviewShowing = false;

    $scope.preview = function () {
        $scope.isPreviewShowing = !$scope.isPreviewShowing;

        var c = angular.element(angular.element($scope.selectedRecordConfig.tableForm.content));
        angular.element("#preview_temp").html('').append(c);

        var table = angular.element("#preview_temp").find('table')[0];
        angular.element(table).addClass("table");
        for (var i = 0; i < 10; i++) {
            var len = table.rows.length;
            var new_row = table.rows[len - 1].cloneNode(true);
            angular.element(table.rows[len - 1]).remove();
            angular.element(angular.element(table).find('tbody')).append(new_row);
            angular.element(angular.element(table).find('tbody')).append(angular.copy(new_row));

            angular.forEach(new_row.childNodes, function (td) {
                var id = td.id;
                td.innerHTML = getValuesForTable(id, i);

                td.id = "";
            });
        }

        showPDF();
    };
    $scope.content = '';
    //'employee', 'date', 'text','week of month','month of year'
    var getValuesForTable = function (id, i) {
        var def = $scope.selectedRecordConfig.defaultValues;
        var value = def[id];
        var fields = $scope.selectedRecordConfig.tableForm.fields;
        var result = {type: '', value: value};
        angular.forEach(fields, function (f) {
            if (f.id == id) {
                this.value = new TypeDate(value, i)[f.type]();
            }
        }, result);
        return result.value;
    };

    var TypeDate = function (value, i) {
        this.orgvalue = value;
        var today = new Date();
        var prefixesWeek = ['1st', '2nd', '3d', '4th', '5th'];
        var prefixesMonth = ['JAN', 'FEB', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY',
            'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var dayOfWeek = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ];
        return {
            'week of month': function () {
                //value = today+i*7;
                today.setDate(today.getDate() + i * 7);
                var month = today.getUTCMonth();
                return prefixesMonth[month] + " " + prefixesWeek[0 | today.getDate() / 7];
            },
            'text': function () {
                return value;
            },
            'date': function () {
                var day = -1;
                for (var k = 0; k < dayOfWeek.length; k++) {
                    if (dayOfWeek[k] == value) {
                        day = k;
                        break;
                    }
                }
                if (day == -1) {
                    today.setDate(today.getDate() + i);
                } else {
                    today.setDate(today.getDate() + i * 7);
                    today.setDate(today.getDate() - today.getDay() + day + 1);
                }
                return $filter('date')(today, "yyyy/MM/dd");
            },
            'employee': function () {
                for (var k = 0; k < $scope.employees.length; k++) {
                    var e = $scope.employees[k];
                    if (value == e.uuid) {
                        return e.firstName + " " + e.lastName;
                    }
                }
            },
            'month of year': function () {
                today.setUTCMonth(today.getUTCMonth() + i);
                var month = today.getUTCMonth();
                return prefixesMonth[month];
            }
        }
    };

    var showPDF = function () {
        var pdf = new jsPDF('p', 'pt', 'a4');
        var source = $('#preview_temp').get(0);
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
            }, margins);
        angular.element(source).css("display", "none");
    };


}]);

app.factory('RecordService', ['$http', '$q', function ($http, $q) {
    return {
        getOneRecord: function (user_id, tableForm_id) {
            return $http.get('/user/recordConfig/?userId=' + user_id + '&tableFormId=' + tableForm_id)
                .then(
                function (response) {
                    return response.data
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getAllRecord: function () {
            return $http.get('/user/recordConfig/tableForm/')
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },
        updateRecord: function (recordConfig) {
            return $http.put('/user/recordConfig/' + recordConfig.id, recordConfig)
                .then(
                function (response) {
                    return response.data
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }
    };
}]);