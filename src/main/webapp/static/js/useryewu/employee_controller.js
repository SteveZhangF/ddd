'use strict';


app.controller('UserEmployeeController', ['$scope', 'EmployeeService', 'LoginService', '$location', function ($scope, EmployeeService, LoginService, $location) {
    $scope.employees = [];
    $scope.selectedAll = false;
    $scope.itemPerPage = 5;
    $scope.isEditingEmployee = false;
    // define for employee
    var Employee = function (firstName, lastName, email, jobTitle, startTime, endTime) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.startTime = startTime;
        this.endTime = endTime;
        this.selected = false;
        //gender
        //ssn
        //driver lsn
        //driver exp


    };

    for (var i = 0; i < 10; i++) {
        $scope.employees.push(new Employee("steve" + i, "zhang" + i, "zhangke@sss.ccc" + i, "developed" + i, new Date('1987-05-21'), "10.2"));
    }

    $scope.select = function () {
        $scope.selectedAll = $scope.employees.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAll = function () {
        var toggleStatus = !$scope.selectedAll;
        angular.forEach($scope.employees, function (itm) {
            itm.selected = !toggleStatus;
        });
    };

    $scope.deleteSelectedEmployees = function () {
        angular.forEach($scope.employees, function (itm) {
            if (itm.selected === true) {
                console.log("delete:" + itm.firstName);
            }
        })
    };

    $scope.editEmployee = function (employee) {
        if (employee) {
            $location.search('employeeId', employee.uuid);
        }
        $location.path('/view_employee');
    };

}]);


app.controller('UserEmployeeEditController', ['$scope', 'EmployeeService', '$location', 'FileUploader', function ($scope, EmployeeService, $location, FileUploader) {
    $scope.editedEmployee = {};
    $scope.newEmployee = true;

    $scope.menus = [{name: 'Person Detail', url: 'user/employee_edit_persondetail.html', selected: true}, {
        name: 'Job',
        selected: false,
        url: 'user/employee_edit_job.html'
    }];
    $scope.selectedMenu = $scope.menus[0];
    var uuid = $location.search().employeeId;
    if (uuid) {
        EmployeeService.getEmployee(uuid).then(function (response) {
            $scope.editedEmployee = response;
            $scope.newEmployee = false;
        }, function (err) {

        });
    }

    $scope.menuSelect = function (menu) {
        angular.forEach($scope.menus, function (itm) {
            itm.selected = itm.name === menu.name;
        });
        $scope.selectedMenu = menu;
    };
    var headImageUploader = $scope.headImageUploader = new FileUploader({
        url: '/upload',
        formData:[{type:'employeeHead'}]
    });
    headImageUploader.onAfterAddingFile = function (fileItem) {
        headImageUploader.queue.length = 0;
        headImageUploader.queue.push(fileItem);
        console.log(headImageUploader.queue[0])
    };
    headImageUploader.onSuccessItem = function (item, response, status, headers) {

    };


    /**
     *  contract uploader
     * */
    var contractUploader = $scope.contractUploader = new FileUploader({
        url: 'upload.php'
    });
    contractUploader.onAfterAddingFile = function (fileItem) {
        contractUploader.queue.length = 0;
        contractUploader.queue.push(fileItem);
    };
    contractUploader.onSuccessItem = function (item, response, status, headers) {

    }

}]);
app.directive('ngThumb', ['$window', function ($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
            console.log(item)
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
                return params.file;
            }, function () {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({width: width, height: height});
                    canvas[0].getContext('2d').drawImage(this, 0, 0,width,height);
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
}])
