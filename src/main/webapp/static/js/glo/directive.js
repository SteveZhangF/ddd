'use strict';
var app = angular.module('clientApp');
app.directive('formatDate', ['$filter', function ($filter) {
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
}]);

app.directive('pdfPreview', ['$sce', '$http', '$window', function ($sce, $http, $window) {
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
                angular.element('#object').css("width",width).css('height',height);
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
}]);


app.directive('ngThumb', ['$window', '$http', function ($window, $http) {
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
                            canvas[0].getContext('2d').drawImage(img, 0, 0,width,height);
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
                    angular.element(canvas).css("width",width);
                    angular.element(canvas).css("height",height);
                    console.log( angular.element(canvas).width());
                    var f = this.width/angular.element(canvas).width();
                    //canvas[0].getContext('2d').drawImage(this, 0, 0,this.width,this.height, 0, 0, angular.element(canvas).width(),angular.element(canvas).height());
                    canvas[0].getContext('2d').drawImage(this, 0, 0, canvas[0].width,canvas[0].height)
                }
            });
        }
    }
}]);


app.filter('customFilter', ['$filter', function ($filter) {
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
}]);
app.directive('stDateRange', ['$timeout', function ($timeout) {
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
}]);