/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
app.controller('UserWorkflowController', ['$scope', 'UserWorkFlowService', 'LoginService', 'UserQuestionService', function ($scope, UserWorkFlowService, LoginService, UserQuestionService) {
// ["{id:'402880915076f662015076f82cf30000',name:'asddsa'}","{id:'4028809150728c640150728d367b0000',name:'asddsa'}"]
    $scope.workflows = [];
    $scope.currentNode = {};
    $scope.currentWorkFlow = {name: '', id: ''};
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

    //private String workFlowId;
    //private String currentNode;
    //private int user_id;

    var node = {
        id: "40288085509d05a201509d06ed420001",
        name: "start",
        type: "Normal",
        x: "223px",
        y: "84px",
        data: {id: 0, description: "start node"},
        nexts: [{id: 4, _if: "", _then: "40288085509d5e5901509d6e9e8e0003"}],
        prev: ""
    };
    var node2 = {
        "id": "40288085509d5e5901509d6e9e8e0003",
        "name": "fdvfdsv",
        "type": "Question",
        "x": "555px",
        "y": "95px",
        "data": {
            "id": 1,
            "description": "dasdasdasd"
        },
        "nexts": [],
        "prev": "40288085509d05a201509d06ed420001"
    };
    $scope.workFlowStart = function (wf) {
        $scope.currentWorkFlow.name = wf.name;
        $scope.currentWorkFlow.id = wf.id;
        var userWorkFlow = {user_id: LoginService.getUserInfo().userId, workFlowId: wf.id};
        UserWorkFlowService.getCurrentNode(userWorkFlow).then(
            function (response) {
                $scope.currentNode = response;
            },
            function (errResponse) {
                $scope.currentNode = node
            }
        );
    };
    
    $scope.submitNode = function () {

    };


    $scope.goNext = function () {
        if ($scope.currentNode.type == 'Normal') {
            var userWorkFlow = {
                user_id: LoginService.getUserInfo().userId,
                workFlowId: $scope.currentWorkFlow.id,
                currentNode: $scope.currentNode.nexts[0]._then
            };
            UserWorkFlowService.goToNode(userWorkFlow).then(
                function (response) {
                    $scope.currentNode = response;
                },
                function (errResponse) {
                    $scope.currentNode = node2;
                }
            );
        }
    };
    $scope.goPrev = function () {
        var userWorkFlow = {
            user_id: LoginService.getUserInfo().userId,
            workFlowId: $scope.currentWorkFlow.id,
            currentNode: $scope.currentNode.prev
        };
        UserWorkFlowService.goToNode(userWorkFlow).then(
            function (response) {
                $scope.currentNode = response;
            },
            function (errResponse) {
                $scope.currentNode = node;
            }
        );
    };

    $scope.nodeData = {};
    $scope.getNodeData = function () {
        var data_id = $scope.currentNode.data.id;
        if ($scope.currentNode.type = "Question") {
            UserQuestionService.fetchOneQuestion(data_id).then(function (response) {
                    $scope.nodeData = response;
                    angular.element('#node-data-content').html($scope.nodeData.content);
                },
                function (errResponse) {
                    $scope.nodeData = {
                        "name": "fdvfdsv",
                        "id": 1,
                        "type": "text",
                        "description": "dasdasdasd",
                        "content": "<plugin id=\"1\"><input class=\"form-control\" type=\"text\"></plugin>"
                    };
                    angular.element('#node-data-content').html($scope.nodeData.content);
                }
            );

        }
    };


}]);