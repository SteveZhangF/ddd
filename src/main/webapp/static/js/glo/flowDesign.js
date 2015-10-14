angular.module('dashboardApp')
    .controller('flowToolBarController', ['$scope', function ($scope) {
        $scope.dataProvider = {};
        var dp = [];
        for (var i = 0; i < 1000; i++) {
            dp.push({
                index: i,
                label: "label " + i,
                value: "value " + i,
                id: i,
                type: "form",
                name: "form" + i
            });
        }

        this.dataProvider = dp;
        this.selectedOption = null;

        $scope.selectedNode = {};

        /**
         * {id:formid, name: formname, type: node type}
         * */
        this.onSelect = function (option) {
            $scope.selectedNode.id = "formnode_" + option.id;
            $scope.selectedNode.label = option.label;
            $scope.selectedNode.data = JSON.stringify({id: option.id, type: option.type, name: option.name});
            $scope.selectedNode.nodetype = "form_node";
            //
            //
            //
            //option.nodetype ='form_node';
            //option.id='formnode_'+option.id;
            //option.data=JSON.stringify(option);
            //$node = $("<div class='node' nodetype='form_node'></div>");
            //$node.id = "formnode_" + data.id;
            //$node.text(data.label);
            //$node.attr("node_data", JSON.stringify(data));
            //console.log($node);
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

    }])

    .directive('flowDesign', function () {
        return {
            restrict: 'EA', //E = element（元素）, A = attribute（属性）, C = class, M = comment
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                //@ 读取属性值， = 提供双向绑定， & 以函数一起工作
                formUrl: '@',
                jsonProvider: '@',
                options: '='
            },
            templateUrl: 'flowd/dom.html',
            controller: 'flowToolBarController', //Embed a custom controller in the directive 在指令中嵌入一个自定义控制器
            link: function (scope, element, attrs) {
                init = function () {
                    console.log(scope.jsonProvider);
                    var jsonObject = JSON.parse(scope.jsonProvider);
                    $.each(jsonObject, function (i, data) {
                        console.log(data);
                        $node = $("<div class='node' nodetype='form_node'></div>");
                        $node.id = "formnode_" + data.id;
                        $node.text(data.label);
                        $node.attr("node_data", JSON.stringify(data));
                        console.log($node);
                        $("#forms").append($node);

                    })
                };
                init();
                scope.options = {}
                scope.options.selected_question = {
                    question_name: '',
                    branch_count: '',
                    branches: [{
                        branch_name: '',
                        branch_value: ''
                    }], isnew: true
                };
                scope.save = function save() {
                    var connects = [];
                    $.each(jsPlumb.getAllConnections(), function (idx, connection) {
                        var cont = connection.getLabel();
                        connects.push({
                            ConnectionId: connection.id,
                            PageSourceId: connection.sourceId,
                            PageTargetId: connection.targetId,
                            SourceText: connection.source.innerText,
                            TargetText: connection.target.innerText,
                            SourceAnchor: connection.endpoints[0].anchor.type,
                            TargetAnchor: connection.endpoints[1].anchor.type,
                            ConnectText: $(cont).html()
                        });
                    });

                    //<div nodetype="state_flow"
                    // class="node jsplumb-endpoint-anchor jsplumb-draggable ui-draggable ui-draggable-handle"
                    // id="state_flow1"
                    // node_data="{id:1,label:dddd}"
                    // style="left: 174px; top: 269px;">dddd</div>
                    var blocks = [];
                    $("#diagramarea .node").each(function (idx, elem) {
                        var $elem = $(elem);
                        blocks.push({
                            BlockId: $elem.attr('id'),
                            BlockContent: $elem.html(),
                            BlockX: parseInt($elem.css("left"), 10),
                            BlockY: parseInt($elem.css("top"), 10),

                            Node_Type: $elem.attr('nodetype'),
                            Node_Data: $elem.attr('node_data')
                        });
                    });

                    var fina = {connections:connects,nodes:blocks};

                    var serliza = JSON.stringify(fina);
                    console.log(serliza);
                    $.ajax({
                        type: "post",
                        url: "ajax.aspx",
                        data: {id: serliza},
                        success: function (filePath) {
                            window.open("show-flowChart.aspx?path=" + filePath);
                        }
                    });
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


                var i = 0;
                var currentUI = null;

                scope.questionDialogok = function () {
                    console.log('ok');
                    if (scope.options.selected_question.isnew) {
                        i++;
                        id = "state_decide" + i;
                        $("#diagramarea").append("<div nodetype=\'state_decide\' class='node' id='" + id + "'>" + $(currentUI.helper).html() + "</div>");
                        $("#" + id).css("left", left).css("top", top);
                        scope.options.selected_question.id = id;
                        scope.options.selected_question.isnew = false;
                        $("#" + id).attr("node_data", JSON.stringify(scope.options.selected_question));
                        var branches = scope.options.selected_question.branches;
                        jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, solidCircle);//入
                        $.each(branches, function (iii, b) {
                            jsPlumb.addEndpoint(id, {anchors: "Assign"}, questionOut());//出
                        });

                        jsPlumb.draggable(id);
                        $("#" + id).draggable({containment: "parent"});

                        questionDoubleClick('#' + id);
                    } else {
                        id = scope.options.selected_question.id;
                        var branches2 = scope.options.selected_question.branches;
                        jsPlumb.removeAllEndpoints(id);

                        jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, solidCircle);//入
                        $.each(branches2, function (iii, b) {
                            jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, questionOut());//出
                        });

                        $('#' + id).attr("node_data", JSON.stringify(scope.options.selected_question));
                    }
                    questionCancel();
                }
                function questionCancel() {
                    scope.options.selected_question = {
                        id: '',
                        question_name: '',
                        branch_count: '',
                        branches: [{
                            branch_name: '',
                            branch_value: ''
                        }], isnew: true
                    };
                    console.log('88');
                    $questionDialog = $('#questionDialog');
                    $questionDialog.css('display', '');
                }

                function questionDoubleClick(id) {
                    console.log(id);
                    $(id).dblclick(function () {
                        scope.options.selected_question = JSON.parse($(id).attr('node_data'));
                        showQuestionDialog($(id).css('left'), $(id).css('top'));

                    });
                }

                function showQuestionDialog(left, top) {
                    console.log(left);
                    $questionDialog = $('#questionDialog');
                    $questionDialog.css('left', left).css('top', top);
                    $questionDialog.show();
                }

                $("#controllernodes").children().draggable({
                    helper: "clone",
                    scope: "ss",
                });
                $("#previewNode").draggable({
                    helper: "clone",
                    scope: "ss"
                });
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
                                var id = "state_start" + i;
                                $(this).append('<div nodetype=\'state_start\' class="node" style="border-radius: 25em"  id="' + id + '" >' + $(ui.helper).html() + '</div>');
                                $("#" + id).css("left", left).css("top", top);
                                jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
                                jsPlumb.draggable(id);
                                $("#" + id).draggable({containment: "parent"});
                                //doubleclick("#" + id);
                                break;
                            //question
                            case "node3":

                                showQuestionDialog(left, top);


                                //$(this).append("<div nodetype=\'state_decide\' class='node' id='" + id + "'>" + $(ui.helper).html() + "</div>");
                                //$("#" + id).css("left", left).css("top", top);
                                //jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, solidCircle);
                                //jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
                                //jsPlumb.draggable(id);
                                //$("#" + id).draggable({containment: "parent"});
                                //questionDoubleClick("#" + id);
                                break;
                            //end
                            case "node4":
                                i++;
                                id = "state_end" + i;
                                $(this).append('<div nodetype=\'state-end\' class="node" style="border-radius: 25em"  id="' + id + '" >' + $(ui.helper).html() + '</div>');
                                $("#" + id).css("left", left).css("top", top);
                                jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, hollowCircle);
                                jsPlumb.addEndpoint(id, {anchors: "RightMiddle"}, hollowCircle);
                                jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
                                jsPlumb.addEndpoint(id, {anchors: "LeftMiddle"}, hollowCircle);
                                jsPlumb.draggable(id);
                                $("#" + id).draggable({containment: "parent"});
                                doubleclick("#" + id);
                                break;
                            default :
                                i++;
                                id = "state_flow" + i;
                                $node_dropped = $("<div nodetype=\'state_flow\' class='node' id='" + id + "'>" + $(ui.helper).html() + "</div>");
                                console.log($(ui.helper).attr('node_data'));
                                $node_dropped.attr("node_data", $(ui.helper).attr('node_data'));
                                $(this).append($node_dropped);
                                $("#" + id).css("left", left).css("top", top);
                                jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, solidCircle);
                                jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
                                jsPlumb.draggable(id);
                                $("#" + id).draggable({containment: "parent"});
                                doubleclick("#" + id);
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
                        $("img").css("left", 130).css("top", 0);
                    } else {
                        $("img").css("left", 130).css("top", -10);
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
                //jsPlumb.bind("connection", function (connInfo, originalEvent) {
                //	connInfo.connection.setLabel("ss");
                //});
                var _time = null;
                jsPlumb.bind("dblclick", function (conn, originalEvent) {
                    clearTimeout(_time);
                    var str = conn.getLabel();
                    if (str == null) {
                        conn.setLabel("<input type='text' value=' ' />");
                    } else {
                        conn.setLabel("<input type='text' value='" + $(str).text() + "' />");
                    }
                    $("input[type='text']").mouseleave(function () {
                        if ($(this).val().trim() == "") {
                            conn.setLabel("");
                        } else {
                            conn.setLabel("<span style='display:block;padding:10px;opacity: 0.5;height:auto;background-color:white;border:1px solid #346789;text-align:center;font-size:12px;color:black;border-radius:0.5em;'>" + $(this).val() + "</span>");
                        }
                    });
                });

                //jsPlumb.bind("click", function (conn, originalEvent) {
                //	clearTimeout(_time);
                //	_time = setTimeout(function () {
                //		if (confirm("确定删除吗？	"))
                //			jsPlumb.detach(conn);
                //	}, 300);

                //});
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
                    var outPoint = {
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
                    return outPoint;
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
)
;


//angular.module('flowDesign', []).
//    directive('flowDesign', ['$scope',function ($scope) {
//        "use strict"; //Scope strict mode to only this directive
//
//        return {
//            restrict: 'AE',
//            require: 'ngModel',
//            scope: scope,
//            link: function (scope, element, attrs, ngModel) {
//
//                var left = $("<div>dddddwqweqwewqwe</div>>");
//                $(element).append(left);
//            //
//            //    function save() {
//            //        var connects = [];
//            //        $.each(jsPlumb.getAllConnections(), function (idx, connection) {
//            //            var cont = connection.getLabel();
//            //            connects.push({
//            //                ConnectionId: connection.id,
//            //                PageSourceId: connection.sourceId,
//            //                PageTargetId: connection.targetId,
//            //                SourceText: connection.source.innerText,
//            //                TargetText: connection.target.innerText,
//            //                SourceAnchor: connection.endpoints[0].anchor.type,
//            //                TargetAnchor: connection.endpoints[1].anchor.type,
//            //                ConnectText: $(cont).html()
//            //            });
//            //        });
//            //        var blocks = [];
//            //        $("#right .node").each(function (idx, elem) {
//            //            var $elem = $(elem);
//            //            blocks.push({
//            //                BlockId: $elem.attr('id'),
//            //                BlockContent: $elem.html(),
//            //                BlockX: parseInt($elem.css("left"), 10),
//            //                BlockY: parseInt($elem.css("top"), 10)
//            //            });
//            //        });
//            //
//            //        var serliza = JSON.stringify(connects) + "&" + JSON.stringify(blocks);
//            //        console.log(serliza);
//            //        $.ajax({
//            //            type: "post",
//            //            url: "ajax.aspx",
//            //            data: {id: serliza},
//            //            success: function (filePath) {
//            //                window.open("show-flowChart.aspx?path=" + filePath);
//            //            }
//            //        });
//            //    }
//            //
//            //    function doubleclick(id) {
//            //        $(id).dblclick(function () {
//            //            var text = $(this).text();
//            //            $(this).html("");
//            //            $(this).append("<input type='text' value='" + text + "' />");
//            //            $(this).mouseleave(function () {
//            //                $(this).html($("input[type='text']").val());
//            //            });
//            //        });
//            //    }
//            //
//            //    var i = 0;
//            //    $("#left").children().draggable({
//            //        helper: "clone",
//            //        scope: "ss",
//            //    });
//            //    $("#right").droppable({
//            //        scope: "ss",
//            //        drop: function (event, ui) {
//            //            var left = parseInt(ui.offset.left - $(this).offset().left);
//            //            var top = parseInt(ui.offset.top - $(this).offset().top);
//            //            var name = ui.draggable[0].id;
//            //            switch (name) {
//            //                case "node1":
//            //                    i++;
//            //                    var id = "state_start" + i;
//            //                    $(this).append('<div class="node" style="border-radius: 25em"  id="' + id + '" >' + $(ui.helper).html() + '</div>');
//            //                    $("#" + id).css("left", left).css("top", top);
//            //                    jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "RightMiddle"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "LeftMiddle"}, hollowCircle);
//            //                    jsPlumb.draggable(id);
//            //                    $("#" + id).draggable({containment: "parent"});
//            //                    doubleclick("#" + id);
//            //                    break;
//            //                case "node2":
//            //                    i++;
//            //                    id = "state_flow" + i;
//            //                    $(this).append("<div class='node' id='" + id + "'>" + $(ui.helper).html() + "</div>");
//            //                    $("#" + id).css("left", left).css("top", top);
//            //                    jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "RightMiddle"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "LeftMiddle"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, hollowCircle);
//            //                    jsPlumb.draggable(id);
//            //                    $("#" + id).draggable({containment: "parent"});
//            //                    doubleclick("#" + id);
//            //                    break;
//            //                case "node3":
//            //                    i++;
//            //                    id = "state_decide" + i;
//            //                    $(this).append("<div class='node' id='" + id + "'>" + $(ui.helper).html() + "</div>");
//            //                    $("#" + id).css("left", left).css("top", top);
//            //                    jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "RightMiddle"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "LeftMiddle"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, hollowCircle);
//            //                    jsPlumb.draggable(id);
//            //                    $("#" + id).draggable({containment: "parent"});
//            //                    doubleclick("#" + id);
//            //                    break;
//            //                case "node4":
//            //                    i++;
//            //                    id = "state_end" + i;
//            //                    $(this).append('<div class="node" style="border-radius: 25em"  id="' + id + '" >' + $(ui.helper).html() + '</div>');
//            //                    $("#" + id).css("left", left).css("top", top);
//            //                    jsPlumb.addEndpoint(id, {anchors: "TopCenter"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "RightMiddle"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "BottomCenter"}, hollowCircle);
//            //                    jsPlumb.addEndpoint(id, {anchors: "LeftMiddle"}, hollowCircle);
//            //                    jsPlumb.draggable(id);
//            //                    $("#" + id).draggable({containment: "parent"});
//            //                    doubleclick("#" + id);
//            //                    break;
//            //            }
//            //        }
//            //    });
//            //    $("#right").on("mouseenter", ".node", function () {
//            //        $(this).append('<img src="jsPlumbDemo/js/images/close2.png"  style="position: absolute;" />');
//            //        if ($(this).text() == "开始" || $(this).text() == "结束") {
//            //            $("img").css("left", 158).css("top", 0);
//            //        } else {
//            //            $("img").css("left", 158).css("top", -10);
//            //        }
//            //    });
//            //    $("#right").on("mouseleave", ".node", function () {
//            //        $("img").remove();
//            //    });
//            //    $("#right").on("click", "img", function () {
//            //        if (confirm("确定要删除吗?")) {
//            //            jsPlumb.removeAllEndpoints($(this).parent().attr("id"));
//            //            $(this).parent().remove();
//            //
//            //        }
//            //    });
//            //    //jsPlumb.bind("connection", function (connInfo, originalEvent) {
//            //    //	connInfo.connection.setLabel("ss");
//            //    //});
//            //    var _time = null;
//            //    jsPlumb.bind("dblclick", function (conn, originalEvent) {
//            //        clearTimeout(_time);
//            //        var str = conn.getLabel();
//            //        if (str == null) {
//            //            conn.setLabel("<input type='text' value=' ' />");
//            //        } else {
//            //            conn.setLabel("<input type='text' value='" + $(str).text() + "' />");
//            //        }
//            //        $("input[type='text']").mouseleave(function () {
//            //            if ($(this).val().trim() == "") {
//            //                conn.setLabel("");
//            //            } else {
//            //                conn.setLabel("<span style='display:block;padding:10px;opacity: 0.5;height:auto;background-color:white;border:1px solid #346789;text-align:center;font-size:12px;color:black;border-radius:0.5em;'>" + $(this).val() + "</span>");
//            //            }
//            //        });
//            //    });
//            //
//            //    //jsPlumb.bind("click", function (conn, originalEvent) {
//            //    //	clearTimeout(_time);
//            //    //	_time = setTimeout(function () {
//            //    //		if (confirm("确定删除吗？	"))
//            //    //			jsPlumb.detach(conn);
//            //    //	}, 300);
//            //
//            //    //});
//            //    //基本连接线样式
//            //    var connectorPaintStyle = {
//            //        lineWidth: 4,
//            //        strokeStyle: "#61B7CF",
//            //        joinstyle: "round",
//            //        outlineColor: "white",
//            //        outlineWidth: 2
//            //    };
//            //    // 鼠标悬浮在连接线上的样式
//            //    var connectorHoverStyle = {
//            //        lineWidth: 4,
//            //        strokeStyle: "#216477",
//            //        outlineWidth: 2,
//            //        outlineColor: "white"
//            //    };
//            //    var endpointHoverStyle = {
//            //        fillStyle: "#216477",
//            //        strokeStyle: "#216477"
//            //    };
//            //    //空心圆端点样式设置
//            //    var hollowCircle = {
//            //        endpoint: ["Dot", {radius: 20}],  //端点的形状
//            //        connectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
//            //        connectorHoverStyle: connectorHoverStyle,
//            //        paintStyle: {
//            //            strokeStyle: "#1e8151",
//            //            fillStyle: "transparent",
//            //            radius: 2,
//            //            lineWidth: 10
//            //        },		//端点的颜色样式
//            //        //anchor: "AutoDefault",
//            //        isSource: true,	//是否可以拖动（作为连线起点）
//            //        connector: ["Flowchart", {stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
//            //        isTarget: true,	//是否可以放置（连线终点）
//            //        maxConnections: -1,	// 设置连接点最多可以连接几条线
//            //        connectorOverlays: [["Arrow", {width: 10, length: 10, location: 1}]]
//            //    };
//            //    //实心圆样式
//            //    var solidCircle = {
//            //        endpoint: ["Dot", {radius: 20}],  //端点的形状
//            //        paintStyle: {fillStyle: "rgb(122, 176, 44)"},	//端点的颜色样式
//            //        connectorStyle: {strokeStyle: "rgb(97, 183, 207)", lineWidth: 4},	  //连接线的颜色，大小样式
//            //        isSource: true,	//是否可以拖动（作为连线起点）
//            //        connector: ["Flowchart", {stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}], //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
//            //        isTarget: true,		//是否可以放置（连线终点）
//            //        //anchor: "AutoDefault",
//            //        maxConnections: 3,	// 设置连接点最多可以连接几条线
//            //        connectorOverlays: [["Arrow", {width: 10, length: 10, location: 1}]]
//            //    };
//            //
//            }
//        };
//    }]);
///**
// * Created by steve on 10/11/15.
// */
