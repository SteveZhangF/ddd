/**
 * Created by steve on 10/11/15.
 */
var app = angular.module("dashboardApp");

app.controller('formListCtrl', ['$scope', "FormService", function ($scope, FormService) {
    console.log("test form list in");
    $scope.myHtml = {value:"<h1>Do ur Best</h1>"};
    $scope.froalaOptions = {
        toolbarButtons : ["bold", "italic", "underline", "sep", "align", "formDesigner","showFormDesign","formDesignText"]
    };

    $scope.forms = [];

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
    //backup for null form
    var formDetail_ = $scope.formDetail;
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
        //TODO
        //FormService.deleteForm(form.id);
        var index = $scope.forms.indexOf(form);
        $scope.forms.splice(index,1);
        console.log("delete.." + form.id);
    };
    $scope.saveForm = function (form) {
        console.log("saving.." + form.id);
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
    /**
     * when click save
     * */
    $scope.save = function () {
        //TODO
        console.log($scope.formDetail);
        var form = FormService.parse_form($scope.formDetail.context,0);
        form.creator = $scope.formDetail.creator;
        form._del = false;
        form.form_desc = $scope.formDetail.form_desc;
        form.form_name = $scope.formDetail.form_name;
        form.id=$scope.formDetail.id;
        console.log(form);
        //$scope.saveForm(form);
        $scope.forms.push(form);
        $scope.editing = false;
    };
    $scope.update = function () {
        //TODO
        console.log($scope.formDetail);
        var form = FormService.parse_form($scope.formDetail.context,0);
        //form.creator = $scope.formDetail.creator;
        //form._del = false;
        //form.form_desc = $scope.formDetail.form_desc;
        //form.form_name = $scope.formDetail.form_name;
        //form.id=$scope.formDetail.id;
        $scope.formDetail.context = form.context;
        $scope.formDetail.context_parse = form.context_parse;
        $scope.formDetail.fields_count = form.fields_count;
        //$scope.updateForm(form);
        $scope.editing = false;
    };
    $scope.cancel = function () {
        $scope.editing = false;
    };
}]);

