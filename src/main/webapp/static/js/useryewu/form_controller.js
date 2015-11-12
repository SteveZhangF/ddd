'use strict';

app.controller('FormController', ['$scope', 'UserFormService', 'LoginService', 'EmployeeService', 'UserWorkFlowService', function ($scope, UserFormService, LoginService, EmployeeService, UserWorkFlowService) {

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
        UserFormService.getAllForms().then(
            function (data) {
                $scope.forms = data;
            },
            function (err) {

            }
        );
    };

    $scope.loadAll();

    $scope.FormChoose = function (f) {
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
                    $scope.showForm({uuid: LoginService.getUserInfo().companyId});
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
                    "formType": "EmployeeForm"
                };
                $scope.employees = [{name: 'fz', uuid: '111'}];
                $scope.showForm({uuid: LoginService.getUserInfo().companyId})
            }
        );
    };
    var Record = function (questionId, oe_id, user_id, value) {
        this.questionId = questionId;
        this.oeId = oe_id;
        this.userId = user_id;
        this.value = value;
    };
    $scope.showForm = function (oe) {
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
                    $scope.showPDF();
                },
                function (err) {
                    console.log(name);
                    var elem = angular.element('<u></u>');
                    elem.text(name);
                    child.replaceWith(elem);
                    $scope.showPDF();
                }
            );
        });
        angular.element('#form_container').html('').append(formElement);

    };


    $scope.showPDF = function () {
        var pdf = new jsPDF('p', 'pt', 'a4');
        var source = $('#form_container').get(0);
        angular.element(source).css("display","block");
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
        angular.element(source).css("display","none");
    }
}]);