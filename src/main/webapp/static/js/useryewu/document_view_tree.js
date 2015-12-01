'use strict';

app.controller('DocumentViewTreeController',
    ['$scope', '$filter', 'UserFormService', 'LoginService',
        'EmployeeService', 'RecordService', 'UserWorkFlowService',
        'MessageService', 'UserFolderService', 'UserFormRecordService', '$timeout',
        function ($scope, $filter, UserFormService, LoginService,
                  EmployeeService, RecordService, UserWorkFlowService,
                  MessageService, UserFolderService, UserFormRecordService, $timeout) {


            $scope.folders = [];

            $scope.$watch('folderTree.currentNode', function (newObj, oldObj) {
                if ($scope.folderTree && angular.isObject($scope.folderTree.currentNode)) {
                    nodeSelected($scope.folderTree.currentNode);
                }
            }, false);

            var nodeSelected = function (node) {
                if (node.type == "FILE") {
                    $scope.FormChoose(node);
                }
                if (node.type == "FOLDER" && node.fileType == 'CompanyFile') {
                    $scope.FolderChoose(node);
                }
                if (node.type == 'FOLDER' && node.fileType == 'EmployeeReport') {
                    $scope.EmployeeReportChoose(node);
                }

            };


            $scope.getFolderTree = function () {
                var userId = LoginService.getUserInfo().userId;
                $scope.userFolderTreePromise = UserFolderService.getUserFolders(userId).then(
                    function (data) {
                        var folders = MessageService.handleMsg(data);
                        if (folders) {
                            $scope.folders = folders;
                        }
                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                    }
                );
            };

            //load the folder tree when document ready
            $timeout(function () {
                $scope.getFolderTree();
            });


            // when choose a folder
            $scope.FolderChoose = function (node) {

            };


            // when choose a document(file)
            $scope.FormChoose = function (f, callBack) {
                $scope.viewForm = true;
                $scope.viewTableForm = false;
                $scope.getFullFormWhichWithRecord(f);
            };
            //when choose a employee report
            $scope.EmployeeReportChoose = function (report) {

            };


            $scope.loadFile = function (file, fun) {
                $scope.userViewFilePromise = UserFolderService.getUserFile(file.id).then(
                    function (data) {
                        var orgForm = MessageService.handleMsg(data);
                        if (orgForm) {
                            angular.copy(file, orgForm);
                            if (typeof (fun) === "function") {
                                fun(file);
                            }
                        }

                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                    });
            };

            $scope.loadRecord = function (file, fun) {
                var questions = file.questions;//get all questions for form
                var questionIds = [];
                angular.forEach(questions, function (q) {
                    questionIds.push(q.id);
                });
                //get all records
                var userId = LoginService.getUserInfo().userId;
                var oeId = LoginService.getUserInfo().companyId;
                $scope.userViewFilePromise = UserFormRecordService.getFormRecords(userId, oeId, questionIds)
                    .then(function (resp) {
                        var records = MessageService.handleMsg(resp);
                        if (records) {
                            file.records = records;
                            if (typeof(fun) == "function") {
                                fun(file);
                            }
                        }
                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                    });
            };

            $scope.viewFile = function (file) {
                $scope.loadRecord(file, function () {
                    var formElement = angular.element(file.content.replace(/{-/gi, '').replace(/-}/gi, ''));
                    var records = file.records;
                    for (var j = 0; j < records.length; j++) {
                        var record = records[j];
                        var record_question_id = record.questionId;
                        var questionElement = angular.element(formElement.find("plugin[question_id='" + record_question_id + "']"));
                        var span = angular.element("<span></span>");
                        span.text(record.value);
                        questionElement.replaceWith(span);
                    }
                    angular.element('#form_container').html('').append(formElement);
                    $scope.showPDF();
                });
            };

            $scope.editFile = function (file) {
                $scope.loadRecord(file, function () {
                    $scope.folderTree.currentNode.isEditing = true;
                    var records = file.records;
                    for (var j = 0; j < records.length; j++) {
                        var record = records[j];
                        var record_question_id = record.questionId;
                        for (var k = 0; k < $scope.folderTree.currentNode.questions.length; k++) {
                            if ($scope.folderTree.currentNode.questions[k].id == record_question_id) {
                                $scope.folderTree.currentNode.questions[k].value = record.value;
                                break;
                            }
                        }
                    }
                })
            };

            // 读取form内容， 找到里面的question id， 然后 goto －－－> UserFormRecordService.getFormRecords
            // 获取所有question的record，
            // 用record替换 form内容中的question
            $scope.getFullFormWhichWithRecord = function (file) {
                if (file.questions == null || file.content == null || !file.records) {
                    $scope.loadFile(file, $scope.viewFile);
                } else {
                    $scope.viewFile(file);
                }
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
                if (node.type === "FILE") {
                    if (!node.questions || node.questions.length == 0) {
                        $scope.loadFile(node, $scope.editFile);
                    } else {
                        $scope.editFile(node);
                    }
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
            $scope.saveAllQuestionValue = function (questions) {

                var userId = LoginService.getUserInfo().userId;
                var oeId = LoginService.getUserInfo().companyId;
                var records = [];
                for (var i = 0; i < questions.length; i++) {
                    var record = new Record(questions[i].id, oeId, userId, questions[i].value);
                    records.push(record);
                }
                $scope.questionAllPromise = UserFormRecordService.saveQuestionValues(records).then(
                    function (data) {
                        $scope.folderTree.currentNode.isEditing = false;
                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                    }
                );


            };

            $scope.saveQuestionValue = function (question) {
                var questions = [];
                questions.push(question);

                var userId = LoginService.getUserInfo().userId;
                var oeId = LoginService.getUserInfo().companyId;
                var records = [];
                for (var i = 0; i < questions.length; i++) {
                    var record = new Record(questions[i].id, oeId, userId, questions[i].value);
                    records.push(record);
                }
                question.promise = UserFormRecordService.saveQuestionValues(records).then(
                    function (data) {

                    },
                    function (err) {
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

app.controller('UserDocumentCompanyQuestionControllerForTree', ['$scope', 'UserFolderService', 'UserFormRecordService', 'LoginService', 'UserQuestionService', 'EmployeeService', 'FileUploader', 'MessageService', function ($scope, UserFolderService, UserFormRecordService, LoginService, UserQuestionService, EmployeeService, FileUploader, MessageService) {
    $scope.currentNode = {};

    $scope.currentWorkFlow = {};

    $scope.currentWorkFlowIndex = 0;

    var UserWorkFlow = function (userId, workFlowId, currentNode, oeId) {
        this.user_id = userId;
        this.workFlowId = workFlowId;
        this.currentNode = currentNode;
        this.oe_id = oeId;
    };

    var userWorkFlow = new UserWorkFlow(LoginService.getUserInfo().userId, 0, 0, LoginService.getUserInfo().companyId);


    $scope.$watch('folderTree.currentNode', function (newObj, oldObj) {
        if ($scope.folderTree && angular.isObject($scope.folderTree.currentNode)) {
            if ($scope.folderTree.currentNode.type === 'FOLDER') {
                var folderId = $scope.folderTree.currentNode.id;
                // will return the folder node which represent to the workflow and the data_id is the real work flow id
                $scope.userViewFlowPromise = UserFolderService.getUserWorkFlowByFolderId(folderId)
                    .then(
                    function (data) {
                        var flow = MessageService.handleMsg(data);
                        if (flow) {
                            $scope.currentWorkFlow = flow;
                            initFlow($scope.currentWorkFlow);

                        }
                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                    }
                );
            }
        }
    }, false);

    $scope.loadQuestion = function (node) {
        if (!node.question) {
            if (node.type == "Question") {
                UserFolderService.getUserQuestion(node.folderNodeId)
                    .then(
                    function (data) {
                        node.record = new Record(node.folderNodeId, LoginService.getUserInfo().companyId, LoginService.getUserInfo().userId, '');
                        var q = MessageService.handleMsg(data);
                        if (q) {
                            node.question = q;
                            loadValue(node);
                            $scope.showQuestion = true;
                        }
                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                        $scope.showQuestion = true;
                    }
                );
            } else {
                $scope.showQuestion = true;
            }
        } else {
            $scope.showQuestion = true;
        }
    };

    var initFlow = function (flow) {
        $scope.nodesAll = [];
        var start_id = flow.startNode_id;
        var nodes = flow.nodes;
        var startNode = getNodeById(start_id, nodes);
        generateLinkedFlow(startNode, nodes);
        flow.startNode = startNode;
        $scope.showQuestion = true;
    };

    var generateLinkedFlow = function (node, nodes) {
        if (node) {
            node.title = node.name;
            $scope.nodesAll.push(node);
            if (node.nexts.length > 0) {
                var nextId = node.nexts[0]._then;
                node.next = getNodeById(nextId, nodes);
                generateLinkedFlow(node.next, nodes);
            }
        }
    };

    var getNodeById = function (id, nodes) {
        for (var i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].id === id) {
                return nodes[i];
            }
        }
    };

    $scope.calComplete = function (nodes) {
        var finish = 0;
        var normal = 0;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].type == 'Normal') {
                normal = normal + 1;
            } else if (nodes[i].record.value && nodes[i].record.value != '') {
                finish = finish + 1;
            }
        }
        return finish / (nodes.length - normal);
    };

    var savePercentOfFlow = function () {

    };

    var saveValue = function (node, success) {
        $scope.showQuestion = false;
        if (node.type == "Question") {
            var records = [];
            records.push(node.record);
            UserFormRecordService.saveQuestionValues(records).then(
                function (data) {
                    var percent = $scope.calComplete($scope.nodesAll);

                    console.log(percent);


                    if (typeof (success) == "function") {
                        success();
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        } else {
            if (typeof (success) == "function") {
                success();
            }
        }
    };

    var loadValue = function (node) {
        if (node.type == "Question") {
            var questionIds = [];
            questionIds.push(node.folderNodeId);
            UserFormRecordService.getFormRecords(LoginService.getUserInfo().userId, LoginService.getUserInfo().companyId, questionIds)
                .then(function (resp) {
                    var records = MessageService.handleMsg(resp);
                    if (records && records.length > 0) {
                        node.record.value = records[0].value;

                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                });
        }
    };

////////// flow controller
    $scope.Math = window.Math;
    $scope.flowIndex = 0;
    $scope.prevFlowIndex = -1;
    $scope.Y_offset = 0;
    $scope.goNextStep = function () {
        saveValue($scope.nodesAll[$scope.flowIndex], function () {
            if ($scope.flowIndex < $scope.nodesAll.length - 1) {
                //TODO
                $scope.Y_offset += ($(angular.element('ul.timeline').children()[$scope.flowIndex]).height() + 20) * (-1);
                var css3transition = dom.cssName("transition");
                $(angular.element('ul.timeline').children())
                    .css(css3transition, 'all 1s ease-in').css('transform', 'translate(0px,' + $scope.Y_offset + 'px)')
                $scope.prevFlowIndex = $scope.flowIndex;

                $scope.flowIndex++;
                $scope.loadQuestion($scope.nodesAll[$scope.flowIndex]);
            } else {
                $scope.showQuestion = true;
            }
        })
    };
    $scope.goPrevStep = function () {
        saveValue($scope.nodesAll[$scope.flowIndex], function () {
            if ($scope.flowIndex > 0) {
                var offset = $(angular.element('ul.timeline').children()[$scope.flowIndex - 1]).height() + 20
                console.log(offset);
                $scope.Y_offset += offset;
                $(angular.element('ul.timeline').children()).css('transform', 'translate(0px,' + $scope.Y_offset + 'px)');
                angular.element('ul.timeline').children().y += 100;
                $scope.prevFlowIndex = $scope.flowIndex;
                $scope.flowIndex--;
                $scope.loadQuestion($scope.nodesAll[$scope.flowIndex]);
            } else {
                $scope.showQuestion = true;
            }
        });
    };

    var dom = function (s) {
        return document.getElementById(s)
    };

    dom.cssName = function (name) {
        var prefixes = ['', '-ms-', '-moz-', '-webkit-', '-khtml-', '-o-'],
            rcap = /-([a-z])/g, capfn = function ($0, $1) {
                return $1.toUpperCase();
            };
        dom.cssName = function (name, target, test) {
            target = target || document.documentElement.style;
            for (var i = 0, l = prefixes.length; i < l; i++) {
                test = (prefixes[i] + name).replace(rcap, capfn);
                if (test in target) {
                    return test;
                }
            }
            return null;
        };
        return dom.cssName(name);
    };

////// flow controller end


    var Record = function (questionId, oe_id, user_id, value) {
        this.questionId = questionId;
        this.oeId = oe_id;
        this.userId = user_id;
        this.value = value;
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


///**
// *  customized uploader
// * */
//var contractUploader = $scope.contractUploader = new FileUploader({
//    url: '/upload/',
//    formData: [{type: 'customized'}, {userId: LoginService.getUserInfo().userId}]
//});
//
//if (LoginService.getUserInfo().accessToken) {
//    var token = LoginService.getUserInfo();
//    if (token) {
//        contractUploader.headers['X-AUTH-TOKEN'] = token.accessToken;
//    }
//} else {
//    contractUploader.headers['X-AUTH-TOKEN'] = '0';
//}
//contractUploader.onAfterAddingFile = function (fileItem) {
//    contractUploader.queue.length = 0;
//    contractUploader.queue.push(fileItem);
//    $scope.contractPreview.preview = true;
//    $scope.contractPreview.file = fileItem._file;
//    $scope.contractPreview.pdfCount = $scope.contractPreview.pdfCount + 1;
//};
//contractUploader.onSuccessItem = function (item, response, status, headers) {
//    $scope.record.value = response;
//};
//
//$scope.contractPreview = {
//    preview: false,
//    file: $scope.record.value,
//    pdfCount: -1,
//    height: '100%',
//    width: '100%'
//};

}])
;


app.controller('UserEmployeeRecordController', ['$scope', 'EmployeeService', 'LoginService', 'MessageService', '$timeout', 'UserFolderService', function ($scope, EmployeeService, LoginService, MessageService, $timeout, UserFolderService) {
    $scope.employees = [];
    $scope.selectedAll = false;
    var userId = LoginService.getUserInfo().userId;
    $scope.loadAll = function () {
        $scope.employeeAllPromise = EmployeeService.getEmployeeWithPercentByUserId(LoginService.getUserInfo().userId, $scope.folderTree.currentNode.id).then(
            function (data) {
                var list = MessageService.handleMsg(data);
                if (list) {
                    $scope.employees = list;
                }
            }, function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    $timeout(function () {
        $scope.loadAll();
    });


    $scope.selectAndShowEmployee = function (employee) {
        angular.forEach($scope.employees, function (rep) {
            rep.selected = rep.uuid == employee.uuid;
        });
        $timeout(function () {
            var reports = [];
            reports.push($scope.folderTree.currentNode);
            handleEmployeeReports(reports, employee);
        });
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
