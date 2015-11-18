'use strict';

app.controller('DocumentViewTreeController',
    ['$scope', '$filter', 'UserFormService', 'LoginService',
        'EmployeeService', 'RecordService', 'UserWorkFlowService',
        'usSpinnerService', 'UserFolderService', 'UserFormRecordService',
        function ($scope, $filter, UserFormService, LoginService,
                  EmployeeService, RecordService, UserWorkFlowService,
                  usSpinnerService, UserFolderService, UserFormRecordService) {
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
                $scope.startSpin();
                UserFolderService.getUserFolders(userId).then(
                    function (data) {
                        $scope.folders = data;
                        $scope.stopSpin(true);
                    },
                    function (err) {
                        $scope.stopSpin(false);
                    }
                );
            };

            $scope.getFolderTree();


            $scope.FormChoose = function (f, callBack) {
                $scope.viewForm = true;
                $scope.viewTableForm = false;
                var userId = LoginService.getUserInfo().userId;
                var oeId = LoginService.getUserInfo().companyId;
                $scope.getFullFormWhichWithRecord(f.data_id, oeId, userId);
            };

            // 读取form内容， 找到里面的question id， 然后 goto －－－> UserFormRecordService.getFormRecords
            // 获取所有question的record，
            // 用record替换 form内容中的question
            $scope.getFullFormWhichWithRecord = function (form_id, oe_id, user_id) {
                var orgForm = null;
                $scope.startSpin();
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
                                $scope.stopSpin(true);
                            },
                            function (err) {
                                $scope.stopSpin(false);
                            });

                    },
                    function (err) {
                        $scope.stopSpin(false);
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
                        //pdf.autoPrint();  // <<--------------------- !!
                        //pdf.output('dataurlnewwindow');
                    }, margins);
                angular.element(source).css("display", "none");
            };

            $scope.editNode = function (node) {
                if (node.leaf) {
                    $scope.folderTree.currentNode.editingQuestions = [];
                    $scope.startSpin();
                    UserFormRecordService.getAllQuestions(node.form_id)
                        .then(
                        function (data) {
                            $scope.folderTree.currentNode.editingQuestions = data;

                            var userId = LoginService.getUserInfo().userId;
                            var oeId = LoginService.getUserInfo().companyId;

                            var questionIds = [];
                            for (var i = 0; i < data.length; i++) {
                                var qId = data[i].id;
                                questionIds.push(qId);
                            }

                            UserFormRecordService.getFormRecords(userId, oeId, questionIds)
                                .then(function (records) {
                                    $scope.folderTree.currentNode.isEditing = true;
                                    for (var j = 0; j < records.length; j++) {
                                        var record = records[j];
                                        var record_question_id = record.questionId;
                                        for (var k = 0; k < $scope.folderTree.currentNode.editingQuestions.length; k++) {
                                            if ($scope.folderTree.currentNode.editingQuestions[k].id == record_question_id) {
                                                $scope.folderTree.currentNode.editingQuestions[k].value = record.value;
                                                break;
                                            }
                                        }
                                    }
                                    $scope.stopSpin(true);
                                },
                                function (err) {
                                    $scope.stopSpin(false);
                                });
                        },
                        function (err) {
                            $scope.stopSpin(false);
                        }
                    );
                }
            };
            var Record = function (questionId, oe_id, user_id, value) {
                this.questionId = questionId;
                this.oeId = oe_id;
                this.userId = user_id;
                this.value = value;
            };
            $scope.saveQuestionValue = function (questions) {
                var userId = LoginService.getUserInfo().userId;
                var oeId = LoginService.getUserInfo().companyId;
                var records = [];
                for (var i = 0; i < questions.length; i++) {
                    var record = new Record(questions[i].id, oeId, userId, questions[i].value);
                    records.push(record);
                }
                $scope.startSpin();
                UserFormRecordService.saveQuestionValues(records).then(
                    function (data) {
                        $scope.stopSpin(true);
                        $scope.folderTree.currentNode.isEditing = false;
                        $scope.FormChoose($scope.folderTree.currentNode);
                    },
                    function (err) {
                        $scope.stopSpin(false);
                    }
                );
            };
            $scope.printPdf = function () {
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
                pdf.fromHTML(
                    source, // HTML string or DOM elem ref.
                    margins.left, // x coord
                    margins.top, { // y coord
                        'width': margins.width, // max width of content on PDF
                        'elementHandlers': specialElementHandlers
                    },

                    function (dispose) {
                        pdf.autoPrint();  // <<--------------------- !!打印吧pdf君
                        pdf.output('dataurlnewwindow');
                    }, margins);
                angular.element(source).css("display", "none");
            };
            $scope.cancelEditForm = function () {
                $scope.folderTree.currentNode.isEditing = false;
                $scope.FormChoose($scope.folderTree.currentNode);
            }


        }]);
