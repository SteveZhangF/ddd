var app = angular.module('dashboardApp');

app.controller('flowToolBarController', ['$scope', 'FormService', 'WorkFlowService', function ($scope, FormService, WorkFlowService) {

    var dp = [];
    var forms=[];
    $scope.dataProvider = [];
    FormService.fetchAllForms().then(
        function (response) {
            forms=response;
            console.log(response);
            for(var j=0;j<forms.length;j++){
                var form_org = forms[j];
                var form = {
                    index:j,
                    label: form_org.form_name,
                    id: form_org.id,
                    type:'form',
                    name: form_org.form_name
                }
                dp.push(form);
            }
            $scope.dataProvider = dp;
        },
        function (errResponse) {
            console.log(errResponse);
        }
    );

    $scope.selectedOption = null;
    $scope.selectedNode = {};
    $scope.onSelect = function (option) {
        $scope.selectedNode.id = "formnode_" + option.id;
        $scope.selectedNode.label = option.label;
        $scope.selectedNode.data = JSON.stringify({id: option.id, type: option.type, name: option.name});
        $scope.selectedNode.nodetype = "form_node";
    };

    $scope.toolbar_forms = false;
    $scope.toolbar_nodes = true;
    $scope.showNodes = function () {
        $scope.toolbar_nodes = true;
        $scope.toolbar_forms = false;
    }
    $scope.showForms = function () {
        $scope.toolbar_nodes = false;
        $scope.toolbar_forms = true;
    }


    /**
     * work flow ye wu ****************************
     * */


    $scope.workflowDetail = {
        id: '',
        displayName: "",
        connections: [],
        nodes: [],
        creator: "",
        update_time: "",
        create_time: "",
        workFlow_Description: ""

    }
    /**
     * get all workflow
     * */
    self.fetchAllWorkFlow = function () {
        WorkFlowService.fetchAllWorkFlow()
            .then(
            function (d) {
                $scope.workflows = d;
            },
            function (errResponse) {
                console.error('Error while fetching Currencies');
            }
        );
    };
    self.fetchAllWorkFlow();
    /**
     * get one workflow detail
     * */
    self.fetchOneWorkFlow = function (workflow) {
        WorkFlowService.fetchOneWorkFlow(workflow.id).then(
            function (d) {
                $scope.workflowDetail = d;
            },
            function (err) {
                console.log(err);
            }
        );
    };

    /**
     * edit one workflow(edit button clicked)
     * */
    $scope.editWorkFlow = function (workflow) {
        $scope.editing = true;
        $scope.isNew = false;
        self.fetchOneWorkFlow(workflow);
        //$scope.workflowDetail = workflow;
        console.log("editing.." + $scope.workflowDetail.id);
        $scope.init($scope.workflowDetail);// init the diagram
    };
    /**
     * add new workflow clicked
     * */
    $scope.addNewWorkflow = function () {
        $scope.editing = true;
        $scope.isNew = true;
        console.log("adding..");
        $scope.init($scope.workflowDetail);// init the diagram
    };
    $scope.deleteWorkFlow = function (workflow) {
        //TODO
        WorkFlowService.deleteWorkFlow(workflow.id).then(function (response) {
            alert("Success!");
        }, function (errResponse) {
            alert("Failed, Try later!");
        });
    };
    /**
     * save one workflow
     * */
    $scope.saveWorkFlow = function () {
        console.log("saving.." + $scope.workflowDetail.id);
        console.log($scope.save());
      //  {"connections":[],"nodes":[{"BlockId":"state_start1","BlockContent":"Start","BlockX":198,"BlockY":91,"Node_Type":"state_start"}]}
      //  $scope.workflowDetail
        console.log($scope.workflowDetail);

        var nodesInfo = $scope.save();
        nodesInfo.id = $scope.workflowDetail.id;
        nodesInfo.displayName = $scope.workflowDetail.displayName;
        nodesInfo.workFlow_Description = $scope.workflowDetail.workFlow_Description;
        nodesInfo.creator = $scope.workflowDetail.creator;
        nodesInfo.create_time = $scope.workflowDetail.create_time;
        nodesInfo.update_time = $scope.workflowDetail.update_time;

        WorkFlowService.createWorkFlow( nodesInfo).then(
            function (d) {
                console.log("success");
            },
            function (e) {
                console.log(e);
            }
        );
        $scope.workflowDetail = {
            id: '',
            displayName: "",
            connections: [],
            nodes: [],
            creator: "",
            update_time: "",
            create_time: "",
            workFlow_Description: ""
        }
        $scope.editing = false;
        self.fetchAllWorkFlow();
    };
    /**
     * update workflow
     * */
    $scope.updateWorkFlow = function (workflow) {
        FormService.updateForm(workflow, workflow.id).then(
            function (d) {
                console.log("success");
            },
            function (e) {
                console.log(e);
            }
        );
    };

}]);