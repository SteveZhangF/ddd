
'use strict';

app.controller('DocumentViewTreeController', ['$scope', '$filter', 'UserFormService', 'LoginService', 'EmployeeService', 'RecordService', 'UserWorkFlowService', 'usSpinnerService', function ($scope, $filter, UserFormService, LoginService, EmployeeService, RecordService, UserWorkFlowService, usSpinnerService) {
    $scope.model = [
        {'name':'osha',id:'1111','children':[
            {'name':'blood',id:'1111','children':[],isFolder:true,progress:'10%'},
            {'name':'eye',id:'1111','children':[],isFolder:false,progress:'50%'}
        ]
            ,isFolder:true
        ,
            progress:'60%'}
    ];

    $scope.roleList = $scope.model;
    $scope.$watch( 'modelTree.currentNode', function( newObj, oldObj ) {
        if( $scope.modelTree && angular.isObject($scope.modelTree.currentNode) ) {
            nodeSelected($scope.modelTree.currentNode);
        }
    }, false);

    var nodeSelected = function (node) {
        if(!node.isFolder){
            $scope.FormChoose(node);
        }
    };





    $scope.FormChoose = function (f,callBack) {
        $scope.viewForm = true;
        $scope.viewTableForm = false;
        var userId = LoginService.getUserInfo().userId;
        UserFormService.getOneForm(f.id).then(
            function (data) {
                $scope.selectedForm = data;
                $scope.showForm({uuid: LoginService.getUserInfo().companyId},callBack);
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
}]);
