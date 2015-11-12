/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
app.controller('UserWorkflowController', ['$scope', 'UserWorkFlowService', 'LoginService', 'UserQuestionService', 'EmployeeService','FileUploader',function ($scope, UserWorkFlowService, LoginService, UserQuestionService,EmployeeService,FileUploader) {
    $scope.workflows = [];
    $scope.currentNode = {};
    $scope.currentWorkFlow = {name: '', id: '', type: '', oe_id: ''};

    UserWorkFlowService.fetchAllWorkFlow().then(function (data) {
        $scope.workflows.length = 0;
        for (var i = 0; i < data.length; i++) {
            console.log(JSON.parse(data[i]));
            $scope.workflows.push(JSON.parse(data[i]));
        }
    }, function (err) {
        alert("err");
        $scope.workflows.push({id: '4028809150728c640150728d367b0000', name: 'asddsa'});
    });


    var UserWorkFlow = function (user_id, workFlowId, type, oe_id, current_node) {
        this.user_id = user_id;
        this.workFlowId = workFlowId;
        this.type = type;
        this.oe_id = oe_id;
        this.currentNode = current_node;
    }


    var Node = function (type, name, id, data, nexts, prev) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.data = data;
        this.nexts = nexts;
        this.prev = prev;
    }

    var NormalNode = function (type, name, id, data, nexts, prev) {
        Node.call(this, type, name, id, data, nexts, prev);
    }
    NormalNode.prototype = new Node();

    var QuestionNode = function (type, name, id, data, nexts, prev) {
        Node.call(this, type, name, id, data, nexts, prev);
    }
    QuestionNode.prototype = new Node();
    QuestionNode.prototype.getData = function () {
        // get question content
        UserQuestionService.fetchOneQuestion(this.data.id).then(function (response) {
                $scope.nodeData = new QuestionNodeData(
                    response.id,
                    response.type,
                    response.name,
                    response.description,
                    response.content,
                    response.options);
                $scope.nodeData.show();

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
    }
    $scope.record = new Record();
    QuestionNode.prototype.goNext = function () {
        var wf_id = $scope.currentWorkFlow.id;
        var type = $scope.currentWorkFlow.type;
        var oe_id = $scope.currentWorkFlow.oe_id;
        var userWorkFlow = new UserWorkFlow(LoginService.getUserInfo().userId, wf_id, type, oe_id);
        //userWorkFlow.currentNode = $scope.currentNode.nexts[0]._then;
        var value = $scope.record.value;
        for (var i = 0; i < $scope.currentNode.nexts.length; i++) {
            if($scope.currentNode.nexts[i]._if == "NOTNULL"){
                userWorkFlow.currentNode = $scope.currentNode.nexts[i]._then;
                break;
            }
            if (value == $scope.currentNode.nexts[i]._if) {
                userWorkFlow.currentNode = $scope.currentNode.nexts[i]._then;
                break;
            }
        }

        //submit record
        $scope.record.oeId = oe_id;
        $scope.record.questionId = $scope.nodeData.id;
        $scope.record.userId = LoginService.getUserInfo().userId;

        UserWorkFlowService.submitRecord($scope.record).then(
            function (response) {
                $scope.goToNode(userWorkFlow);
            },
            function (errResponse) {
                console.log(errResponse);
            }
        );
    };


    var StartNode = function (type, name, id, data, nexts, prev) {
        Node.call(this, type, name, id, data, nexts, prev);
    }
    StartNode.prototype = new Node();
    StartNode.prototype.getData = function () {
        //TODO

        var type = $scope.currentWorkFlow.type;
        switch (type) {
            case "Company":
                $scope.nodeData = {
                    type: "select",
                    options: [{value: LoginService.getUserInfo().companyId, name: "MyCompany"}]
                };
                break;
            case "Employee":

                EmployeeService.getEmployeeByUserId(LoginService.getUserInfo().userId).then(
                    function(response){
                        $scope.nodeData={
                            type:'select',
                            options:[]
                        };
                        angular.forEach(response, function (employee) {
                           $scope.nodeData.options.push({value:employee.uuid,name:employee.firstName+" "+employee.lastName});
                        });
                    }
                );
                break;
            case "Department":
                break;
        }
    }

    StartNode.prototype.goNext = function () {
        var wf_id = $scope.currentWorkFlow.id;
        var type = $scope.currentWorkFlow.type;
        var oe_id = $scope.currentWorkFlow.oe_id;
        var userWorkFlow = new UserWorkFlow(LoginService.getUserInfo().userId, wf_id, type, oe_id);
        userWorkFlow.currentNode = $scope.currentNode.nexts[0]._then;
        $scope.goToNode(userWorkFlow);
    }


    var EndNode = function (type, name, id, data, nexts, prev) {
        Node.call(this, type, name, id, data, nexts, prev);
    }
    EndNode.prototype = new Node();
    EndNode.prototype.getData = function () {

    }

    var NodeFactory = function (type, name, id, data, nexts, prev) {
        switch (type) {
            case "Normal":
                if (name == "start") {
                    return new StartNode(type, name, id, data, nexts, prev);
                } else if (name == "end") {
                    return new EndNode(type, name, id, data, nexts, prev);
                }
                break;
            case "Question":
                return new QuestionNode(type, name, id, data, nexts, prev);
        }
    }


    var NodeData = function (id, type, name, description, content, options) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
        this.content = content;
        this.options = options;
    }

    NodeData.prototype.show = function () {
    }

    var QuestionNodeData = function (id, type, name, description, content, options) {
        NodeData.call(this, id, type, name, description, content, options);
    }
    QuestionNodeData.prototype = new NodeData();
    QuestionNodeData.prototype.show = function () {
        $scope.record = new Record($scope.nodeData.id, $scope.currentWorkFlow.oe_id, LoginService.getUserInfo().userId);

        // for checkbox

        UserWorkFlowService.getRecordValue($scope.record).then(
            function (response) {



                if ($scope.nodeData.type == 'checkbox') {
                    $scope.record.values = [$scope.nodeData.options];
                }
                $scope.record = response;

                if($scope.nodeData.type == "file"){
                    $scope.contractPreview.preview = false;
                    $scope.contractPreview.file = $scope.record.value;
                    $scope.contractPreview.pdfCount = 1+$scope.contractPreview.pdfCount;
                }

                if($scope.nodeData.type == 'checkbox'){
                    var values = eval($scope.record.value);
                    for(var i=0;i<values.length;i++){
                        for(var j=0;j<$scope.nodeData.values.length;j++){
                            if(values[i]==$scope.nodeData.values[j]){
                                $scope.record.values[j]=true;
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

    }
    $scope.workFlowStart = function () {
        var name = $scope.currentWorkFlow.name;
        var wf_id = $scope.currentWorkFlow.id;
        var type = $scope.currentWorkFlow.type;
        var oe_id = $scope.currentWorkFlow.oe_id;

        var userWorkFlow = new UserWorkFlow(LoginService.getUserInfo().userId, wf_id, type, oe_id);

        UserWorkFlowService.getCurrentNode(userWorkFlow).then(
            function (response) {
                $scope.currentNode = NodeFactory(
                    response.type,
                    response.name,
                    response.id,
                    response.data,
                    response.nexts,
                    response.prev
                );
                $scope.currentNode.getData();
            },
            function (errResponse) {
                $scope.currentNode = node
            }
        );

    }

    $scope.workFlowChooses = function (wf) {
        $scope.currentWorkFlow.name = wf.name;
        $scope.currentWorkFlow.id = wf.id;
        $scope.currentWorkFlow.type = wf.type;

        $scope.currentNode = new StartNode("StartNode");
        $scope.currentNode.getData();

    };

    var getValue = function () {
        var type = $scope.nodeData.type;
        var id = $scope.nodeData.id;
        var element = angular.element("plugin[id='" + id + "']");
        var value = element.children().val();
        return value;
    };

    $scope.goToNode = function (userWorkFlow) {
        UserWorkFlowService.goToNode(userWorkFlow).then(
            function (response) {
                $scope.currentNode = NodeFactory(
                    response.type,
                    response.name,
                    response.id,
                    response.data,
                    response.nexts,
                    response.prev
                );
                $scope.currentNode.getData();
            },
            function (errResponse) {
                $scope.currentNode = node
            }
        );
    }

    $scope.goNext = function () {
        $scope.currentNode.goNext();
    };
    $scope.goPrev = function () {
        //var userWorkFlow = {
        //    user_id: LoginService.getUserInfo().userId,
        //    workFlowId: $scope.currentWorkFlow.id,
        //    currentNode: $scope.currentNode.prev
        //};
        var wf_id = $scope.currentWorkFlow.id;
        var type = $scope.currentWorkFlow.type;
        var oe_id = $scope.currentWorkFlow.oe_id;
        var userWorkFlow = new UserWorkFlow(LoginService.getUserInfo().userId, wf_id, type, oe_id);
        userWorkFlow.currentNode = $scope.currentNode.prev;
        UserWorkFlowService.goToNode(userWorkFlow).then(
            function (response) {
                $scope.currentNode = NodeFactory(
                    response.type,
                    response.name,
                    response.id,
                    response.data,
                    response.nexts,
                    response.prev
                );
                $scope.currentNode.getData();
            },
            function (errResponse) {
                $scope.currentNode = node;
            }
        );
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
    }

}]);