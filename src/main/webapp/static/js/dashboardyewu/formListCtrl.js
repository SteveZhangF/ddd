/**
 * Created by steve on 10/11/15.
 */
var app = angular.module("dashboardApp");

app.controller('formListCtrl', ['$scope', "FormService", function ($scope, FormService) {
    console.log("test form list in");
    $scope.myHtml = {value:"<h1>Do ur Best</h1>"};
    $scope.froalaOptions = {
      //  toolbarButtons : ["bold", "italic", "underline", "sep", "align", "formDesigner","showFormDesign","formDesignText"]
    };

    $scope.forms = [];

    var formDetail_ = {
        id: "",
        fields_count: "",
        creator: "",
        createTime: "",
        updateTime: "",
        _del: "",
        context_parse: "",
        context: "",
        form_desc: "",
        form_name: "",
        data:""
    };
    //backup for null form
    $scope.formDetail = formDetail_;
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
    self.fetchAllForms();

    $scope.editForm = function (form) {
        $scope.editing = true;
        $scope.isNew = false;

        //$scope.formDetail = form;
        console.log("editing.." + form.id);
    };
    $scope.addNewForm = function () {
        $scope.editing = true;
        $scope.isNew = true;
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
            form_name: "",
            data:""
        };
        console.log("adding..");
    };
    $scope.deleteForm = function (form) {

        FormService.deleteForm(form.id);
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
        console.log("get from editor");
        console.log($scope.formDetail.context);
        console.log('end get from editor');
        var form = FormService.parse_form($scope.formDetail.context,0);
        $scope.formDetail.context = form.context;
        $scope.formDetail.context_parse = form.context_parse;
        $scope.formDetail.fields_count = form.fields_count;
        $scope.formDetail.data=form.data;
        $scope.saveForm(form);
        console.log(JSON.stringify($scope.formDetail));
        //$scope.forms.push(form);
        self.fetchAllForms();
        $scope.editing = false;
    };

    $scope.$watch(function ($scope) {
        return $scope.editing;
    }, function () {
        if($scope.editing == false){
            self.fetchAllForms();
        }
    });

    $scope.update = function () {
        var form = FormService.parse_form($scope.formDetail.context,0);
        //form.creator = $scope.formDetail.creator;
        //form._del = false;
        //form.form_desc = $scope.formDetail.form_desc;
        //form.form_name = $scope.formDetail.form_name;
        //form.id=$scope.formDetail.id;
        $scope.formDetail.context = form.context;
        console.log(form.context);
        $scope.formDetail.context_parse = form.context_parse;
        $scope.formDetail.fields_count = form.fields_count;
        $scope.updateForm($scope.formDetail);
        self.fetchAllForms();
        $scope.editing = false;
    };
    $scope.cancel = function () {
        $scope.editing = false;
    };
}]);

