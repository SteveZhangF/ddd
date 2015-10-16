var app = angular.module('dashboardApp');

app.controller('flowToolBarController', ['$scope', 'FormService', 'WorkFlowService', function ($scope, FormService, WorkFlowService) {
    $scope.dataProvider = {};
    var dp = [];
    for (var i = 0; i < 1000; i++) {
        dp.push({
            index: i,
            label: "label " + i,
            value: "value " + i,
            id: i,
            type: "FormNode",
            name: "form" + i
        });
    }
    //var formDetail_ = {
    //    id: "",
    //    fields_count: "",
    //    creator: "",
    //    createTime: "",
    //    updateTime: "",
    //    _del: "",
    //    context_parse: "",
    //    context: "",
    //    form_desc: "",
    //    form_name: "",
    //    data:""
    //};
    //var forms = FormService.fetchAllForms();
    //for(var j=0;j<forms.length;j++){
    //    var form_org = forms[i];
    //    var form = {
    //        index:i,
    //        label: form_org.form_name,
    //        id: form_org.id,
    //        type:'form',
    //        name: form_org.form_name
    //
    //    }
    //    dp.push(form);
    //}
    this.dataProvider = dp;
    this.selectedOption = null;
    $scope.selectedNode = {};
    this.onSelect = function (option) {
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

    $scope.workflows = [{
        "id":"",
        "displayName":"d",
        "diagramId":null,
        "creator":"",
        "workFlow_Description":"",
        "create_time":null,
        "update_time":null,
        "connections":[
            {
                "id":null,
                "displayName":null,
                "diagramId":"con_14",
                "connectionType":"defaultConnection",
                "successValue":null,
                "pageTargetId":"state_question3",
                "pageSourceId":"state_start1"
            },
            {
                "id":null,
                "displayName":null,
                "diagramId":"con_20",
                "connectionType":"defaultConnection",
                "successValue":null,
                "pageTargetId":"state_end4",
                "pageSourceId":"state_question3"
            }
        ],
        "nodes":[
            {
                "id":null,
                "displayName":"Start",
                "diagramId":"state_start1",
                "position_top":125,
                "position_left":15,
                "nodeType":"StartNode",
                "elementName":"Start",
                "elementId":0
            },
            {
                "id":null,
                "displayName":"sdda",
                "diagramId":"state_question3",
                "position_top":232,
                "position_left":395,
                "nodeType":"QuestionNode",
                "elementName":"sdda",
                "elementId":0
            },
            {
                "id":null,
                "displayName":"End",
                "diagramId":"state_end4",
                "position_top":374,
                "position_left":122,
                "nodeType":"EndNode",
                "elementName":"End",
                "elementId":0
            }
        ]
    }];
    $scope.workflowDetail = {
        id: '',
        workflowname: "",
        connections: [],
        nodes: [],
        creator: "",
        update_time: "",
        create_time: "",
        workflow_desc: ""

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
    /**
     * get one workflow detail
     * */
    self.fetchOneForm = function (workflow) {
        WorkFlowService.fetchOneForm(workflow.id).then(
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
        //TODO self.fetchOneForm(form);
        $scope.workflowDetail = workflow;
        console.log("editing.." + workflow.id);
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
    $scope.deleteWorkflow = function (workflow) {
        //TODO
        WorkFlowService.deleteWorkFlow(workflow.id);

        // test
        var index = $scope.forms.indexOf(workflow);
        $scope.workflows.splice(index, 1);
        console.log("delete.." + workflow.id);
    };
    /**
     * save one workflow
     * */
    $scope.saveWorkFlow = function () {
        //console.log("saving.." + $scope.workflowDetail.id);
        //console.log($scope.save());
        //{"connections":[],"nodes":[{"BlockId":"state_start1","BlockContent":"Start","BlockX":198,"BlockY":91,"Node_Type":"state_start"}]}
        //$scope.workflowDetail
        //console.log($scope.workflowDetail);
        //WorkFlowService.createWorkFlow( $scope.workflowDetail).then(
        //    function (d) {
        //        console.log("success");
        //    },
        //    function (e) {
        //        console.log(e);
        //    }
        //);
        var nodesInfo = $scope.save();
        nodesInfo.id = $scope.workflowDetail.id;
        nodesInfo.workflowname = $scope.workflowDetail.workflowname;
        nodesInfo.workflow_desc = $scope.workflowDetail.workflow_desc;
        nodesInfo.creator = $scope.workflowDetail.creator;
        nodesInfo.create_time = $scope.workflowDetail.create_time;
        nodesInfo.update_time = $scope.workflowDetail.update_time;

        console.log('============');
        console.log(JSON.stringify(nodesInfo));
        //test
        if($scope.isNew){
            $scope.workflows.push(nodesInfo);
        }
        $scope.workflowDetail = {
            id: '',
            workflowname: "",
            connections: [],
            nodes: [],
            creator: "",
            update_time: "",
            create_time: "",
            workflow_desc: ""
        }
        $scope.editing = false;
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