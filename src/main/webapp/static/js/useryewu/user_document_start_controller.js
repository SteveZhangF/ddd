app.controller("UserDocumentStartController", ['$scope', function ($scope) {
    $scope.flows = [
        {
            name: "company information",
            description: 'In this step, we will initialize your company information',
            url: "user/company_edit.html"
        },

        {
            name: 'employment configuration',
            description: 'Next, we are going to config some fields for the employment information'
        },
        {
            name: 'employment statuses',
            description: 'Try to add some employment statuses for your company, such as Full Time, Part Time.etc ',
            url: 'user/job_employment_status_config.html'
        },
        {
            name: 'job titles',
            description: 'Try to add some job titles for your company, such as doctor, account.etc',
            url: 'user/job_title_config.html'
        },
        {
            name: 'employee information',
            description: 'Well done, now you can organize your employees',
            url: 'user/employee_edit.html'
        },
        {
            name: 'documents',
            description: 'Then we will ask you a few questions',
            url: 'user/document_company_question.html'
        },
        {
            name:'logs',
            description:'Next we will go to config the logs',
            url:'user/records_config.html'
        },{
            name:'Done',
            description:'Congratulations! you have finished all the questions and settings, Now you can click \'View Document\' to view all the generated documents'
        }

    ];
    $scope.flowIndex = 0;
    $scope.nowFlow = $scope.flows[$scope.flowIndex];
    $scope.next = function () {
        $scope.flowIndex = $scope.flowIndex + 1;
        console.log($scope.flowIndex);
        $scope.nowFlow = $scope.flows[$scope.flowIndex];
    };
    $scope.prev = function () {
        $scope.flowIndex = $scope.flowIndex - 1;
        $scope.nowFlow = $scope.flows[$scope.flowIndex];
    };
}]);

app.controller('UserDocumentCompanyQuestionController', ['$scope', 'UserWorkFlowService', 'LoginService', 'UserQuestionService', 'EmployeeService', 'FileUploader', function ($scope, UserWorkFlowService, LoginService, UserQuestionService, EmployeeService, FileUploader) {
    $scope.currentNode = {};

    $scope.currentWorkFlow = {};

    $scope.workFlows_currentNode = {};

    $scope.workFlows = [];

    $scope.currentWorkFlowIndex = 0;

    UserWorkFlowService.fetchAllWorkFlow(LoginService.getUserInfo().userId).then(
        function (response) {
            $scope.workFlows = Object.keys(response);
            $scope.workFlows_currentNode = response;
            var node_id = $scope.workFlows_currentNode[$scope.workFlows[$scope.currentWorkFlowIndex]];
            $scope.getCurrentNode(node_id);
            $scope.currentWorkFlowIndex++;
        },
        function (errResponse) {

        }
    );

    $scope.getCurrentNode = function (node_id) {
        UserWorkFlowService.getCurrentNode(node_id).then(
            function (response) {
                $scope.currentNode = response;
                $scope.getCurrentData($scope.currentNode.data.id);
            },
            function (errResponse) {
            }
        );
    };

    $scope.getCurrentData = function (dataId) {
        UserQuestionService.fetchOneQuestion(dataId).then(function (response) {
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
        if(next==''){
            $scope.finish();
        }else{
            $scope.goToNode(next);
        }
    };
    $scope.goPrev = function () {
        var prev = $scope.currentNode.prev;
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
        var node_id = $scope.workFlows_currentNode[$scope.workFlows[$scope.currentWorkFlowIndex]];
        $scope.goToNode(node_id);
        if(!!node_id){
            $scope.getCurrentNode(node_id);
            $scope.currentWorkFlowIndex++;
        }else{
            $scope.question_finish = true;
        }
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