var app = angular.module('dashboardApp');


app.controller('FolderCustomizedElementController', ['$scope', 'QuestionService', 'WorkFlowService', 'ngDialog', '$timeout', 'FolderService', function ($scope, QuestionService, WorkFlowService, ngDialog, $timeout, FolderService) {



    var folderId = $scope.thisFolder.id;

    $scope.fieldTypes = ["String","Number","Date"];
    
    $scope.addField = function (element,field) {
        console.log('add field');
        console.log(field);
        console.log(element);
        if(!element.fields){element.fields = []}
        element.fields.push({name:field.name,type:field.type});
        field.name='';
        field.type='';
    };
    
    $scope.removeField = function (element,i) {
        console.log('remove field' + i + ' form ' );
        console.log(element);
        if(element.fields && element.fields.length>i){
            element.fields.splice(i,1);
        }
    };

    $scope.saveElement = function (element) {
        console.log('save element ');
        console.log(element);
    };

}]);

