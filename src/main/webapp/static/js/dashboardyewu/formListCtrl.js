app.controller('formListCtrl', ['$scope', "FormService",'QuestionService','ngDialog' ,function ($scope, FormService,QuestionService,ngDialog) {
    console.log("test form list in");
    $scope.myHtml = {value:"<h1>Do ur Best</h1>"};
    $scope.froalaOptions = {
        //  toolbarButtons : ["bold", "italic", "underline", "sep", "align", "formDesigner","showFormDesign","formDesignText"]
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
        form_name: "",
        data:""
    };

    $scope.types = ["CompanyForm","EmployeeForm","DepartmentForm"];

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

    self.fetchAllForms();

    $scope.editing = false;

    var dialog;
    $scope.edit = function (form) {
        $scope.formDetail = form;
        $scope.create = false;
        dialog = ngDialog.open({
            template: 'form-information-dialog.html',
            scope: $scope
        });
    };

    $scope.create = false;
    $scope.createNew = function () {
        $scope.formDetail = {};
        $scope.create = true;
        dialog = ngDialog.open({
            template:'form-information-dialog.html',
            scope:$scope
        });
    };


    $scope.info_ok = function () {
        if ($scope.create) {
            FormService.createForm($scope.formDetail).then(
                function (d) {
                    self.fetchAllForms();
                },
                function (e) {
                    alert("failed, Try later");
                    self.fetchAllForms();
                }
            );
        } else {
            FormService.updateForm($scope.formDetail, $scope.formDetail.id).then(
                function (d) {
                    console.log("success");
                    self.fetchAllForms();
                },
                function (e) {
                    alert("failed, Try later");
                    self.fetchAllForms();
                }
            );
        }
        if (dialog) {
            dialog.close("");
        }
    };

    $scope.cancel = function () {
        if (dialog) {
            dialog.close("");
        }
    };

    $scope.delete = function (form) {
        $scope.formDetail = form;
        dialog = ngDialog.open({
            template: "form-delete-dialog.html",
            scope:$scope
        });
    };
    $scope.deleteOk = function () {
        QuestionService.deleteQuestion($scope.question.id).then(function (response) {
            self.fetchAllForms();
            $scope.cancel();
        });
    };
    $scope.editFormFormat = false;

    $scope.editFormFormatAction = function (form) {
       // self.fetchOneForm(form);
        $scope.editFormFormat = true;
    };

    $scope.formFormateOk = function () {
        console.log($scope.formDetail.context);
    };

    $scope.questions={
        all:[{id:'1',index:'0', label:'question1',type:'text',name:'questions1'}],
        selectedQuestion:{}
    } ;
    //var form = {
    //    index:j,
    //    label: form_org.form_name,
    //    id: form_org.id,
    //    type:'form',
    //    name: form_org.form_name
    //}
    $scope.getQuestion = function () {
        QuestionService.fetchAllQuestions().then(function (data) {
            $scope.questions.all = data;
            for(var i=0;i<data.length;i++){
                $scope.questions.all[i].index = i;
                $scope.questions.all[i].label =$scope.questions.all[i].name;
            }
        }, function (errData) {
            console.log(errData);
        });
    };
    
    $scope.onQuestionSelected = function (option) {
        $scope.questions.selectedQuestion = option;
    };
    
    $scope.insertQuestion = function () {
        console.log($scope.questions.selectedQuestion);
        var selection = $scope.froalaOptions.froalaEditor('html.set',$scope.questions.selectedQuestion,true);
        console.log(selection);
    };

}]);

/**
 * Created by steve on 10/11/15.
 */

var app = angular.module("dashboardApp");
