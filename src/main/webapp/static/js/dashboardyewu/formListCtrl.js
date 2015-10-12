/**
 * Created by steve on 10/11/15.
 */
var app = angular.module("dashboardApp");

app.controller('formListCtrl', ['$scope', "FormService", function ($scope, FormService) {
    console.log("test form list in");
    $scope.myHtml = "<h1>Hello World</h1>";
    $scope.froalaOptions = {
        toolbarButtons : ["bold", "italic", "underline", "sep", "align", "formDesigner","showFormDesign","formDesignText"]
    };

    var forms = "[{\"id\":5,\"ssoId\":\"www\",\"password\":\"qqq\",\"companyId\":null,\"email\":\"wwwW2@we\"" +
        ",\"state\":\"Active\",\"userProfiles\":[]},{\"id\":6,\"ssoId\":\"ddd\",\"password\":\"www\",\"companyId\":null,\"email\":" + "\"ddd\",\"state\":\"Active\",\"userProfiles\":[]}]";


    $scope.forms = JSON.parse(forms);
    console.log(forms);
    $scope.formDetail = {
        id: "",
        fields_count: "",
        creator: "",
        createTime: "",
        updateTime: "",
        _del: "",
        context_parse: "",
        context: "",
        form_desc: "",
        form_name: ""
    };
    var formDetail_ = $scope.formDetail;
    //$scope.selectedForm = {id:"",fields_count:"",creator:"",createTime:"",updateTime:"",_del:"",context_parse:"",context:"",form_desc:"",form_name:""};
    $scope.editing = false;
    self.fetchAllForms = function () {
        FormService.fetchAllForms()
            .then(
            function (d) {
                $scope.forms = d;
            },
            function (errResponse) {
                console.error('Error while fetching Currencies');
            }
        );
    };
    self.fetchOneForm = function (form) {
        FormService.fetchOneForm(form.id).then(
            function (d) {
                $scope.formDetail = d;
            },
            function (err) {
                console.log(err);
            }
        );
    };
//TODO
    //self.fetchAllForms();

    $scope.editForm = function (form) {
        $scope.editing = true;
        $scope.isNew = false;
        console.log($scope.editing);
        //TODO self.fetchOneForm(form);
        $scope.formDetail = form;
        console.log("editing.." + form.id);
    };
    $scope.addNewForm = function () {
        $scope.editing = true;
        $scope.isNew = true;
        $scope.formDetail = formDetail_;
        console.log("adding..");
    };
    $scope.deleteForm = function (form) {
        FormService.deleteForm(form.id);
        console.log("delete.." + form.id);
    };
    $scope.saveForm = function (form) {
        console.log("saving.." + $scope.selectedForm.id);
        FormService.createForm(form).then(
            function (d) {
                console.log("success");
            },
            function (e) {
                console.log(e);
            }
        );
    };
    $scope.updateForm = function (form) {
        FormService.updateForm(form, form.id).then(
            function (d) {
                console.log("success");
            },
            function (e) {
                console.log(e);
            }
        );
    };
    $scope.save = function () {
        //TODO
        $scope.editing = false;
    };
    $scope.update = function () {
        //TODO
        $scope.editing = false;
    };
    $scope.cancel = function () {
        $scope.editing = false;
    };
}]);

