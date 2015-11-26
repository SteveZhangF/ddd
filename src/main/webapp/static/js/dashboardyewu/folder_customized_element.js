var app = angular.module('dashboardApp');


app.controller('FolderCustomizedElementController', ['$scope', '$timeout', 'FolderService', 'FolderCustomizedElementService', 'MessageService',

    function ($scope, $timeout, FolderService, FolderCustomizedElementService, MessageService) {
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
                    var list = MessageService.handleMsg(data);
                    if (list) {
                        $scope.customizedElementList = list;
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
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
        };


        $scope.editCustomizedElement = function (folderNode) {
            folderNode.name_ = folderNode.name;
            folderNode.description_ = folderNode.description;
            folderNode.editing = true;
        };

        $scope.saveElement = function (element) {
            $scope.createCustomizedElementPromise = FolderCustomizedElementService.saveCustomizedElementToFolder($scope.thisFolder.id, element)
                .then(
                function (data) {
                    var element = MessageService.handleMsg(data);
                    if (element) {
                        $scope.loadCustomizedElementsInFolder();
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        };

        $scope.updateElement = function (folderNode) {
            folderNode.name = folderNode.name_;
            folderNode.description = folderNode.description_;

            $scope.updateCustomizedElementPromise = FolderCustomizedElementService.updateCustomizedElementInFolder($scope.thisFolder.id, folderNode)
                .then(
                function (data) {
                    var newE = MessageService.handleMsg(data);
                    if(newE){
                        angular.copy(newE,folderNode);
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
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

                $scope.customizedElementTablePromise = FolderCustomizedElementService.deleteCustomizedElementInFolder($scope.thisFolder.id, selected).then(
                    function (data) {
                        var list = MessageService.handleMsg(data);
                        if(list){
                            $scope.customizedElementList = list.children;
                        }
                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                    }
                );
            }
        }


    }]);
app.factory('FolderCustomizedElementService', ['$http', '$q', function ($http, $q) {
    return {

        deleteCustomizedElementInFolder: function (folderId, ids) {

            // /admin/files/delete/{parentId}/{type}
            return $http.post('/admin/files/delete/' + folderId + '/CUSTOMIZED_ELEMENT', ids)
                .then(function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        updateCustomizedElementInFolder: function (folderId, folderNode) {
            return $http.put('/admin/files/folder/customizedElement/' + folderId, folderNode)
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
            ///admin/files/folder/getCustomizedElement/{folderId}
            return $http.get('/admin/files/folder/getCustomizedElement/' + folderId).then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        saveCustomizedElementToFolder: function (folderId, element) {
            // /admin/files/folder/customizedElement/{parentId}
            return $http.post('/admin/files/folder/customizedElement/' + folderId, element)
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
