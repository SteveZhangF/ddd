'use strict';

app.filter('customFilter', ['$filter', function ($filter) {
    var filterFilter = $filter('filter');

    return function (input) {
        var out = [];
        angular.forEach(input.values, function (value) {
            var field = value.field;
            angular.forEach(input.customizedElement.fields, function (orgField) {
                if (field == orgField.id) {

                }
            });
        });
        return out;
    }


}])
;
app.controller('UserCustomizedElementController', ['$scope', '$filter', 'UserCustomizedElementRecordService', 'LoginService', function ($scope, $filter, UserCustomizedElementRecordService, LoginService) {
    $scope.customizedElementsMenus = [];
    var userId = LoginService.getUserInfo().userId;
    $scope.loadCustomizedElementMenus = function () {

        UserCustomizedElementRecordService.loadCustomizedElementMenus(userId)
            .then(
            function (data) {
                $scope.customizedElementsMenus = data;
                $scope.menuSelect(data[0]);
            },
            function (err) {

            }
        );
    };
    $scope.menuSelect = function (menu) {
        angular.forEach($scope.customizedElementsMenus, function (itm) {
            itm.selected = itm.name === menu.name;
        });
        $scope.selectedcustomizedElementMenu = menu;
        $scope.listCustomizedElementRecordByUserIdAndElementId(userId, menu.id);
    };

    $scope.selectedcustomizedElementMenu = {};
    // param: id   id of selected customized element (menu) id
    $scope.getElementRows = function (elementsOfSelectedCustomizedElementMenu) {
        var n = elementsOfSelectedCustomizedElementMenu.length;
        var rows = 0;
        rows = ( n - n % 3) / 3;
        var elements = [];
        for (var r = 0; r < rows; r++) {
            var col = [];
            for (var c = 0; c < 3; c++) {
                col.push(elementsOfSelectedCustomizedElementMenu[r * 3 + c]);
            }
            elements.push(col);
        }
        var lastCol = [];
        for (var c = n % 3; c > 0; c--) {
            lastCol.push(elementsOfSelectedCustomizedElementMenu[n - c]);

        }
        var addNew =
        {
            "customizedElement": $scope.selectedcustomizedElementMenu,
            "values": [],
            "userId": userId,
            isNew: true
        };
        //{
        //    customizedElementField: {
        //        id:"40288083512f034b01512f04d6010001",
        //            name:"name",
        //            description:null,
        //            type:"String"
        //    },
        //    value: "vasdad"
        //}
        for (var i = 0; i < $scope.selectedcustomizedElementMenu.fields.length; i++) {
            addNew.values.push({
                customizedElementField: $scope.selectedcustomizedElementMenu.fields[i],
                value: ''
            });
        }
        lastCol.push(addNew);
        elements.push(lastCol);

        return elements;
    };

    $scope.listCustomizedElementRecordByUserIdAndElementId = function (userId, customizedElementId) {
        UserCustomizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElementId)
            .then(
            function (data) {
                $scope.elementRows = $scope.getElementRows(data);
            },
            function (err) {
            }
        );
    };

    $scope.editRecord = function (r) {
        console.log(r);
        r.editing = true;
    }

    $scope.saveRecord = function (record) {
        if (record.isNew) {
            UserCustomizedElementRecordService.createCustomizedElementRecord(userId, record.customizedElement.id, record.values)
                .then(
                function (data) {
                    $scope.elementRows = $scope.getElementRows(data);
                },
                function (err) {

                }
            );
        }else{
            UserCustomizedElementRecordService.updateCustomizedElementRecord(userId,record.customizedElement.id,record)
                .then(
                function (data) {
                    $scope.elementRows = $scope.getElementRows(data);
                },
                function (err) {

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
        }

    }
}]);