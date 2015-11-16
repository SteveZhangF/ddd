'use strict';
(function (angular) {
    'use strict';

    angular.module('customizedDirective', [])
        .directive('treeModel', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    //tree id
                    var treeId = attrs.treeId;
                    //tree model
                    var treeModel = attrs.treeModel;
                    //node id
                    var nodeId = attrs.nodeId || 'id';

                    //node label
                    var nodeLabel = attrs.nodeLabel || 'label';

                    //children
                    var nodeChildren = attrs.nodeChildren || 'children';

                    var nodeShowProgress = attrs.nodeShowProgress || false;

                    var isLeaf = attrs.nodeIsLeaf || 'isLeaf';
                    console.log(isLeaf);

                    var progress = attrs.progress || 'progress';


                    //tree template
                    var template =
                        '<ul>' +
                        '<li data-ng-repeat="node in ' + treeModel + '">' +
                        '<i class="collapsed" data-ng-show="!node.' + isLeaf + ' && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                        '<i class="expanded" data-ng-show="!node.' + isLeaf + ' && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                        '<i class="normal" data-ng-hide="!node.' + isLeaf + '"></i> ' +
                        '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +

                        '<div data-ng-show="'+nodeShowProgress+'" class=\"progress\" style=\"margin-bottom: 0;height: 10px\">' +
                        '<div class = "progress-bar" role = "progressbar" style="width:' +
                        '{{node.' + progress + '}}'
                        + '\"></div></div >' +

                        '<div data-ng-hide="node.collapsed" data-node-is-leaf="'+isLeaf+'" data-node-show-progress="'+nodeShowProgress+'" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
                        '</li>' +
                        '</ul>';


                    //check tree id, tree model
                    if (treeId && treeModel) {

                        //root node
                        if (attrs.angularTreeview) {

                            //create tree object if not exists
                            scope[treeId] = scope[treeId] || {};

                            //if node head clicks,
                            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {

                                    //Collapse or Expand
                                    selectedNode.collapsed = !selectedNode.collapsed;
                                };

                            //if node label clicks,
                            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {

                                    //remove highlight from previous node
                                    if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                                        scope[treeId].currentNode.selected = undefined;
                                    }

                                    //set highlight to selected node
                                    selectedNode.selected = 'selected';

                                    //set currentNode
                                    scope[treeId].currentNode = selectedNode;
                                };
                        }
                        //Rendering template.
                        element.html('').append($compile(template)(scope));
                    }
                }
            };
        }])
        .directive('formatDate', ['$filter', function ($filter) {
            return {
                require: 'ngModel',
                link: function (scope, elem, attr, ngModelCtrl) {
                    ngModelCtrl.$formatters.push(function (modelValue) {
                        if (modelValue) {
                            return new Date(modelValue);
                        }
                    });

                    ngModelCtrl.$parsers.push(function (value) {
                        if (value) {
                            return $filter('date')(value, 'yyyy-MM-dd');
                        }
                    });
                }
            };
        }])
        .directive('pdfPreview', ['$sce', '$http', '$window', function ($sce, $http, $window) {
            return {
                restrict: 'A',
                template: '<object data="" id="object" type="application/pdf"></object> <span us-spinner="{radius:30, width:8, length: 16}" spinner-key="pdf-spinner"></span>',
                link: function (scope, element, attributes) {
                    scope.$watch(function () {
                        var params = scope.$eval(attributes.pdfPreview);
                        return params.pdfCount;
                    }, function () {
                        var params = scope.$eval(attributes.pdfPreview);
                        var width = params.width;
                        var height = params.height;
                        angular.element('#object').css("width", width).css('height', height);
                        if (params.preview) {
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                console.log(event);
                                angular.element('#object').attr("data", event.target.result);
                            };
                            reader.readAsDataURL(params.file);

                        } else {
                            if (params.file === undefined || params.file === null)return;
                            var encodeFile = encodeURIComponent(params.file);
                            var url = "/upload/?path=" + encodeFile;
                            $http.get(url, {responseType: 'arraybuffer'})
                                .success(function (response) {
                                    var file = new Blob([response], {type: 'application/pdf'});
                                    var urlCreator = $window.URL || $window.webkitURL;
                                    var pdfUrl = urlCreator.createObjectURL(file);
                                    var content = $sce.trustAsResourceUrl(pdfUrl);
                                    angular.element('#object').attr("data", content);
                                });
                        }
                    });
                }
            }
        }])
        .directive('ngThumb', ['$window', '$http', function ($window, $http) {
            var helper = {
                support: !!($window.FileReader && $window.CanvasRenderingContext2D),
                isFile: function (item) {
                    return angular.isObject(item) && item instanceof $window.File;
                },
                isImage: function (file) {
                    var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            };

            return {
                restrict: 'A',
                template: '<canvas/>',
                link: function (scope, element, attributes) {

                    scope.$watch(function () {
                        var params = scope.$eval(attributes.ngThumb);
                        return params.headImageCount;
                    }, function () {

                        if (!helper.support) return;

                        var params = scope.$eval(attributes.ngThumb);
                        var canvas = element.find('canvas');
                        var reader = new FileReader();
                        if (params.preview) {
                            if (!helper.isFile(params.file)) return;
                            if (!helper.isImage(params.file)) return;
                            console.log("still here");
                            reader.onload = onLoadFile;
                            reader.readAsDataURL(params.file);

                        } else {
                            if (params.file === undefined || params.file === null)return;
                            var encodeFile = encodeURIComponent(params.file);
                            var url = "/upload/?path=" + encodeFile;
                            delete $http.defaults.headers.common['X-Requested-With'];
                            $http.get(url, {responseType: "arraybuffer"}).
                                success(function (data) {
                                    var img = new Image();
                                    img.onload = onLoadImage;
                                    var arrayBufferView = new Uint8Array(data);
                                    var blob = new Blob([arrayBufferView], {type: "image/jpeg"});
                                    var urlCreator = $window.URL || $window.webkitURL;
                                    var imageUrl = urlCreator.createObjectURL(blob);
                                    img.src = imageUrl;
                                    var width = params.width;
                                    var height = params.height;
                                    canvas.attr({width: width, height: height});
                                    canvas[0].getContext('2d').drawImage(img, 0, 0, width, height);
                                }).
                                error(function (data, status) {
                                    var info = "Request failed with status: " + status;
                                    console.log(info);
                                });
                            $http.get(url).then(function (response) {

                            }, function (errResponse) {

                            });
                        }


                        function onLoadFile(event) {
                            var img = new Image();
                            img.onload = onLoadImage;
                            img.src = event.target.result;
                        }

                        function onLoadImage() {
                            var width = params.width || this.width / this.height * params.height;
                            var height = params.height || this.height / this.width * params.width;
                            //canvas.attr({width: width, height: height});
                            //canvas.style.width='100%';
                            //canvas.style.height='100%';
                            angular.element(canvas).css("width", width);
                            angular.element(canvas).css("height", height);
                            console.log(angular.element(canvas).width());
                            var f = this.width / angular.element(canvas).width();
                            //canvas[0].getContext('2d').drawImage(this, 0, 0,this.width,this.height, 0, 0, angular.element(canvas).width(),angular.element(canvas).height());
                            canvas[0].getContext('2d').drawImage(this, 0, 0, canvas[0].width, canvas[0].height)
                        }
                    });
                }
            }
        }])
        .directive('stDateRange', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    before: '=',
                    after: '='
                },
                templateUrl: 'view/stDateRange.html',

                link: function (scope, element, attr, table) {

                    var inputs = element.find('input');
                    var inputBefore = angular.element(inputs[0]);
                    var inputAfter = angular.element(inputs[1]);
                    var predicateName = attr.predicate;


                    [inputBefore, inputAfter].forEach(function (input) {

                        input.bind('blur', function () {


                            var query = {};

                            if (!scope.isBeforeOpen && !scope.isAfterOpen) {

                                if (scope.before) {
                                    query.before = scope.before;
                                }

                                if (scope.after) {
                                    query.after = scope.after;
                                }

                                scope.$apply(function () {
                                    table.search(query, predicateName);
                                })
                            }
                        });
                    });

                    function open(before) {
                        return function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            if (before) {
                                scope.isBeforeOpen = true;
                            } else {
                                scope.isAfterOpen = true;
                            }
                        }
                    }

                    scope.openBefore = open(true);
                    scope.openAfter = open();
                }
            }
        }])
        .filter('customFilter', ['$filter', function ($filter) {
            var filterFilter = $filter('filter');
            var standardComparator = function standardComparator(obj, text) {
                text = ('' + text).toLowerCase();
                return ('' + obj).toLowerCase().indexOf(text) > -1;
            };

            return function customFilter(array, expression) {
                function customComparator(actual, expected) {

                    var isBeforeActivated = expected.before;
                    var isAfterActivated = expected.after;
                    var isLower = expected.lower;
                    var isHigher = expected.higher;
                    var higherLimit;
                    var lowerLimit;
                    var itemDate;
                    var queryDate;


                    if (angular.isObject(expected)) {

                        //date range
                        if (expected.before || expected.after) {
                            try {
                                if (isBeforeActivated) {
                                    higherLimit = expected.before;

                                    itemDate = new Date(actual);
                                    queryDate = new Date(higherLimit);

                                    if (itemDate > queryDate) {
                                        return false;
                                    }
                                }

                                if (isAfterActivated) {
                                    lowerLimit = expected.after;


                                    itemDate = new Date(actual);
                                    queryDate = new Date(lowerLimit);

                                    if (itemDate < queryDate) {
                                        return false;
                                    }
                                }

                                return true;
                            } catch (e) {
                                return false;
                            }

                        } else if (isLower || isHigher) {
                            //number range
                            if (isLower) {
                                higherLimit = expected.lower;

                                if (actual > higherLimit) {
                                    return false;
                                }
                            }

                            if (isHigher) {
                                lowerLimit = expected.higher;
                                if (actual < lowerLimit) {
                                    return false;
                                }
                            }

                            return true;
                        }
                        //etc

                        return true;

                    }
                    return standardComparator(actual, expected);
                }

                var output = filterFilter(array, expression, customComparator);
                return output;
            };
        }])
        .directive('checklistModel', ['$parse', '$compile', function ($parse, $compile) {
            // contains
            function contains(arr, item, comparator) {
                if (angular.isArray(arr)) {
                    for (var i = arr.length; i--;) {
                        if (comparator(arr[i], item)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            // add
            function add(arr, item, comparator) {
                arr = angular.isArray(arr) ? arr : [];
                if (!contains(arr, item, comparator)) {
                    arr.push(item);
                }
                return arr;
            }

            // remove
            function remove(arr, item, comparator) {
                if (angular.isArray(arr)) {
                    for (var i = arr.length; i--;) {
                        if (comparator(arr[i], item)) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }
                return arr;
            }

            // http://stackoverflow.com/a/19228302/1458162
            function postLinkFn(scope, elem, attrs) {
                // exclude recursion, but still keep the model
                var checklistModel = attrs.checklistModel;
                attrs.$set("checklistModel", null);
                // compile with `ng-model` pointing to `checked`
                $compile(elem)(scope);
                attrs.$set("checklistModel", checklistModel);

                // getter / setter for original model
                var getter = $parse(checklistModel);
                var setter = getter.assign;
                var checklistChange = $parse(attrs.checklistChange);

                // value added to list
                var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


                var comparator = angular.equals;

                if (attrs.hasOwnProperty('checklistComparator')) {
                    if (attrs.checklistComparator[0] == '.') {
                        var comparatorExpression = attrs.checklistComparator.substring(1);
                        comparator = function (a, b) {
                            return a[comparatorExpression] === b[comparatorExpression];
                        }

                    } else {
                        comparator = $parse(attrs.checklistComparator)(scope.$parent);
                    }
                }

                // watch UI checked change
                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    var current = getter(scope.$parent);
                    if (angular.isFunction(setter)) {
                        if (newValue === true) {
                            setter(scope.$parent, add(current, value, comparator));
                        } else {
                            setter(scope.$parent, remove(current, value, comparator));
                        }
                    }

                    if (checklistChange) {
                        checklistChange(scope);
                    }
                });

                // declare one function to be used for both $watch functions
                function setChecked(newArr, oldArr) {
                    scope[attrs.ngModel] = contains(newArr, value, comparator);
                }

                // watch original model change
                // use the faster $watchCollection method if it's available
                if (angular.isFunction(scope.$parent.$watchCollection)) {
                    scope.$parent.$watchCollection(checklistModel, setChecked);
                } else {
                    scope.$parent.$watch(checklistModel, setChecked, true);
                }
            }

            return {
                restrict: 'A',
                priority: 1000,
                terminal: true,
                scope: true,
                compile: function (tElement, tAttrs) {
                    if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox')
                        && (tElement[0].tagName !== 'MD-CHECKBOX')
                        && (!tAttrs.btnCheckbox)) {
                        throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
                    }

                    if (!tAttrs.checklistValue && !tAttrs.value) {
                        throw 'You should provide `value` or `checklist-value`.';
                    }

                    // by default ngModel is 'checked', so we set it if not specified
                    if (!tAttrs.ngModel) {
                        // local scope var storing individual checkbox model
                        tAttrs.$set("ngModel", "checked");
                    }

                    return postLinkFn;
                }
            };
        }])

})(angular);

