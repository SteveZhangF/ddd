var app = angular.module('dashboardApp');


app.controller('FolderCustomizedElementController', ['$scope', '$timeout', 'FolderService', 'FolderCustomizedElementService',

    function ($scope, $timeout, FolderService, FolderCustomizedElementService) {
        $scope.fieldTypes = ["String", "Number", "Date"];
        $scope.addField = function (element, field) {
            if (!element.fields) {
                element.fields = []
            }
            element.fields.push({name: field.name, type: field.type});
            field.name = '';
            field.type = '';
        };
        $scope.removeField = function (element, i) {
            console.log('remove field' + i + ' form ');
            console.log(element);
            if (element.fields && element.fields.length > i) {
                element.fields.splice(i, 1);
            }
        };


        $scope.loadCustomizedElementsInFolder = function () {
            FolderCustomizedElementService.listCustomizedElementByFolderId($scope.thisFolder.id)
                .then(
                function (data) {
                    $scope.customizedElementList = data;
                },
                function (err) {
                    //test
                    $scope.customizedElementList = [{
                        "id": "40288083512f034b01512f04d6140002",
                        "description": null,
                        "createTime": 1448192825000,
                        "updateTime": 1448192825000,
                        "name": "eye wash station",
                        "level": 2,
                        "leaf": true,
                        "parent_id": "40288085511cbdaf01511cc05f240000",
                        "data_id": "40288083512f034b01512f04d5fb0000",
                        "dataType": "CustomizedElement",
                        "deleted": false
                    }, {
                        "id": "40288083512f034b01512f0640010005",
                        "description": null,
                        "createTime": 1448192918000,
                        "updateTime": 1448192918000,
                        "name": "dddd",
                        "level": 2,
                        "leaf": true,
                        "parent_id": "40288085511cbdaf01511cc05f240000",
                        "data_id": "40288083512f034b01512f063ff90003",
                        "dataType": "CustomizedElement",
                        "deleted": false
                    }];
                }
            );
        };

        $timeout(
            function () {
                $scope.loadCustomizedElementsInFolder();

            }
        );


        $scope.selectCustomizedElement = function () {
            $scope.thisFolder.selectedAllCustomizedElements = $scope.customizedElementList.every(function (itm) {
                return itm.selected;
            })
        };

        $scope.selectAllCustomizedElements = function () {
            var toggleStatus = !$scope.thisFolder.selectedAllCustomizedElements;
            angular.forEach($scope.customizedElementList, function (itm) {
                itm.selected = !toggleStatus;
            });
            console.log();
        };


        $scope.editCustomizedElement = function (folderNode) {
            folderNode.editing = true;
            FolderCustomizedElementService.getOneCustomizedElement(folderNode.data_id)
                .then(
                function (data) {
                    folderNode.customizedElement = data;
                },
                function (err) {

                }
            );

        };

        $scope.saveElement = function (element) {
            FolderCustomizedElementService.saveCustomizedElementToFolder($scope.thisFolder.id, element)
                .then(
                function (data) {
                    console.log('save element to folder' + $scope.thisFolder.id + ' success');
                    $scope.customizedElementList.push(data);
                    element.editing = false;
                },
                function (err) {
                    console.log('save element to folder' + $scope.thisFolder.id + ' fail');
                }
            );
        };

        $scope.updateElement = function (folderNode) {
            FolderCustomizedElementService.updateCustomizedElementInFolder($scope.thisFolder.id, folderNode)
                .then(
                function (data) {
                    folderNode.name = data.name;
                    folderNode.description = data.description;
                    folderNode.id = data.id;
                    folderNode.createTime = data.createTime;
                    folderNode.updateTime = data.updateTime;
                    folderNode.editing = false;
                    console.log('update element to folder' + $scope.thisFolder.id + ' success');
                },
                function (err) {
                    console.log('update element to folder' + $scope.thisFolder.id + ' fail');
                }
            );
        };

        $scope.deleteSelectedCustomizedElement = function () {
            var r = confirm("Do you want to delete the selected item?");
            if (r == true) {
                var selected = [];
                for (var i = 0; i < $scope.customizedElementList.length; i++) {
                    if ($scope.customizedElementList[i].selected) {
                        selected.push($scope.customizedElementList[i].id);
                    }
                }
                if (selected.length <= 0) {
                    return;
                }

                FolderCustomizedElementService.deleteCustomizedElementInFolder($scope.thisFolder.id, selected).then(
                    function (data) {
                        $scope.customizedElementList = data;
                        $scope.thisFolder.selectedAllCustomizedElements = false;
                    },
                    function (err) {

                    }
                );
            }
        }


    }]);
app.factory('FolderCustomizedElementService', ['$http', '$q', function ($http, $q) {
    return {

        deleteCustomizedElementInFolder: function (folderId, ids) {
            return $http.post('/folder/' + folderId + '/customizedElement/delete/', ids)
                .then(function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        updateCustomizedElementInFolder: function (folderId, folderNode) {
            return $http.put('/folder/' + folderId + '/customizedElement/' + folderNode.id, folderNode.customizedElement)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        // list all the customized elements under folder which id is folderId
        listCustomizedElementByFolderId: function (folderId) {
            return $http.get('/folder/' + folderId + '/customizedElement/').then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        saveCustomizedElementToFolder: function (folderId, element) {
            return $http.post('/folder/' + folderId + '/customizedElement/', element)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        saveCustomizedElement: function (element) {
            return $http.post('/customizedElement/', element)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        updateCustomizedElement: function (id, element) {
            return $http.put('/customizedElement/' + id, element)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        getOneCustomizedElement: function (id) {
            return $http.get('/customizedElement/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        }

    }


}]);
