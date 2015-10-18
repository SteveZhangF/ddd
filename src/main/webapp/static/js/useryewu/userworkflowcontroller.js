/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

app.controller('UserWorkflowController', ['$scope', 'UserWorkFlowService','UserWorkFlowService', 'LoginService', function ($scope, ngDialog, UserWorkFlowService,LoginService) {
// ["{id:'402880915076f662015076f82cf30000',name:'asddsa'}","{id:'4028809150728c640150728d367b0000',name:'asddsa'}"]
    $scope.workflows = [];
    UserWorkFlowService.fetchAllWorkFlow().then(function(data){
        $scope.workflows.length=0;
        for(var i=0;i<data.length;i++){
            console.log(JSON.parse(data[i]));
            $scope.workflows.push(JSON.parse(data[i]));
        }
    },function(err){
        alert("err");
    });



    console.log($scope.workflows);
    $scope.workFlowStart = function (wf) {
        console.log(wf.id);
        console.log(wf.name);
    }


}]);