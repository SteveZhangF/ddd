'use strict';


app.controller('TableFormController', ['$scope', 'LoginService', 'usSpinnerService', '$location', 'TableFormService', function ($scope, LoginService, usSpinnerService, $location, TableFormService) {
    $scope.tableForms = [];
    $scope.selectedAll = false;
    $scope.itemPerPage = 5;


    /**
     * spinner start
     * */

    $scope.errorMsg = {hasMsg: false, isError: false};
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            $scope.errorMsg.hasMsg = true;
            usSpinnerService.spin('table-form-list-spinner');
            $scope.spinneractive = true;

            $scope.errorMsg.hasMsg = false;
        }
    };
    $scope.stopSpin = function (flag) {
        if ($scope.spinneractive) {
            usSpinnerService.stop('table-form-list-spinner');
            $scope.errorMsg.hasMsg = true;
            $scope.errorMsg.isError = !flag;
            $scope.spinneractive = false;
        }
    };

    /**
     * spanner end
     * */

    $scope.loadAll = function () {
        $scope.startSpin();
        TableFormService.getAllTableForm().then(
            function (response) {
                $scope.tableForms = response;
                $scope.tableFormsDisplay = angular.copy($scope.tableForms);
            },
            function (errResponse) {
                $scope.stopSpin(false);
            }
        );
    };

    $scope.loadAll();

    $scope.select = function () {
        $scope.selectedAll = $scope.tableFormsDisplay.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAll = function () {
        var toggleStatus = !$scope.selectedAll;
        angular.forEach($scope.tableFormsDisplay, function (itm) {
            itm.selected = !toggleStatus;
        });
    };

    $scope.deleteSelectedTableForm = function () {
        var ids = [];
        $scope.startSpin();
        angular.forEach($scope.tableFormsDisplay, function (itm) {
            if (itm.selected === true) {
                ids.push(itm.id);
            }
        });
        TableFormService.deleteTableForms(ids).then(
            function (response) {
                $scope.stopSpin(true);
                $scope.loadAll();
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
        //service delete
    };

    $scope.editTableForm = function (tableForm) {
        if (tableForm) {
            $location.search('tableFormId', tableForm.id);
        }
        $location.path('/table_form_edit');
    };

}]);

app.controller("TableFormEditController", ["$scope", "$location", "usSpinnerService", "TableFormService", function ($scope, $location, usSpinnerService, TableFormService) {

    // froala options
    $scope.froalaOptions = {
        heightMin: 600,
        heightMax: 800,
        //events: {
        //    'froalaEditor.focus': function (e, editor) {
        //        editor.selection.restore();
        //
        //    },
        //    'froalaEditor.blur': function (e, editor) {
        //        editor.selection.save();
        //    }
        //}
    };
    $scope.isEditingFormat = false;

    /**
     * spinner start
     * */

    $scope.errorMsg = {hasMsg: false, isError: false};
    $scope.spinneractive = false;
    $scope.startSpin = function () {
        if (!$scope.spinneractive) {
            $scope.errorMsg.hasMsg = true;
            usSpinnerService.spin('table-form-edit-spinner');
            $scope.spinneractive = true;

            $scope.errorMsg.hasMsg = false;
        }
    };
    $scope.stopSpin = function (flag) {
        if ($scope.spinneractive) {
            usSpinnerService.stop('table-form-edit-spinner');
            $scope.errorMsg.hasMsg = true;
            $scope.errorMsg.isError = !flag;
            $scope.spinneractive = false;
        }
    };

    /**
     * spanner end
     * */
    $scope.editedTableForm = {};

    $scope.newEditedTableForm = true;

    $scope.loadTableForm = function () {
        var id = $location.search().tableFormId;
        if (id) {
            $scope.startSpin();
            TableFormService.getTableForm(id).then(
                function (response) {
                    $scope.editedTableForm = response;
                    $scope.stopSpin(true);
                    $scope.newEditedTableForm = false;
                },
                function (err) {
                    $scope.newEditedTableForm = true;
                    $scope.editedTableForm = {fields: []};
                    $scope.stopSpin(false);
                }
            );
        } else {
            $scope.newEditedTableForm = true;
            $scope.editedTableForm = {fields: [{name:'test',id:'1'}]};
            $scope.stopSpin(true);
        }
    };

    $scope.loadTableForm();


    $scope.editFormat = function () {
        $scope.isEditingFormat = true;
        $scope.froalaOptions.froalaEditor('html.set', "");
        $scope.froalaOptions.froalaEditor('html.insert', $scope.editedTableForm.content, true);
    };

    $scope.saveFormat = function () {
        $scope.isEditingFormat = false;
        $scope.editedTableForm.content = $scope.froalaOptions.froalaEditor('html.get', false);
    };

// for fields
    $scope.fieldTypes = ['employee', 'date', 'text','week of month','month of year'];
    $scope.addField = function (field) {
        $scope.startSpin();
        TableFormService.saveField(field).then(
            function (data) {
                $scope.stopSpin(true);
                $scope.editedTableForm.fields.push(data);
                $scope.newField = {};
            },
            function (err) {
                $scope.stopSpin(false);
            }
        )
    };

    $scope.updateField = function (field) {
        $scope.startSpin();
        TableFormService.updateField(field).then(
            function (data) {
                $scope.stopSpin(true);
            },
            function (err) {
                $scope.stopSpin(false);
            }
        )
    };

    $scope.deleteField = function (field) {
        for (var i = 0; i < $scope.editedTableForm.fields.length; i++) {
            var f = $scope.editedTableForm.fields[i];
            if (f.id == field.id) {
                $scope.editedTableForm.fields.splice(i, 1);
            }
        }
    };

    $scope.menuOptions = [
        ['Add Table Here', function ($itemScope) {
            $scope.insertTable();
        }]
    ];
//    <
//    thead >
//    < tr >
//    < th
//    ng - repeat = "field in editedTableForm.fields" >
//        {
//    {
//        field.name
//    }
//}
//< / th >
//< / tr >
//< / thead >
//< tbody >
//< tr >
//< td id = "{{field.id}}" ng - repeat = "field in editedTableForm.fields" >
//< / td >
//< / tr >
//< / tbody >
$scope.insertTable = function () {
    var table = angular.element("<table></table>");
    var head = angular.element("<thead></thead>");
    var tr = angular.element("<tr></tr>");
    tr.appendTo(head);
    head.appendTo(table);
    var body = angular.element("<tbody><tr></tr></tbody>");
    body.appendTo(table);
    angular.forEach($scope.editedTableForm.fields, function (field) {
        var th = angular.element("<th>"+field.name+"</th>");
        tr.append(th);

        var td = angular.element("<td></td>");
        td.attr('id',field.id);
        angular.element(body.find("tr")).append(td);
    });
    var el = angular.element("<div></div>");
    el.append(table);
    var txt = el.html();
    $scope.froalaOptions.froalaEditor('html.insert', txt, true);
};

$scope.preview = function () {
    $scope.isPreviewShowing = !$scope.isPreviewShowing;
    angular.element("#preview_temp").html('').append($scope.editedTableForm.content);
    showPDF();

};
$scope.content = '';
var showPDF = function () {
    var pdf = new jsPDF('p', 'pt', 'a4');
    var source = $('#preview_temp').get(0);
    angular.element(source).css("display", "block");
    var specialElementHandlers = {
        '#bypassme': function (element, renderer) {
            return true
        }
    };
    var margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522
    };
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML(
        source, // HTML string or DOM elem ref.
        margins.left, // x coord
        margins.top, { // y coord
            'width': margins.width, // max width of content on PDF
            'elementHandlers': specialElementHandlers
        },

        function (dispose) {
            $scope.content = pdf.output("dataurlstring");
        }, margins);
    angular.element(source).css("display", "none");
};

$scope.saveTableForm = function () {
    $scope.startSpin();
    if ($scope.newEditedTableForm) {
        TableFormService.saveTableForm($scope.editedTableForm).
            then(function (response) {
                $location.search('tableFormId', response.id);
                $location.path('/table_form_edit');
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
    } else {
        TableFormService.updateTableForm($scope.editedTableForm)
            .then(
            function (response) {
                $location.search('tableFormId', $scope.editedTableForm.id);
                $location.path('/table_form_edit');
            },
            function (err) {
                $scope.stopSpin(false);
            }
        );
    }
};

$scope.cancelTableForm = function () {
    $location.path('/table_forms');
}
}])
;


app.factory('TableFormService', ['$http', '$q', 'LoginService', function ($http, $q, LoginService) {
    return {

        getAllTableForm: function () {
            return $http.get('/tableForm/')
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        deleteTableForms: function (ids) {
            return $http.post('/tableForm/delete/', ids)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getTableForm: function (tableFormId) {
            return $http.get('/tableForm/' + tableFormId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        saveTableForm: function (tableForm) {
            return $http.post('/tableForm/', tableForm)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        updateTableForm: function (tableForm) {
            return $http.put("/tableForm/" + tableForm.id, tableForm).then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        saveField: function (field) {
            return $http.post('/tableForm/fields/', field)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        updateField: function (field) {
            return $http.put('/tableForm/fields/' + field.id, field)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        deleteField: function (fieldId) {
            return $http.delete('/tableForm/fields/' + fieldId)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }
    };

}]);


