'use strict';

app.controller('DocumentViewTreeController',
    ['$scope', '$filter', 'UserFormService', 'LoginService',
        'EmployeeService', 'RecordService', 'UserWorkFlowService',
        'usSpinnerService', 'UserFolderService', 'UserFormRecordService',
        function ($scope, $filter, UserFormService, LoginService,
                  EmployeeService, RecordService, UserWorkFlowService,
                  usSpinnerService, UserFolderService, UserFormRecordService) {


            $scope.folders = [];

            $scope.$watch('folderTree.currentNode', function (newObj, oldObj) {
                if ($scope.folderTree && angular.isObject($scope.folderTree.currentNode)) {
                    nodeSelected($scope.folderTree.currentNode);
                }
            }, false);

            var nodeSelected = function (node) {
                if (node.leaf) {
                    $scope.FormChoose(node);
                }
            };


            $scope.getFolderTree = function () {
                var userId = LoginService.getUserInfo().userId;
                UserFolderService.getUserFolders(userId).then(
                    function (data) {
                        $scope.folders = data;
                    },
                    function (err) {

                    }
                );
            };

            $scope.getFolderTree();


            $scope.FormChoose = function (f, callBack) {
                $scope.viewForm = true;
                $scope.viewTableForm = false;
                var userId = LoginService.getUserInfo().userId;
                var oeId = LoginService.getUserInfo().companyId;
                $scope.getFullFormWhichWithRecord(f.form_id, oeId, userId);
            };

            // 读取form内容， 找到里面的question id， 然后 goto －－－> UserFormRecordService.getFormRecords
            // 获取所有question的record，
            // 用record替换 form内容中的question
            $scope.getFullFormWhichWithRecord = function (form_id, oe_id, user_id) {
                var orgForm = null;
                UserFormService.getOneForm(form_id).then(
                    function (data) {
                        orgForm = data;
                        var formElement = angular.element(orgForm.content.replace(/{-/gi, '').replace(/-}/gi, ''));
                        var questions = formElement.find('plugin');
                        var questionIds = [];
                        for (var i = 0; i < questions.length; i++) {
                            var qId = angular.element(questions[i]).attr('id');
                            questionIds.push(qId);
                        }

                        UserFormRecordService.getFormRecords(user_id, oe_id, questionIds)
                            .then(function (records) {
                                for (var j = 0; j < records.length; j++) {
                                    var record = records[j];
                                    var record_question_id = record.questionId;
                                    var questionElement = angular.element(formElement.find("plugin[id='" + record_question_id + "']"));
                                    var span = angular.element("<span></span>");
                                    span.text(record.value);
                                    questionElement.replaceWith(span);
                                }
                                angular.element('#form_container').html('').append(formElement);
                                $scope.showPDF();
                            },
                            function (err) {

                            });

                    },
                    function (err) {

                    });


            };

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
                    }, margins);
                angular.element(source).css("display", "none");
            };

            $scope.editNode = function (node) {
                if(node.leaf){
                    $scope.editingQuestions = [];
                    $scope.questionIndex = 0;
                    UserFormRecordService.getAllQuestions(node.form_id)
                        .then(
                        function (data) {
                            $scope.editingQuestions = data;
                            $scope.folderTree.currentNode.isEditing = true;
                        },
                        function (err) {

                        }
                    );
                }
            };
            $scope.editingQuestions = [];


        }]);
