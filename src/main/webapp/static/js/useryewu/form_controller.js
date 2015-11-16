'use strict';

app.controller('DocumentViewController', ['$scope', '$filter', 'UserFormService', 'LoginService', 'EmployeeService', 'RecordService', 'UserWorkFlowService', 'usSpinnerService', function ($scope, $filter, UserFormService, LoginService, EmployeeService, RecordService, UserWorkFlowService, usSpinnerService) {
    /**
     * spinner start
     * */

    $scope.errorMsg = {hasMsg: false, isError: false};
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            $scope.errorMsg.hasMsg = true;
            usSpinnerService.spin('user-document-view-spinner');
            $scope.spinneractive = true;

            $scope.errorMsg.hasMsg = false;
        }
    };
    $scope.stopSpin = function (flag) {
        if ($scope.spinneractive) {
            usSpinnerService.stop('user-document-view-spinner');
            $scope.errorMsg.hasMsg = true;
            $scope.errorMsg.isError = !flag;
            $scope.spinneractive = false;
        }
    };

    /**
     * spanner end
     * */



    $scope.forms = [{
        "id": 1,
        "content": "<p>{-<plugin id=\"3\" question_id=\"3\" name=\"questions1\"><input class=\"\" type=\"text\" disabled=\"disabled\" title=\"questions1\"></plugin>-}{-<plugin id=\"2\" question_id=\"2\" name=\"question2\"><textarea class=\"\" disabled=\"disabled\" title=\"question2\"></textarea></plugin>-}{-<plugin id=\"1\" question_id=\"1\" name=\"fdvfdsv\"><select class=\"\" disabled=\"disabled\" title=\"fdvfdsv\"><option value=\"option1\">option1</option></select></plugin>-}</p><p><span><strong>Dear MR/MS,</strong></span></p><p><br></p><p><span><strong>I recently came across the &nbsp;{-<plugin id=\"6\" question_id=\"6\" name=\"filetest\"><input type=\"file\" class=\"\" disabled=\"disabled\" title=\"filetest\"></plugin>-} position posted on LinkedIn.</strong></span></p><table style=\"width: 100%;\"><tbody><tr><td style=\"width: 20.0000%;\" class=\"fr-thick\"><br></td><td style=\"width: 20.0000%;\" class=\"fr-thick\"><br></td><td style=\"width: 20.0000%;\" class=\"fr-thick\"><br></td><td style=\"width: 20.0000%;\" class=\"fr-highlighted\"><br></td><td style=\"width: 20.0000%;\" class=\"fr-highlighted\"><br></td></tr></tbody></table><table style=\"width: 97%;\"><thead><tr><th>wwww</th><th>dddd</th><th>ssss</th><th>zzz</th></tr></thead><tbody><tr><td style=\"width: 25.0000%;\">dasdad</td><td style=\"width: 25.0000%;\" class=\"fr-thick\">asdasdasd</td><td style=\"width: 25.0000%;\">dsadsa</td><td style=\"width: 25.0000%;\">asd</td></tr><tr><td style=\"width: 25.0000%;\">dsa</td><td style=\"width: 25.0000%;\">dsa</td><td style=\"width: 25.0000%;\">dsa</td><td style=\"width: 25.0000%;\" class=\"fr-highlighted\">asd</td></tr></tbody></table><p><span><strong>I am very excited about the work {-<plugin id=\"3\" question_id=\"3\" name=\"questions1\"><input class=\"\" type=\"text\" disabled=\"disabled\" title=\"questions1\"></plugin>-}[Company Name] is doing, particularly ___.</strong></span></p><p><br></p><p><span><strong>I believe my experience in ___ and passion for ___ make me a strong fit for this position.</strong></span></p><p><br></p><p><span><strong>I would be grateful for the chance to speak with you and learn more about the role. Would you be available for a quick phone chat or in-person meeting sometime?</strong></span></p><p><br></p><p><span><strong>Thank you for considering my request.</strong></span></p><p><br></p><p><span><strong>Best Regards<span>&nbsp;</span></strong></span></p><p><br></p><p><span><strong>Thanks,</strong></span></p><p><br></p><p><span><strong>Fuqiang Zhang</strong></span></p>",
        "createTime": null,
        "updateTime": "2015-11-11",
        "form_desc": "dad",
        "form_name": "newform",
        "formType": "EmployeeForm"
    }];

    $scope.loadAll = function () {
        $scope.loadForm();
        $scope.loadTableForm();
    };

    $scope.loadForm = function () {
        $scope.startSpin()
        UserFormService.getAllForms().then(
            function (data) {
                $scope.forms = data;
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
    };

    $scope.loadTableForm = function () {
        $scope.startSpin();
        RecordService.getAllRecord()
            .then(
            function (data) {
                $scope.tableForms = data;
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);
                $scope.tableForms = [{name: 'test', id: '0'}];
            }
        );
    };

    $scope.loadAll();
    $scope.employees = [];
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
                $scope.employees = [];
            }
        );
    };

    $scope.editTable = function () {
        $scope.tableFormConfig.isEditing = !$scope.tableFormConfig.isEditing;
    };

    $scope.$watch(function ($scope) {
        return $scope.tableFormConfig.start;
    }, function () {
        $scope.calTable();
        $scope.preview();
    });

    $scope.$watch(function ($scope) {
        return $scope.tableFormConfig.end;
    }, function () {
        $scope.calTable();
        $scope.preview();
    });


    $scope.calTable = function () {
        $scope.tableFormConfig.tr.length = 0;
        var days = $scope.tableFormConfig.end - $scope.tableFormConfig.start;
        var one_day = 1000 * 60 * 60 * 24;
        days = Math.round(days / one_day);

        for (var i = 0; i < days; i++) {
            var pass = false;
            var row = [];
            for (var j = 0; j < $scope.tableFormConfig.thead.length; j++) {
                var id = $scope.tableFormConfig.thead[j].id;
                var td_value = getValuesForTable(angular.copy($scope.tableFormConfig.start), id, i);
                if ($scope.tableFormConfig.thead[j].type == 'date' && new Date(td_value) >= new Date($scope.tableFormConfig.end)) {
                    return;
                }
                if ($scope.tableFormConfig.thead[j].type == 'date' && $scope.hasDeleted(td_value)) {
                    pass = true;
                }
                row.push({id: id, value: td_value});
            }
            if (!pass) {
                $scope.tableFormConfig.tr.push(row);
            }
        }
    };

    $scope.tableFormConfig = {tr: []};
    $scope.recordRate = {'Week': 7, 'Day': 1};

    $scope.tableFormConfig.deleted = [];
    $scope.deleteTR = function (index) {
        $scope.tableFormConfig.deleted.push($scope.tableFormConfig.tr[index]);
        $scope.tableFormConfig.tr.splice(index, 1);
        $scope.preview();
    };
    $scope.hasDeleted = function (date) {
        for (var i = 0; i < $scope.tableFormConfig.deleted.length; i++) {
            for (var j = 0; j < $scope.tableFormConfig.deleted[i].length; j++) {
                console.log($scope.tableFormConfig.deleted[i][j].value + "===>" + date);
                if ($scope.tableFormConfig.deleted[i][j].value == date) {
                    return true;
                }
            }
        }
        return false;
    };

    $scope.preview = function (callBack) {
        $scope.isPreviewShowing = !$scope.isPreviewShowing;
        var c = angular.element(angular.element($scope.selectedRecordConfig.tableForm.content));
        angular.element("#form_container").html('').append(c);

        var table = angular.element("#form_container").find('table')[0];
        angular.element(table).addClass("table");
        for (var i = 0; i < $scope.tableFormConfig.tr.length; i++) {
            var len = table.rows.length;
            var new_row = table.rows[len - 1].cloneNode(true);
            angular.element(table.rows[len - 1]).remove();
            angular.element(angular.element(table).find('tbody')).append(new_row);
            angular.element(angular.element(table).find('tbody')).append(angular.copy(new_row));

            angular.forEach(new_row.childNodes, function (td) {
                var id = td.id;

                for (var k = 0; k < $scope.tableFormConfig.tr[i].length; k++) {
                    if (id == $scope.tableFormConfig.tr[i][k].id) {
                        td.innerHTML = $scope.tableFormConfig.tr[i][k].value;
                    }
                }

                td.id = "";
            });
        }

        $scope.showPDF($scope.selectedRecordConfig.tableForm.name,callBack);
    };


    var selectMenu = function (a) {
        for (var i = 0; i < $scope.tableForms.length; i++) {
            $scope.tableForms[i].selected = false;
        }
        for (var i = 0; i < $scope.forms.length; i++) {
            $scope.forms[i].selected = false;
        }
        a.selected = true;
    };

    $scope.TableFormChoose = function (tf,callBack) {
        selectMenu(tf);
        $scope.viewForm = false;
        $scope.viewTableForm = true;

        var userId = LoginService.getUserInfo().userId;
        RecordService.getOneRecord(userId, tf.id)
            .then(
            function (response) {
                $scope.selectedRecordConfig = response;
                $scope.loadEmployees();
                $scope.stopSpin(true);
                $scope.tableFormConfig.thead = $scope.selectedRecordConfig.tableForm.fields;
                var recordRate = $scope.selectedRecordConfig.tableForm.recordRate;
                $scope.tableFormConfig.tr = [];
                $scope.calTable();
                $scope.preview(callBack);


            },
            function (err) {
                $scope.stopSpin(false);
                $scope.selectedRecordConfig = {
                    "id": "402880855100a9a0015100a9c34e0000",
                    "tableForm": {
                        "id": "4028808550fef0dc0150fef212130003",
                        "name": "neew",
                        "description": "asd",
                        "content": "<h1 style=\"text-align: center;\">dasdasd</h1><table><thead><tr><th>asddsa</th><th>dsasd</th><th>ddd</th></tr></thead><tbody><tr><td id=\"4028808550fef0dc0150fef1a5160000\"><br></td><td id=\"4028808550fef0dc0150fef1b3d60001\"><br></td><td id=\"4028808550fef0dc0150fef1c1060002\"><br></td></tr></tbody></table><br><br>",
                        "tableRate": "Month",
                        "recordRate": "Week",
                        "createTime": 1447386289000,
                        "updateTime": 1447386289000,
                        "fields": [{
                            "id": "4028808550fef0dc0150fef1a5160000",
                            "name": "asddsa",
                            "type": "date"
                        }, {
                            "id": "4028808550fef0dc0150fef1b3d60001",
                            "name": "dsasd",
                            "type": "employee"
                        }, {"id": "4028808550fef0dc0150fef1c1060002", "name": "ddd", "type": "text"}]
                    },
                    "defaultValues": {
                        "4028808550fef0dc0150fef1b3d60001": "4028808550ee16a10150ee51f7510000",
                        "4028808550fef0dc0150fef1a5160000": "Saturday",
                        "4028808550fef0dc0150fef1c1060002": "0"
                    },
                    "user_id": 1
                };
                $scope.tableFormConfig.thead = $scope.selectedRecordConfig.tableForm.fields;
                var recordRate = $scope.selectedRecordConfig.tableForm.recordRate;
                $scope.tableFormConfig.tr = [];
                $scope.calTable();
                $scope.preview(callBack);
            }
        );

    };

    $scope.content = '';
    //'employee', 'date', 'text','week of month','month of year'
    var getValuesForTable = function (from, id, i) {
        var def = $scope.selectedRecordConfig.defaultValues;
        var value = def[id];
        var fields = $scope.selectedRecordConfig.tableForm.fields;
        var result = {type: '', value: value};
        angular.forEach(fields, function (f) {
            if (f.id == id) {
                this.value = new TypeDate(from, value, i)[f.type]();
            }
        }, result);
        return result.value;
    };

    var TypeDate = function (from, value, i) {
        this.orgvalue = value;
        var today = from;
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


    $scope.FormChoose = function (f,callBack) {
        selectMenu(f);
        $scope.viewForm = true;
        $scope.viewTableForm = false;
        var userId = LoginService.getUserInfo().userId;
        UserFormService.getOneForm(f.id).then(
            function (data) {
                $scope.selectedForm = data;
                if (data.formType == "EmployeeForm") {
                    EmployeeService.getEmployeeByUserId(userId).then(
                        function (data) {
                            $scope.employees = data;
                        },
                        function (err) {

                        }
                    );
                } else {
                    $scope.showForm({uuid: LoginService.getUserInfo().companyId},callBack);
                }
            },
            function (err) {
                $scope.selectedForm = {
                    "id": 1,
                    "content": "<p>{-<plugin id=\"3\" question_id=\"3\" name=\"questions1\"><input class=\"\" type=\"text\" disabled=\"disabled\" title=\"questions1\"></plugin>-}{-<plugin id=\"2\" question_id=\"2\" name=\"question2\"><textarea class=\"\" disabled=\"disabled\" title=\"question2\"></textarea></plugin>-}{-<plugin id=\"1\" question_id=\"1\" name=\"fdvfdsv\"><select class=\"\" disabled=\"disabled\" title=\"fdvfdsv\"><option value=\"option1\">option1</option></select></plugin>-}</p><p><span><strong>Dear MR/MS,</strong></span></p><p><br></p><p><span><strong>I recently came across the &nbsp;{-<plugin id=\"6\" question_id=\"6\" name=\"filetest\"><input type=\"file\" class=\"\" disabled=\"disabled\" title=\"filetest\"></plugin>-} position posted on LinkedIn.</strong></span></p><table style=\"width: 100%;\"><tbody><tr><td style=\"width: 20.0000%;\" class=\"fr-thick\"><br></td><td style=\"width: 20.0000%;\" class=\"fr-thick\"><br></td><td style=\"width: 20.0000%;\" class=\"fr-thick\"><br></td><td style=\"width: 20.0000%;\" class=\"fr-highlighted\"><br></td><td style=\"width: 20.0000%;\" class=\"fr-highlighted\"><br></td></tr></tbody></table><table style=\"width: 97%;\"><thead><tr><th>wwww</th><th>dddd</th><th>ssss</th><th>zzz</th></tr></thead><tbody><tr><td style=\"width: 25.0000%;\">dasdad</td><td style=\"width: 25.0000%;\" class=\"fr-thick\">asdasdasd</td><td style=\"width: 25.0000%;\">dsadsa</td><td style=\"width: 25.0000%;\">asd</td></tr><tr><td style=\"width: 25.0000%;\">dsa</td><td style=\"width: 25.0000%;\">dsa</td><td style=\"width: 25.0000%;\">dsa</td><td style=\"width: 25.0000%;\" class=\"fr-highlighted\">asd</td></tr></tbody></table><p><span><strong>I am very excited about the work {-<plugin id=\"3\" question_id=\"3\" name=\"questions1\"><input class=\"\" type=\"text\" disabled=\"disabled\" title=\"questions1\"></plugin>-}[Company Name] is doing, particularly ___.</strong></span></p><p><br></p><p><span><strong>I believe my experience in ___ and passion for ___ make me a strong fit for this position.</strong></span></p><p><br></p><p><span><strong>I would be grateful for the chance to speak with you and learn more about the role. Would you be available for a quick phone chat or in-person meeting sometime?</strong></span></p><p><br></p><p><span><strong>Thank you for considering my request.</strong></span></p><p><br></p><p><span><strong>Best Regards<span>&nbsp;</span></strong></span></p><p><br></p><p><span><strong>Thanks,</strong></span></p><p><br></p><p><span><strong>Fuqiang Zhang</strong></span></p>",
                    "createTime": null,
                    "updateTime": "2015-11-11",
                    "form_desc": "dad",
                    "form_name": "newform",
                    "formType": "CompanyForm"
                };
                $scope.employees = [{name: 'fz', uuid: '111'}];
                $scope.showForm({uuid: LoginService.getUserInfo().companyId},callBack)
            }
        );
    };
    var Record = function (questionId, oe_id, user_id, value) {
        this.questionId = questionId;
        this.oeId = oe_id;
        this.userId = user_id;
        this.value = value;
    };
    $scope.showForm = function (oe,callBack) {
        var formElement = angular.element($scope.selectedForm.content.replace(/{-/gi, '').replace(/-}/gi, ''));
        var questions = formElement.find('plugin');
        angular.forEach(questions, function (q) {
            var child = angular.element(q.children);
            var id = angular.element(q).attr('id');
            var name = angular.element(q).attr('name');
            var record = new Record(id, oe.uuid, LoginService.getUserInfo().userId);
            UserWorkFlowService.getRecordValue(record).then(
                function (data) {
                    var elem = angular.element('<u></u>');
                    elem.text(data.value);
                    child.replaceWith(elem);
                    $scope.showPDF($scope.selectedForm.form_name,callBack);
                },
                function (err) {
                    console.log(name);
                    var elem = angular.element('<u></u>');
                    elem.text(name);
                    child.replaceWith(elem);
                    $scope.showPDF($scope.selectedForm.form_name,callBack);
                }
            );
        });
        angular.element('#form_container').html('').append(formElement);
        $scope.showPDF($scope.selectedForm.form_name,callBack);

    };


    $scope.showPDF = function (name,callBack) {
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
                console.log(name);
                if(typeof (callBack) == 'function'){
                    callBack(name,pdf.output("dataurlstring"));
                }
            }, margins);
        angular.element(source).css("display", "none");
    };

    var formZip = new JSZip();
    var folder = formZip.folder("forms");
    $scope.downLoad = function () {
        for(var i=0;i<$scope.forms.length;i++){
            console.log(i);
            $scope.FormChoose($scope.forms[i], function (name,content) {
                console.log('writing '+name);
                var cont = content.replace('data:application/pdf;base64,','');
                folder.file(name+'.pdf',cont,{base64:true});
            });
        }
    };

    $scope.downLoadStart = function () {
        var content = formZip.generate({type: "blob"});
        saveAs(content, "forms.zip");
    };
    var tableZip = new JSZip();
    var tableFolder = tableZip.folder("logs");
    $scope.downLoadTableForm = function () {
        for(var j=0;j<$scope.tableForms.length;j++){
            console.log(j);
            $scope.TableFormChoose($scope.tableForms[j], function (name,content) {
                var cont = content.replace('data:application/pdf;base64,','');
                tableFolder.file(name+'.pdf',cont,{base64:true});
            });
        }
    };
    $scope.downLoadTableFormStart = function () {
        var content = tableZip.generate({type: "blob"});
        saveAs(content, "logs.zip");
    }
}]);