'use strict';

app.controller('UserCustomizedElementController', ['$scope', '$filter', '$timeout', 'UserCustomizedElementRecordService', 'LoginService', 'MessageService', function ($scope, $filter, $timeout, UserCustomizedElementRecordService, LoginService, MessageService) {
    $scope.customizedElementsMenus = [];
    var userId = LoginService.getUserInfo().userId;
    //    var addNew =
    //    {
    //        "customizedElement": $scope.selectedcustomizedElementMenu,
    //        "values": [],
    //        "userId": userId,
    //        isNew: true
    //    };
    /**
     * load all customized elements of user
     * */
    $scope.loadCustomizedElementMenus = function () {
        $scope.userCustomizedElementsTabPromise = UserCustomizedElementRecordService.loadCustomizedElementMenus(userId)
            .then(
            function (data) {

                var menus = MessageService.handleMsg(data);
                if (menus) {
                    $scope.customizedElementsMenus = menus;
                    $scope.menuSelect(menus[0]);
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };
    /**
     * when document ready, then load all the customized elements menu
     * */
    $timeout(function () {
        $scope.loadCustomizedElementMenus();
    });


    /**
     * when select an element in customized elements menu, then load the specific records of this kind of element
     * */
    $scope.menuSelect = function (menu) {
        angular.forEach($scope.customizedElementsMenus, function (itm) {
            itm.selected = itm.id === menu.id;
        });
        $scope.selectedcustomizedElementMenu = menu;
        $scope.listCustomizedElementRecordByUserIdAndElementId(userId, menu.id);
    };

    // the selected customized element type
    $scope.selectedcustomizedElementMenu = {};

    /**
     * create a new element button to the list
     * */
    var addNewElementRecordButtonToAllElements = function (selectedElementType, allElements) {
        var addNew =
        {
            "customizedElement": selectedElementType,
            "values": [],
            "userId": userId,
            isNew: true
        };
        for (var i = 0; i < selectedElementType.fields.length; i++) {
            addNew.values.push({
                customizedElementField: selectedElementType.fields[i],
                value: ''
            });
        }
        allElements.push(addNew);
    };

    $scope.listCustomizedElementRecordByUserIdAndElementId = function (userId, customizedElementId) {
        $scope.userCustomizedElementsTabContentPromise = UserCustomizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElementId)
            .then(
            function (data) {
                var allElement = MessageService.handleMsg(data);
                if (allElement) {
                    $scope.allElements = allElement;
                    addNewElementRecordButtonToAllElements($scope.selectedcustomizedElementMenu, $scope.allElements);
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    $scope.editRecord = function (r) {
        console.log(r);
        r.editing = true;
    };

    $scope.deleteRecord = function (r) {
        var flag = confirm("Do you want to delete "+ r.customizedElement.name);
        if(flag){
            $scope.userCustomizedElementsTabContentPromise = UserCustomizedElementRecordService.deleteCustomizedElementRecord(userId, $scope.selectedcustomizedElementMenu.id, r.id)
                .then(
                function (data) {
                    var allElement = MessageService.handleMsg(data);
                    if (allElement) {
                        $scope.allElements = allElement;
                        addNewElementRecordButtonToAllElements($scope.selectedcustomizedElementMenu, $scope.allElements);
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        }

    };
    $scope.saveRecord = function (record) {
        if (record.isNew) {
            record.promise = UserCustomizedElementRecordService.createCustomizedElementRecord(userId, record.customizedElement.id, record.values)
                .then(
                function (data) {
                    var allElement = MessageService.handleMsg(data);
                    if (allElement) {
                        $scope.allElements = allElement;
                        addNewElementRecordButtonToAllElements($scope.selectedcustomizedElementMenu, $scope.allElements);
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        } else {
            record.promise = UserCustomizedElementRecordService.updateCustomizedElementRecord(userId, record.customizedElement.id, record)
                .then(
                function (data) {
                    var allElement = MessageService.handleMsg(data);
                    if (allElement) {
                        $scope.allElements = allElement;
                        addNewElementRecordButtonToAllElements($scope.selectedcustomizedElementMenu, $scope.allElements);
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        }
    }

}]);


app.factory('UserCustomizedElementRecordService', ['$http', '$q', function ($http, $q) {

    return {

        loadCustomizedElementMenus: function (userId) {
            return $http.get('/user/' + userId + '/customizedElementMenu/')
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },
///user/{userId}/customizedElementRecord/{customizedElementId}/
        listCustomizedElementRecordByUserIdAndElementId: function (userId, customizedElementId) {
            return $http.get('/user/' + userId + '/customizedElementRecord/' + customizedElementId + '/').then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        ///user/{userId}/customizedElementRecord/{customizedElementId}/
        /**
         * CustomizedElementRecordValue :
         *  [
         *      {
         *      "customizedElementField":{
         *      "id":"40288083512f034b01512f04d6010001",
         *      "name":"name",
         *      "description":null,
         *      "type":"String"
         *      },
         *      "value":"vasdad"
         *  }
         * ]
         *
         * */
        createCustomizedElementRecord: function (userId, customizedElementId, customizedElementRecordValue) {
            return $http.post('/user/' + userId + '/customizedElementRecord/' + customizedElementId + '/', customizedElementRecordValue).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        updateCustomizedElementRecord: function (userId, customizedElementId, record) {
            return $http.put('/user/' + userId + '/customizedElementRecord/' + customizedElementId + '/', record).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        ///user/{userId}/customizedElementRecord/{customizedElementId}/{recordId}
        deleteCustomizedElementRecord: function (userId, customizedElementId, recordId) {
            return $http.delete('/user/' + userId + '/customizedElementRecord/' + customizedElementId + '/' + recordId).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }


    }
}]);