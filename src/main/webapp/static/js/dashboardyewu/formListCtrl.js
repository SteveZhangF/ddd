var app = angular.module("dashboardApp");
app.
    value('froalaConfig', {
        toolbarInline: false,
        placeholderText: "Edit Your Content Here!"
    });
app.controller('formListCtrl', ['$scope', "FormService", 'QuestionService', 'ngDialog', function ($scope, FormService, QuestionService, ngDialog) {
    $scope.myHtml = {value: "<h1>Do ur Best</h1>"};
    $scope.froalaOptions = {
        heightMin: 600,
        heightMax:800,
        events: {
            'froalaEditor.focus': function (e, editor) {
                editor.selection.restore();

            },
            'froalaEditor.blur': function (e, editor) {
                editor.selection.save();
            }
        }
    };

    $scope.forms = [];
    $scope.types = ["CompanyForm", "EmployeeForm", "DepartmentForm"];
    $scope.create = false;
    $scope.editFormFormat = false;
    $scope.isShowQuestions = false;

    $scope.showQuestions = function () {
        $scope.isShowQuestions = !$scope.isShowQuestions;
    }

    $scope.formDetail = {
        id: "",
        createTime: "",
        updateTime: "",
        content: "",
        form_desc: "",
        form_name: "",
        questions: []
    };

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
                $scope.froalaOptions.froalaEditor('html.set', "");
                $scope.froalaOptions.froalaEditor('html.insert', $scope.formDetail.content, true);
            },
            function (err) {
                console.log(err);
            }
        );
    };

    self.fetchAllForms();

    var dialog;

    $scope.edit = function (form) {
        $scope.formDetail = form;
        $scope.create = false;
        dialog = ngDialog.open({
            template: 'form-information-dialog.html',
            scope: $scope
        });
    };

    $scope.createNew = function () {
        $scope.formDetail = {};
        $scope.create = true;
        dialog = ngDialog.open({
            template: 'form-information-dialog.html',
            scope: $scope
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
            scope: $scope
        });
    };
    $scope.deleteOk = function () {
        FormService.deleteForm($scope.formDetail.id).then(function (response) {
            self.fetchAllForms();
            $scope.cancel();
        });
    };

    $scope.editFormFormatAction = function (form) {
        self.fetchOneForm(form);
        //$scope.formDetail = form;
        $scope.editFormFormat = true;
        $scope.create = false;
        $scope.getQuestion();
    };

    $scope.formFormateOk = function () {
        var content = $scope.froalaOptions.froalaEditor('html.get', false);
        $scope.formDetail.content = content;
        var plugins = angular.element(content).find('plugin');
        var questions = [];
        //for (var i = 0; i < plugins.length; i++) {
        angular.forEach(plugins, function (plugin,i) {
            //var plugin = plugins[i];
            var question = {id: ''};
            question.id = plugin.getAttribute('id');
            questions.push(question);
        });

        $scope.formDetail.questions = questions;
        FormService.updateFormDetail($scope.formDetail, $scope.formDetail.id).then(
            function (d) {
                console.log("success");
                self.fetchAllForms();
            },
            function (e) {
                alert("failed, Try later");
                self.fetchAllForms();
            }
        );
        $scope.editFormFormat = false;
    };

    $scope.questions = {
        all: [{
            id: '1',
            index: '0',
            label: 'question1',
            type: 'text',
            name: 'questions1',
            content: '<plugin><input class="form-control" type=\"text\" id = \'{#ID}\' ></plugin>'
        }, {
            id: '2',
            index: '1',
            label: 'question2',
            type: 'select',
            name: 'question2',
            content: '<plugin><textarea class="form-control"/></plugin>'
        }, {
            id: '3',
            index: '2',
            label: 'question3',
            type: 'checkbox',
            name: 'question3',
            content: '<plugin><label class="form-control"><input type="checkbox" value="ddd" > ddd</label><label class="form-control"><input type="checkbox"> sss</label></plugin>'
        }, {

            id: '4',
            index: '3',
            label: 'question4',
            type: 'select',
            name: 'question4',
            content: '<plugin><select name="singleSelect" class="form-control" ng-model="data.singleSelect"><option value="option-1" > Option 1</option><option value="option-2" > Option 2</option></select></plugin>'

        }],
        selectedQuestion: {}
    };

    $scope.getQuestion = function () {
        QuestionService.fetchAllQuestions().then(function (data) {
            $scope.questions.all = data;
            for (var i = 0; i < data.length; i++) {
                $scope.questions.all[i].index = i;
                $scope.questions.all[i].label = $scope.questions.all[i].name;
            }
        }, function (errData) {
            console.log(errData);
        });
    };

    $scope.onQuestionSelected = function (option) {
        $scope.questions.selectedQuestion = option;
    };

    $scope.insertQuestion = function () {
        var plugin = angular.element($scope.questions.selectedQuestion.content);

        if($scope.questions.selectedQuestion.options){
            var options = $scope.questions.selectedQuestion.options;
            if($scope.questions.selectedQuestion.type=="select"){
                for(var i=0;i<options.length;i++){
                    var opt = angular.element("<option></option>");
                    opt.text(options[i].name);
                    opt.attr('value',options[i].value);
                    plugin.find('select').append(opt);
                }
            }

        }


        plugin.find(".form-control").attr('disabled', 'true').attr('title', $scope.questions.selectedQuestion.name).removeClass("form-control");
        plugin.attr("question_id", $scope.questions.selectedQuestion.id).attr('name', $scope.questions.selectedQuestion.name);
        var el = angular.element("<div></div>");
        el.append(plugin);
        var txt = "{-" + el.html() + "-}";
        $scope.froalaOptions.froalaEditor('html.insert', txt, true);
        el = null;
    };
}]);

/**
 * Created by steve on 10/11/15.
 */

