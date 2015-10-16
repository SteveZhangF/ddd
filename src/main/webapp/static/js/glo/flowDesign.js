angular.module('dashboardApp')

    .directive('flowDesign', function () {
        return {
            restrict: 'EA', //E = element（元素）, A = attribute（属性）, C = class, M = comment
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                //@ 读取属性值， = 提供双向绑定， & 以函数一起工作
                formUrl: '@',
                jsonProvider: '@',
                options: '=',
            },
            templateUrl: 'flowd/dom.html',
            controller: 'flowToolBarController', //Embed a custom controller in the directive 在指令中嵌入一个自定义控制器
            link: function (scope, element, attrs) {
                //init the diagram reading data from old data and recover the nodes and connections

                /**
                 * {
    "id": "",
    "workflowname": "ddd",
    "workflow_desc": "",
    "creator": "",
    "create_time": "",
    "update_time": "",
    "$$hashKey": "object:868"
}
                 * */

                var i = 0;// for count the nodes id
                scope.init = function (workflowDetail) {
                    console.log('initing');
                    jsPlumb.deleteEveryEndpoint();
                    $("#diagramarea").html("");
                    var nodes = workflowDetail.nodes;
                    var connections = workflowDetail.connections;
                    $.each(nodes, function (ii, node) {
                        var node_id = node.diagramId;
                        var node_name = node.displayName;
                        var top = node.position_top;
                        var left = node.position_left;
                        var node_type = node.nodeType;
                        var node_data = JSON.stringify({
                            id: node.elementId,
                            name: node.elementName,
                            type: node.nodeType
                        })
                        console.log(node);
                        switch (node_type) {
                            case 'FormNode':
                                addOtherNodes(node_id, node_name, node_data, left, top);
                                break;
                            case 'EndNode':
                                addEnd(node_id, left, top);
                                break;
                            case 'StartNode':
                                addStart(node_id, left, top);
                                break;
                            case 'QuestionNode':
                                addQuestion(node_id, node_name, node_data, left, top);
                                break;
                        }
                    });
                    $.each(connections, function (iii, conn) {
                        console.log(conn);
                        var PageSourceId = conn.PageSourceId;
                        var PageTargetId = conn.PageTargetId;
                        /**
                         * TODO
                         * dose't display well need to be fixed
                         * */
                        jsPlumb.connect({
                            source: PageSourceId, target: PageTargetId, connector: ['Flowchart']
                        });
                    });
                    jsPlumb.repaint();
                };

                scope.options = {}
                scope.options.selected_question = {
                    question_name: '',
                    branch_count: '',
                    branches: [{
                        branch_name: '',
                        branch_value: ''
                    }], isnew: true, left: '0', top: '0'
                };
                scope.save = function save() {
                    var connects = [];
                    $.each(jsPlumb.getAllConnections(), function (idx, connection) {
                        var cont = connection.getLabel();
                        //var ConnectText = $(cont).html();
                        $source = $(connection.source);
                        $target = $(connection.target);
                        // 如果源为question，则此connection为  有条件边
                        var contype = "";
                        if ($source.attr('nodetype') == 'state_question') {
                            contype = 'questionConnection';
                            var sourceNext = $source.attr("next");
                            if (sourceNext) {
                                sourceNext = JSON.parse(sourceNext);
                                sourceNext.push({
                                    tiaojian: cont,
                                    next: $target.attr('id')
                                });
                            } else {
                                sourceNext = [];
                                sourceNext.push({
                                    tiaojian: cont,
                                    next: $target.attr('id')
                                });
                            }
                            $source.attr('next', JSON.stringify(sourceNext));
                        } else {
                            contype = 'defaultConnection';
                            var sourceNext2 = [];
                            sourceNext2.push({
                                tiaojian: "default",
                                next: $target.attr('id')
                            });
                            $source.attr('next', JSON.stringify(sourceNext2));
                        }
                        connects.push({
                            id: "",
                            dispalyName: cont,
                            connectionType: contype,
                            diagramId: connection.id,
                            successValue: cont,
                            PageSourceId: connection.sourceId,
                            PageTargetId: connection.targetId
                        })
                    });
                    var blocks = [];
                    $("#diagramarea .node").each(function (idx, elem) {
                        var $elem = $(elem);
                        console.log($elem.attr('node_data'));
                        var element_data = {};
                        var next = {};
                        if ($elem.attr('next')) next = JSON.parse($elem.attr("next"));
                        if ($elem.attr('node_data'))element_data = JSON.parse($elem.attr('node_data'));
                        blocks.push({
                            id: "",
                            displayName: $elem.html(),
                            diagramId: $elem.attr('id'),
                            "position_top": parseInt($elem.css("top"), 10),
                            "position_left": parseInt($elem.css("left"), 10),
                            "nodeType": $elem.attr('nodetype'),
                            Node_Data: {
                                element_data: element_data,
                                next: next
                            }
                        });
                    });

                    var fina = {connections: connects, nodes: blocks};

                    return fina;
                };
                function doubleclick(id) {
                    $(id).dblclick(function () {
                        var text = $(this).text();
                        $(this).html("");
                        $(this).append("<input type='text' value='" + text + "' />");
                        $(this).mouseleave(function () {
                            $(this).html($("input[type='text']").val());
                        });
                    });
                }


                var currentUI = null;

                function addStart(id, left, top) {
                    $("#diagramarea").append('<div nodetype=\'StartNode\' class="node" style="border-radius: 25em"  id="' + id + '" >' + 'Start' + '</div>');
                    $("#" + id).css("left", left).css("top", top);
                    jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
                    jsPlumb.draggable(id);
                    $("#" + id).draggable({containment: "parent"});

                }

                function addEnd(id, left, top) {
                    $("#diagramarea").append('<div nodetype=\'EndNode\' class="node" style="border-radius: 25em"  id="' + id + '" >' + 'End' + '</div>');
                    $("#" + id).css("left", left).css("top", top);
                    jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, solidCircle);
                    jsPlumb.draggable(id);
                    $("#" + id).draggable({containment: "parent"});
                }

                function addQuestion(id, node_name, node_data, left, top) {
                    $("#diagramarea").append("<div nodetype=\'QuestionNode\' class='node' id='" + id + "'>" + node_name + "</div>");
                    $("#" + id).css("left", left).css("top", top);
                    $("#" + id).attr("node_data", node_data);
                    jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, solidCircle);//入
                    jsPlumb.addEndpoint(id, {anchors: "Assign"}, questionOut());//出
                    jsPlumb.draggable(id);
                    $("#" + id).draggable({containment: "parent"});
                }

                function addOtherNodes(id, node_name, node_data, left, top) {
                    $node_dropped = $("<div nodetype=\'FormNode\' class='node' id='" + id + "'>" + node_name + "</div>");
                    $node_dropped.attr("node_data", node_data);
                    $node_dropped.css("left", left).css("top", top);
                    $("#diagramarea").append($node_dropped);
                    jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, solidCircle);
                    jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
                    jsPlumb.draggable(id);
                    $("#" + id).draggable({containment: "parent"});
                    doubleclick("#" + id);
                }

                /**
                 * set nodes draggable
                 * */
                $("#controllernodes").children().draggable({
                    helper: "clone",
                    scope: "ss",
                });
                $("#previewNode").draggable({
                    helper: "clone",
                    scope: "ss"
                });

                /**
                 * set diagram area droppable
                 * */
                $("#diagramarea").droppable({
                    scope: "ss",
                    drop: function (event, ui) {
                        currentUI = ui;
                        var left = parseInt(ui.offset.left - $(this).offset().left);
                        var top = parseInt(ui.offset.top - $(this).offset().top);
                        var name = ui.draggable[0].id;
                        switch (name) {
                            //start
                            case "node1":
                                i++;
                                id = "state_start" + i;
                                addStart(id, left, top);
                                break;
                            //question
                            case "node3":
                                i++;
                                id = "state_question" + i;
                                var question_name1 = prompt("please input the question desription", '');
                                var node_data1 = JSON.stringify({question_name: question_name1});
                                addQuestion(id, question_name1, node_data1, left, top);
                                break;
                            //end
                            case "node4":
                                i++;
                                id = "state_end" + i;
                                addEnd(id, left, top);
                                break;
                            //others
                            default :
                                i++;
                                id = "state_flow" + i;
                                var node_name = $(ui.helper).html();
                                var node_data = $(ui.helper).attr('node_data');
                                addOtherNodes(id, node_name, node_data, left, top);
                                break;
                                i++;
                                id = ""
                                break;
                        }
                    }
                });
                $("#diagramarea").on("mouseenter", ".node", function () {
                    $(this).append('<img src="images/sort_both.png"  style="position: absolute;" />');
                    if ($(this).text() == "Start" || $(this).text() == "End") {
                        $("img").css("left", 10).css("top", 0);
                    } else {
                        $("img").css("left", 10).css("top", -10);
                    }
                });
                $("#diagramarea").on("mouseleave", ".node", function () {
                    $("img").remove();
                });
                $("#diagramarea").on("click", "img", function () {
                    if (confirm("Delete?")) {
                        jsPlumb.removeAllEndpoints($(this).parent().attr("id"));
                        $(this).parent().remove();

                    }
                });

                var _time = null;
                /**
                 * when click on a connection
                 * confirm and delete the connection
                 * */
                jsPlumb.bind("click", function (conn, originalEvent) {
                    clearTimeout(_time);
                    _time = setTimeout(function () {
                        if (confirm("Delete?"))
                            jsPlumb.detach(conn);
                    }, 300);
                });
                /**
                 * when connect
                 * check whether it's source node is a question
                 *  if true input the tiaojian and connect
                 *  if not, connect
                 * */
                jsPlumb.bind("connection", function (connInfo, originalEvent) {
                    $source = $(connInfo.source);
                    $target = $(connInfo.target);
                    var note_type = $source.attr('nodetype');

                    if ($source.attr('nodetype') == 'QuestionNode') {
                        var tiaojian = prompt("Please input tiaojian", "");
                        if (tiaojian == null || tiaojian == '') {
                            jsPlumb.detach(connInfo.connection);
                            console.log(connInfo);
                        }
                        connInfo.connection.setLabel(tiaojian);
                    }
                });

                //基本连接线样式
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
                var endpointHoverStyle = {
                    fillStyle: "#216477",
                    strokeStyle: "#216477"
                };

                var questionOut = function () {
                    var outPoint1;
                    outPoint1 = {
                        endpoint: ["Rectangle", {radius: 20}],  //端点的形状
                        connectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
                        connectorHoverStyle: connectorHoverStyle,
                        paintStyle: {
                            strokeStyle: "#1e8151",
                            fillStyle: "transparent",
                            radius: 2,
                            lineWidth: 10
                        },		//端点的颜色样式
                        //anchor: "AutoDefault",
                        isSource: true,	//是否可以拖动（作为连线起点）
                        connector: ["Flowchart", {stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
                        isTarget: false,	//是否可以放置（连线终点）
                        maxConnections: 1,	// 设置连接点最多可以连接几条线
                        connectorOverlays: [["Arrow", {width: 10, length: 10, location: 1}]]
                    };
                    return outPoint1;
                }
                //空心圆端点样式设置
                var hollowCircle = {

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
                    isSource: true,	//是否可以拖动（作为连线起点）
                    connector: ["Flowchart", {stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
                    isTarget: false,	//是否可以放置（连线终点）
                    maxConnections: 1,	// 设置连接点最多可以连接几条线
                    connectorOverlays: [["Arrow", {width: 10, length: 10, location: 1}]]
                };
                //实心圆样式
                var solidCircle = {
                    endpoint: ["Dot", {radius: 10}],  //端点的形状
                    paintStyle: {fillStyle: "rgb(122, 176, 44)"},	//端点的颜色样式
                    connectorStyle: {strokeStyle: "rgb(97, 183, 207)", lineWidth: 4},	  //连接线的颜色，大小样式
                    isSource: false,	//是否可以拖动（作为连线起点）
                    connector: ["Flowchart", {stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}], //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
                    isTarget: true,		//是否可以放置（连线终点）
                    //anchor: "AutoDefault",
                    maxConnections: 3,	// 设置连接点最多可以连接几条线
                    connectorOverlays: [["Arrow", {width: 10, length: 10, location: 1}]]
                };

            }
        }
    }
);
