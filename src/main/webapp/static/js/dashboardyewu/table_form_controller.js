'use strict';


app.controller('TableFormController', ['$scope',  'LoginService', 'usSpinnerService', '$location', function ($scope,  LoginService, usSpinnerService, $location) {
    $scope.tableForms = [];
    $scope.selectedAll = false;
    $scope.itemPerPage = 5;


    /**
     * spinner start
     * */
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            console.log('loading');
            usSpinnerService.spin('table-form-list-spinner');
            $scope.spinneractive = true;
        }
    };
    $scope.stopSpin = function () {
        if ($scope.spinneractive) {
            console.log('stoped');
            usSpinnerService.stop('table-form-list-spinner');
            $scope.spinneractive = false;
        }
    };

    /**
     * spanner end
     * */

    $scope.tableError = {hasError: false, msg: ''};
    $scope.loadAll = function () {
    };

    $scope.loadAll();

    $scope.select = function () {
        $scope.selectedAll = $scope.tableForms.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAll = function () {
        var toggleStatus = !$scope.selectedAll;
        angular.forEach($scope.tableForms, function (itm) {
            itm.selected = !toggleStatus;
        });
    };

    $scope.deleteSelectedTableForm = function () {
        var ids = [];
        $scope.startSpin();
        angular.forEach($scope.tableForms, function (itm) {
            if (itm.selected === true) {
                ids.push(itm.uuid);
            }
        });
        //service delete
    };

    $scope.editTableForm = function (tableForm) {
        if (tableForm) {
            $location.search('tableFormId', tableForm.uuid);
        }
        $location.path('/table_form_edit');
    };

}]);