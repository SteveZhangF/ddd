var app = angular.module('dashboardApp');

//controllers manage an object $scope in AngularJS (this is the view model)

app.directive('hoverCode', function () {
    return {
        restrict: 'EA',
        scope: {
            hoverCoder: '='
        },
        link: function (scope, elem) {

            var showHoverCode = function () {
                var hoverCoder = scope.hoverCoder;
                if (hoverCoder.show == "true") {
                    elem.css('position', 'fixed').css('top', hoverCoder.y).css('left', hoverCoder.x).css('z-index', '99').css('opacity', '1');
                }
                if (hoverCoder.show == 'false') {
                    elem.css('position', 'fixed').css('top', -500).css('left', hoverCoder.x).css('z-index', '99').css('opacity', '1');
                }
            };

            showHoverCode();

            scope.$watch(function (scope) {
                return scope.hoverCoder.show;
            }, function () {
                showHoverCode();
            });
        }
    };
});

app.controller('FileFlowController', ['$scope', 'WorkFlowService', 'MessageService', 'ngDialog', '$timeout', 'FolderService', function ($scope, WorkFlowService, MessageService, ngDialog, $timeout, FolderService) {

    var dialog;
    var selfCtrl = this;
    selfCtrl.schema = {all: []};
    // edit
    // load the work flow from server
    $scope.getFlowOfFolder = function () {
        var folderId = $scope.thisFolder.id;
        $scope.flowEditPromise = FolderService.getFlowOfFolder(folderId).then(
            function (data) {
                var wf = MessageService.handleMsg(data);
                if (wf) {
                    $scope.workflow = wf;
                    $scope.showWorkFlow($scope.workflow);
                    $scope.initMenu(folderId);
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );

    };
    //show the work flow detail
    $scope.showWorkFlow = function (wf) {
        //clear before
        if (selfCtrl.schema.all.length > 0) {
            angular.forEach(selfCtrl.schema.all, function (node) {
                jsPlumb.removeAllEndpoints(angular.element('#item-container').find('.item[node-id=' + node.id + ']'));
            })
            selfCtrl.schema.all.length = 0;
        }
        //$scope.schema.all = wf.nodes;
        angular.forEach(wf.nodes, function (node) {
            if (node.type == 'Question') {
                var nodeNew = new QuestionNode(node.id, node.name, 'Question', node.folderNodeId, node.x, node.y);
                nodeNew.nexts = node.nexts;
                nodeNew.prev = node.prev;
                nodeNew.drop();
            } else {
                var nodeNewz = new NormalNode(node.id, node.name, 'Normal', node.folderNodeId, node.x, node.y);
                nodeNewz.nexts = node.nexts;
                nodeNewz.prev = node.prev;
                nodeNewz.drop();
            }
        });
        $timeout(function () {

            for (var i = 0; i < selfCtrl.schema.all.length; i++) {
                var node = selfCtrl.schema.all[i];
                for (var j = 0; j < node.nexts.length; j++) {
                    $scope.connect(node.id, node.nexts[j]._then, node.nexts[j]._if);
                }
            }
        }, 500);

    };
    //src=> srcid, target=>targetid
    $scope.connect = function (src, target, label) {
        $scope.initing = true;
        var src_elem = angular.element('#item-container').find('.item[node-id=' + src + ']');
        var target_elem = angular.element('#item-container').find('.item[node-id=' + target + ']');
        jsPlumb.connect({
            source: src_elem.attr('id'),
            target: target_elem.attr('id'),
//TODO add connection while init
            label: label

        });

        $scope.initing = false;
    }
    //scope.$watch(function () {
    //    return element.attr('style');
    //}, function () {
    //    var node_id = element.attr('node-id');
    //    console.log('moving');
    //    var node = scope.getNodeById(node_id,scope.schema);
    //
    //    if (node && element.css('top') != 'auto') {
    //        node.y = element.css('top');
    //        node.x = element.css('left');
    //    }
    //});

    // when save button clicked
    $scope.saveFlow = function () {
        var elements = angular.element('#item-container').children();
        angular.forEach(elements, function (el) {
            el = angular.element(el);
            var node_id = el.attr('node-id');
            var node = $scope.getNodeById(node_id, selfCtrl.schema.all);
            if (node && el.css('top') != 'auto') {
                node.y = el.css('top');
                node.x = el.css('left');
            }
        });

        //var connections = [];
        //
        //$.each(jsPlumb.getConnections(), function (idx, connection) {
        //    connections.push({
        //        connectionId: connection.id,
        //        pageSourceId: connection.sourceId,
        //        pageTargetId: connection.targetId,
        //        anchors: $.map(connection.endpoints, function(endpoint) {
        //
        //            return [[endpoint.anchor.x,
        //                endpoint.anchor.y,
        //                endpoint.anchor.orientation[0],
        //                endpoint.anchor.orientation[1],
        //                endpoint.anchor.offsets[0],
        //                endpoint.anchor.offsets[1]]];
        //
        //        })
        //    });
        //});
        //console.log(connections);


        $scope.workflow.nodes = selfCtrl.schema.all;

        $scope.flowEditPromise = WorkFlowService.updateWorkFlowDetail($scope.workflow, $scope.workflow.id).then(function (response) {
                //$scope.getFlowOfFolder();
                var wf = MessageService.handleMsg(response);
                if (wf) {
                    $scope.workflow = wf;
                    $scope.showWorkFlow(wf);
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    //reload flow
    $scope.resetFlow = function () {
        $scope.getFlowOfFolder();
    };


    // edit workflow detail start

    /**
     * menu start
     * */

    $scope.toolbarMenus = [0, 1];
    $scope.toolbarShowing = $scope.toolbarMenus[0];

    $scope.switchToolbar = function (i) {
        $scope.toolbarShowing = $scope.toolbarMenus[i];
    };

    $scope.hoverCode = {
        x: '',
        y: '',
        show: 'false'
    };
    $scope.showPreviewQuestion = function (event, questionNode) {
        var x = event.pageX;
        var y = event.pageY;
        $scope.hoverCode.x = x;
        $scope.hoverCode.y = y;
        $scope.hoverCode.show = "true";
        var questionNodeId = questionNode.folderNodeId;
        if (!questionNode.data) {
            FolderService.getElement(questionNodeId, "QUESTION")
                .then(
                function (data) {
                    //$scope.menuNodes.previewNode = data;
                    var q = MessageService.handleMsg(data);
                    if (q) {
                        questionNode.data = q;
                        $scope.menuNodes.previewNode = q;
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        } else {
            $scope.menuNodes.previewNode = questionNode.data;
        }

    };

    $scope.hidePreviewQuestion = function () {
        $scope.hoverCode.show = 'false';
    };

    var menu = [{name: 'start', type: 'Normal', data: {id: 0, name: 'start', description: 'start node'}}, {
        name: 'end',
        type: 'Normal',
        data: {id: 1, name: 'end', description: 'end node'}
    }];
// super node
    function Node(id, name, type, folderNodeId, x, y) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.folderNodeId = folderNodeId;
        this.x = x;
        this.y = y;
        this.nexts = [];
        this.prev = '';
    }

// normal
    Node.prototype.drop = function () {
    };

    Node.prototype.connect = function (target_node) {
        if(!$scope.initing){
            var next = {_if: '', _then: target_node.id};
            this.nexts.push(next);
            target_node.prev = this.id;
        }
    };

    function NormalNode(id, name, type, folderNodeId, x, y) {
        Node.call(this, id, name, type, folderNodeId, x, y);
    };

    NormalNode.prototype = new Node();
    NormalNode.prototype.drop = function () {
        if (this.type == 'Normal' && this.name == 'start') {
            $scope.workflow.startNode_id = this.id;
        }
        selfCtrl.schema.all.push(this);
    };
    //NormalNode.prototype.connect = function (target_node) {
    //
    //};

    function QuestionNode(id, name, type, folderNodeId, x, y, question) {
        Node.call(this, id, name, type, folderNodeId, x, y);
        this.data = question;
    }

    QuestionNode.prototype = new Node();
    QuestionNode.prototype.drop = function () {
        selfCtrl.schema.all.push(this);
    };

    var showQuestionConnectDialog = function (self, target_node, success, fail) {

        var connectDialog = ngDialog.open({
            template: 'connect-editor.html',
            scope: $scope,
            showClose: false,
            closeByEscape: false,
            preCloseCallback: function (value) {
                if (value) {
                    var target_node = $scope.connectingSourceNode.targetNode;
                    var _if = $scope.connectingSourceNode.selectedOption;
                    var _then = target_node.id;
                    var next = {_if: _if, _then: _then};
                    if (!self.nexts) {
                        self.nexts = []
                    }
                    self.nexts.push(next);
                    target_node.prev = self.id;
                    success(_if);
                } else {
                    fail();
                }
            }
        });
        $scope.connectingSourceNode = {selectedOption: "", node: self, targetNode: target_node}
    }

    QuestionNode.prototype.connect = function (target_node, success, fail) {
        if(!$scope.initing){
            var self = this;
            if (self.data) {
                if (!self.data.options) {
                    self.data.options = [];
                }
                self.data.options.push({name: 'not null', value: 'NOTNULL'});
                showQuestionConnectDialog(self, target_node, success, fail);
            } else {
                FolderService.getElement(this.folderNodeId, "QUESTION")
                    .then(
                    function (data) {
                        var q = MessageService.handleMsg(data);
                        self.data = q;
                        if (!self.data.options) {
                            self.data.options = [];
                        }
                        self.data.options.push({name: 'not null', value: 'NOTNULL'});
                        showQuestionConnectDialog(self, target_node, success, fail);
                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                        fail();
                    }
                );
            }
        }

    };

    $scope.menuNodes = {normalNodes: [], questionNodes: [], droppedNode: new Node(), previewNode: new Node()};

    $scope.initMenu = function (parentId) {
        $scope.menuNodes.normalNodes.length = 0;
        for (var i = 0; i < menu.length; i++) {
            var nodez = new NormalNode('menu_normal_node_' + i, menu[i].name, menu[i].type, i
                // 这个i代表了start 和 end
                , 0, 0);
            $scope.menuNodes.normalNodes.push(nodez);
        }

        FolderService.loadQuestionNodesBasedOnFolderId(parentId).then(function (response) {
            $scope.menuNodes.questionNodes.length = 0;
            var qList = MessageService.handleMsg(response);
            if (qList) {
                for (var i = 0; i < qList.length; i++) {
                    var nodez = new QuestionNode('menu_question_node_' + i, qList[i].name, 'Question', qList[i].id, 0, 0, qList[i]);
                    $scope.menuNodes.questionNodes.push(nodez);
                }
            }
        }, function (errResponse) {
            MessageService.handleServerErr(errResponse);
        });
    };

    /**
     * menu end
     * */

    /**
     * schema start
     * */

        // schema_uuid should always yield a unique identifier, can never be decreased
    $scope.schema_uuid = 0;

    // add a module to the schema
    $scope.addModuleToSchema = function (posX, posY) {
        var droppedNode = angular.copy($scope.menuNodes.droppedNode);
        droppedNode.x = posX;
        droppedNode.y = posY;

        WorkFlowService.createWorkFlowNode(droppedNode).then(
            function (response) {
                //droppedNode = response;
                droppedNode.id = response.id;
                droppedNode.drop();
                //if (droppedNode.name == 'start' && droppedNode.type == "Normal") {
                //    $scope.workflow.startNode_id = droppedNode.id;
                //}
                //$scope.schema.all.push(droppedNode);
            },
            function (errResponse) {
                alert('please try later');
            }
        );


    };

    $scope.removeNode = function (node, schema) {
        for (var i = 0; i < schema.length; i++) {
            if (node.prev == schema[i].id) {
                for (var j = 0; j < schema[i].nexts.length; j++) {
                    if (schema[i].nexts[j]._then == node.id) {
                        schema[i].nexts.splice(j, 1);
                    }
                }
            }
            for (var k = 0; k < node.nexts.length; k++) {
                if (node.nexts[k]._then == schema[i].id) {
                    schema[i].prev = '';
                }
            }
            // compare in non-strict manner
            if (schema[i].id == node.id) {
                schema.splice(i, 1);
            }
        }
        jsPlumb.removeAllEndpoints(angular.element('#item-container').find('.item[node-id=' + node.id + ']'));
    };

    $scope.getNodeById = function (node_id, schema) {
        for (var i = 0; i < schema.length; i++) {
            if (schema[i].id == node_id) {
                return schema[i];
            }
        }
    };

    $scope.init = function () {
        jsPlumb.bind("ready", function () {
            jsPlumb.unbind();
            /**
             * when click on a connection
             * confirm and delete the connection
             * */
            jsPlumb.bind("click", function (conn, originalEvent) {
                if (confirm("Delete?"))
                    jsPlumb.detach(conn);
                //TODO
            });
            jsPlumb.bind("connection", function (info) {
                $scope.$apply(function () {
                    var source = angular.element(info.source[0]);
                    var target = angular.element(info.target[0]);
                    var source_node = $scope.getNodeById(source.attr('node-id'), selfCtrl.schema.all);
                    var target_node = $scope.getNodeById(target.attr('node-id'), selfCtrl.schema.all);
                    source_node.connect(target_node, function (_if) {
                        info.connection.setLabel(_if);
                    }, function () {
                        jsPlumb.detach(info.connection);
                    });
                });
            });
        });

        $scope.getFlowOfFolder();
    };
    //$scope.getFlowOfFolder();
}]);


//directives link user interactions with $scope behaviours
//now we extend html with <div plumb-item>, we can define a template <> to replace it with "proper" html, or we can
//replace it with something more sophisticated, e.g. setting jsPlumb arguments and attach it to a double-click
//event
app.directive('plumbItem', function () {
    return {
        replace: true,
        scope: {
            schema: '='
        },
        controller: 'FileFlowController',
        link: function (scope, element, attrs) {

            jsPlumb.makeTarget(element, {
                anchor: 'Continuous',
                maxConnections: 2,
                endpoint: ["Dot", {radius: 20}],  //端点的形状
                paintStyle: {
                    strokeStyle: "#1e8151",
                    fillStyle: "transparent",
                    radius: 2,
                    lineWidth: 10
                },		//端点的颜色样式
            });
            jsPlumb.draggable(element, {
                containment: element.parent()
            });
            //scope.$watch(function () {
            //    return element.attr('style');
            //}, function () {
            //    var node_id = element.attr('node-id');
            //    console.log('moving');
            //    var node = scope.getNodeById(node_id,scope.schema);
            //
            //    if (node && element.css('top') != 'auto') {
            //        node.y = element.css('top');
            //        node.x = element.css('left');
            //    }
            //});
        }
    };
});

//
// This directive should allow an element to be dragged onto the main canvas. Then after it is dropped, it should be
// painted again on its original position, and the full module should be displayed on the dragged to location.
//
app.directive('plumbMenuItem', function () {
    return {
        replace: true,
        controller: 'FileFlowController',
        link: function (scope, element, attrs) {

            // jsPlumb uses the containment from the underlying library, in our case that is jQuery.
            var jsplumbInstance = jsPlumb.getInstance();
            jsplumbInstance.draggable(element, {
                containment: element.parent().parent()
            });
        }
    };
});

app.directive('plumbConnect', function () {
    return {
        replace: true,
        link: function (scope, element, attrs) {
            var connectorPaintStyle = {
                lineWidth: 4,
                strokeStyle: "#61B7CF",
                joinstyle: "round",
                outlineColor: "white",
                outlineWidth: 2
            };
            // 鼠标悬浮在连接线上的样式
            var connectorHoverStyle = {
                lineWidth: 4,
                strokeStyle: "#216477",
                outlineWidth: 2,
                outlineColor: "white"
            };

            jsPlumb.makeSource(element, {
                parent: $(element).parent(),
                endpoint: ["Dot", {radius: 20}],  //端点的形状
                connectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
                connectorHoverStyle: connectorHoverStyle,
                paintStyle: {
                    strokeStyle: "#1e8151",
                    fillStyle: "transparent",
                    radius: 2,
                    lineWidth: 10
                },		//端点的颜色样式
                //anchor: "AutoDefault",
                connector: ["Flowchart", {stub: [10, 30], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
                isTarget: false,	//是否可以放置（连线终点）
                maxConnections: 10,	// 设置连接点最多可以连接几条线
                connectorOverlays: [["Arrow", {width: 10, length: 10, location: 0.5}]]

            });
        }
    };
});


app.directive('droppable', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.zoom = function (scale) {
                //jsPlumb.setContainer("chart-container");
                element.css({
                    "-webkit-transform": "scale(" + scale + ")",
                    "-moz-transform": "scale(" + scale + ")",
                    "-ms-transform": "scale(" + scale + ")",
                    "-o-transform": "scale(" + scale + ")",
                    "transform": "scale(" + scale + ")",
                    "TransformOrigin": "0% 0%"
                });
                jsPlumb.setZoom(scale);
            };

            scope.zoomScale = 1;
            element.bind("wheel", function (e) {
                var e = window.event || e; // old IE support
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                if (scope.zoomScale <= 2 && scope.zoomScale >= 0.75) {
                    scope.zoomScale = scope.zoomScale + delta * 0.05;
                } else if (scope.zoomScale < 0.75) {
                    scope.zoomScale = 0.75;
                    //scope.zoomScale = scope.zoomScale;
                } else {
                    scope.zoomScale = 2;
                }

                scope.zoom(scope.zoomScale);

                return false;
            });


            element.droppable({
                drop: function (event, ui) {
                    // angular uses angular.element to get jQuery element, subsequently data() of jQuery is used to get
                    // the data-identifier attribute
                    var dragEl = angular.element(ui.draggable),
                        dropEl = angular.element(this);

                    // if dragged item has class menu-item and dropped div has class drop-container, add module
                    if (dragEl.hasClass('menu-item') && dropEl.hasClass('drop-container')) {

                        var x = event.offsetX;
                        var y = event.offsetY;

                        scope.addModuleToSchema(x, y);
                    }

                    scope.$apply();
                }
            });
        }
    };
});

app.directive('draggable', function () {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict: 'A',
        //The link function is responsible for registering DOM listeners as well as updating the DOM.
        link: function (scope, element, attrs) {
            element.draggable({
                // let it go back to its original position
                revert: true,
            });
        }
    };
});