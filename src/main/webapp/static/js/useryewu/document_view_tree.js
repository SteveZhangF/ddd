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
                if (node.dataType == "File") {
                    $scope.FormChoose(node);
                }
                if (node.dataType == "Folder") {
                    $scope.FolderChoose(node);
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

            // when choose a folder
            $scope.FolderChoose = function (node) {

            };


            // when choose a document(file)
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
                // if the node is a file, then show the pdf of the file, when click edit on the file, then list all the related question of this file
                if (node.leaf) {
                    $scope.folderTree.currentNode.editingQuestions = [];
                    $scope.startSpin();
                    UserFormRecordService.getAllQuestions(node.data_id)
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
                } else {
                    // if the node is a folder, then show the question flow of this folder

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

app.controller('UserDocumentCompanyQuestionControllerForTree', ['$scope', 'UserWorkFlowService', 'LoginService', 'UserQuestionService', 'EmployeeService', 'FileUploader', function ($scope, UserWorkFlowService, LoginService, UserQuestionService, EmployeeService, FileUploader) {
    $scope.currentNode = {};

    $scope.currentWorkFlow = {};

    $scope.currentWorkFlowIndex = 0;

    //UserWorkFlowService.fetchAllWorkFlow(LoginService.getUserInfo().userId).then(
    //    function (response) {
    //        $scope.workFlows = Object.keys(response);
    //        $scope.workFlows_currentNode = response;
    //        var node_id = $scope.workFlows_currentNode[$scope.workFlows[$scope.currentWorkFlowIndex]];
    //        $scope.getCurrentNode(node_id);
    //        $scope.currentWorkFlowIndex++;
    //    },
    //    function (errResponse) {
    //
    //    }
    //);
    //private String workFlowId;
    //private String currentNode;
    //private String type;
    //private int user_id;
    //private String oe_id;
    var UserWorkFlow = function (userId, workFlowId, currentNode, oeId) {
        this.user_id = userId;
        this.workFlowId = workFlowId;
        this.currentNode = currentNode;
        this.oe_id = oeId;
    };
    var userWorkFlow = new UserWorkFlow(LoginService.getUserInfo().userId, 0, 0, LoginService.getUserInfo().companyId);


    $scope.$watch('folderTree.currentNode', function (newObj, oldObj) {
        if ($scope.folderTree && angular.isObject($scope.folderTree.currentNode)) {
            if($scope.folderTree.currentNode.dataType==='Folder'){
                $scope.startSpin();
                var folderId = $scope.folderTree.currentNode.id;
                // will return the folder node which represent to the workflow and the data_id is the real work flow id
                UserWorkFlowService.getFlowIdByFolderId(folderId)
                    .then(
                    function (data) {
                        $scope.currentWorkFlow = data;
                        userWorkFlow.workFlowId = data.data_id;
                        UserWorkFlowService.getCurrentNodeByWorkFlowIdAndUserIdAndOeId(userWorkFlow)
                            .then(
                            function (workFlowNode) {
                                console.log(workFlowNode);
                                $scope.getCurrentNode(workFlowNode.id);
                                $scope.stopSpin(true);
                            },
                            function (err) {
                                $scope.stopSpin(false);
                            }
                        );
                    },
                    function(err){
                        $scope.stopSpin(false);
                    }
                );
            }
        }
    }, false);

    $scope.getCurrentNode = function (node_id) {
        $scope.startSpin();
        UserWorkFlowService.getCurrentNode(node_id).then(
            function (response) {
                $scope.currentNode = response;
                if($scope.currentNode.folderNodeId == 1){
                    //todo end node

                } else
                if($scope.currentNode.folderNodeId == 0){
                    //todo start node
                } else
                if($scope.currentNode.folderNodeId){
                    $scope.getCurrentData($scope.currentNode.folderNodeId);
                }
                $scope.stopSpin(true);
                $scope.question_finish = false;
            },
            function (errResponse) {
                $scope.stopSpin(false);
            }
        );
    };

    $scope.getCurrentData = function (dataId) {
        UserQuestionService.getQuestionByFolderNodeId(dataId).then(function (response) {
                $scope.nodeData = response;

                $scope.getRecord();
            },
            function (errResponse) {
            }
        );
    };


    var Record = function (questionId, oe_id, user_id, value) {
        this.questionId = questionId;
        this.oeId = oe_id;
        this.userId = user_id;
        this.value = value;
    };
    $scope.record = new Record();

    $scope.goNext = function () {
        //userWorkFlow.currentNode = $scope.currentNode.nexts[0]._then;
        var value = $scope.record.value;
        var next = '';
        for (var i = 0; i < $scope.currentNode.nexts.length; i++) {
            if ($scope.currentNode.nexts[i]._if == "NOTNULL" || $scope.currentNode.nexts[i]._if == '') {
                next = $scope.currentNode.nexts[i]._then;
                break;
            }
            if (value == $scope.currentNode.nexts[i]._if) {
                next = $scope.currentNode.nexts[i]._then;
                break;
            }
        }
        if (next == '') {
            $scope.finish();
        } else {
            $scope.goToNode(next);
        }
    };
    $scope.goPrev = function () {
        var prev = $scope.currentNode.prev;
        $scope.question_finish = false;
        $scope.goToNode(prev);
    };

    $scope.goToNode = function (next) {
        UserWorkFlowService.submitRecord($scope.record).then(
            function (response) {
                $scope.getCurrentNode(next);
            },
            function (errResponse) {
                console.log(errResponse);
            }
        );
    };

    $scope.finish = function () {
        $scope.question_finish = true;
        console.log($scope.currentWorkFlowIndex + "Finish");
    };

    $scope.getRecord = function () {
        $scope.record = new Record($scope.nodeData.id, LoginService.getUserInfo().companyId, LoginService.getUserInfo().userId);
        // for checkbox
        UserWorkFlowService.getRecordValue($scope.record).then(
            function (response) {
                if ($scope.nodeData.type == 'checkbox') {
                    $scope.record.values = [$scope.nodeData.options];
                }
                $scope.record = response;

                if ($scope.nodeData.type == "file") {
                    $scope.contractPreview.preview = false;
                    $scope.contractPreview.file = $scope.record.value;
                    $scope.contractPreview.pdfCount = 1 + $scope.contractPreview.pdfCount;
                }

                if ($scope.nodeData.type == 'checkbox') {
                    var values = eval($scope.record.value);
                    for (var i = 0; i < values.length; i++) {
                        for (var j = 0; j < $scope.nodeData.values.length; j++) {
                            if (values[i] == $scope.nodeData.values[j]) {
                                $scope.record.values[j] = true;
                            }
                        }
                    }
                }
            },
            function (errResponse) {
                console.log("err while get value");
            }
        );
    };

    $scope.checkBoxValueChanged = function (value) {
        var flag = false;
        if ($scope.record.value == '') {
            $scope.record.value = [];
        } else {
            $scope.record.value = eval($scope.record.value);
        }
        for (var i = 0; i < $scope.record.value.length; i++) {
            if (value == $scope.record.value[i]) {
                $scope.record.value.splice(i, 1);
                flag = true;
            }
        }
        if (!flag) {
            $scope.record.value.push(value);
        }
        $scope.record.value = JSON.stringify($scope.record.value);
    };
    $scope.nodeData = {};


    /**
     *  customized uploader
     * */
    var contractUploader = $scope.contractUploader = new FileUploader({
        url: '/upload/',
        formData: [{type: 'customized'}, {userId: LoginService.getUserInfo().userId}]
    });

    if (LoginService.getUserInfo().accessToken) {
        var token = LoginService.getUserInfo();
        if (token) {
            contractUploader.headers['X-AUTH-TOKEN'] = token.accessToken;
        }
    } else {
        contractUploader.headers['X-AUTH-TOKEN'] = '0';
    }
    contractUploader.onAfterAddingFile = function (fileItem) {
        contractUploader.queue.length = 0;
        contractUploader.queue.push(fileItem);
        $scope.contractPreview.preview = true;
        $scope.contractPreview.file = fileItem._file;
        $scope.contractPreview.pdfCount = $scope.contractPreview.pdfCount + 1;
    };
    contractUploader.onSuccessItem = function (item, response, status, headers) {
        $scope.record.value = response;
    };

    $scope.contractPreview = {
        preview: false,
        file: $scope.record.value,
        pdfCount: -1,
        height: '100%',
        width: '100%'
    };

}]);