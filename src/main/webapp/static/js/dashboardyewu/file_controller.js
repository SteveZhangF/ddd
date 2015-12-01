app.controller('FileTreeController', ['$scope', '$filter', 'FolderService', '$timeout', 'MessageService', 'filterFilter', function ($scope, $filter, FolderService, $timeout, MessageService, filterFilter) {
    $scope.folders = [];
    $scope.menu = {};
    $scope.thisFolder = {};
    $scope.treeFilter = {deleted: false, type: 'FOLDER'};
    var folderMenu = {
        all: [
            {
                name: 'Edit', url: 'dashboard/folder_edit.html', selected: true
            },
            {
                name: "Files",
                url: 'dashboard/folder_files.html'
            }, {name: 'Questions', url: 'dashboard/folder_questions.html'},
            {
                name: 'Flows',
                url: 'dashboard/folder_flow.html'
            }


        ], selectedMenu: {}
    };

    var moduleMenu = {
        all: [
            {
                name: 'Edit', url: 'dashboard/folder_edit.html', selected: true
            },
            {
                name: "Files",
                url: 'dashboard/folder_files.html'
            }, {name: 'Questions', url: 'dashboard/folder_questions.html'},
            {
                name: 'Flows',
                url: 'dashboard/folder_flow.html'
            },
            {
                name: 'Customized Element', url: 'dashboard/folder_customized_element.html'
            },
            {
                name: 'Employee Field', url: 'dashboard/folder_employee_field.html'
            }

        ], selectedMenu: {}
    };

    var rootFolderMenu = {
        all: [{
            name: "Files",
            url: 'dashboard/folder_files.html', selected: true
        }], selectedMenu: {}
    };

    var fileMenu = {
        all: [
            {
                name: 'Edit', url: 'dashboard/folder_edit_file.html', selected: true
            }
        ],
        selectedMenu: {}
    };

    $scope.selectMenu = function (m) {
        angular.forEach($scope.menu, function (mi) {
            mi.selected = false;
        });
        m.selected = true;
        $scope.menu.selectedMenu = m;
    };


    $scope.$watch('modelTree.currentNode', function (newObj, oldObj) {
        if ($scope.modelTree && angular.isObject($scope.modelTree.currentNode)) {
            $scope.fileElementNodeSelected($scope.modelTree.currentNode);
        }
    }, false);

    $scope.loadFolderTree = function () {
        $scope.treePromise = FolderService.getFolderTree().then(
            function (data) {
                $scope.folders = [];
                var content = MessageService.handleMsg(data);
                if (content) {
                    $scope.folders.push(content);
                    $scope.modelTree.currentNode = $scope.folders[0];
                }
            },
            function (err) {
                //var msg = {
                //    "title": "SUCCESS",
                //    "content": {
                //        "id": "402880835133d1ad015133d1c9360000",
                //        "name": "ROOT",
                //        "description": "This is a root folder, please do not modify it",
                //        "createTime": null,
                //        "updateTime": null,
                //        "level": 0,
                //        "leaf": false,
                //        "parent_id": null,
                //        "deleted": false,
                //        "root": true,
                //        "type": "FOLDER",
                //        "children": []
                //    },
                //    "description": "Load Files Tree Success!"
                //};
                //var content = MessageService.handleMsg(msg);
                //$scope.folders = [];
                //$scope.folders.push(content);
                MessageService.handleServerErr(err);
            }
        );
    };
    $timeout(function () {
        $scope.loadFolderTree();
    });

    $scope.editFileOrFolder = function (f) {
        if (!f.leaf) {
            f.editing = true;
            f.name_ = f.name;
            f.description_ = f.description;
        } else {
            $scope.editFile(f);
        }
    };

    $scope.fileElementNodeSelected = function (node) {
        node.selected = 'selected';
        switch (node.type) {
            case 'FOLDER':
                if (node.root) {
                    $scope.menu = angular.copy(rootFolderMenu);
                } else if (node.level == 1) {
                    $scope.menu = angular.copy(moduleMenu);
                } else {
                    $scope.menu = angular.copy(folderMenu);
                }
                $scope.menu.selectedMenu = $scope.menu.all[0];
                $scope.thisFolder = node;
                $scope.thisFolder.name_ = $scope.thisFolder.name;
                $scope.thisFolder.description_ = $scope.thisFolder.description;
                break;
            case 'FILE':
                $scope.menu = angular.copy(fileMenu);
                $scope.selectMenu($scope.menu.all[0]);
                $scope.thisFolder = node;
                $scope.thisFolder.name_ = $scope.thisFolder.name;
                $scope.thisFolder.description_ = $scope.thisFolder.description;
                $scope.editFile(node);
                break;
        }
    };

    /** check box in file list start*/
    $scope.selectFolderOrFile = function () {
        $scope.thisFolder.selectedAllFolderOrFile = $scope.thisFolder.children.every(function (itm) {
            return itm.selected;
        })
    };

    $scope.selectAllFolderOrFile = function () {
        var toggleStatus = !$scope.thisFolder.selectedAllFolderOrFile;
        angular.forEach($scope.thisFolder.children, function (itm) {
            itm.selected = !toggleStatus;
        });
    };
    /** check box in file list end*/
        // create a new folder
    $scope.newFolder = {isNew: true};
    // save folder
    $scope.saveFolder = function (f) {
        if (f.isNew) {//if the folder is new
            var parentId = $scope.thisFolder.id;
            $scope.newFolderPromise = FolderService.saveFolder(parentId, f)
                .then(function (data) {
                    var content = MessageService.handleMsg(data);
                    if (content) {
                        $scope.thisFolder.children.push(content);
                        f.editing = false;
                    }
                },
                function (err) {
                    MessageService.handleMsg(err);
                });
        } else {//update
            var f_ = angular.copy(f);
            f_.name = f_.name_;
            f_.description = f_.description_;
            delete f_.children;// when update folder, there is no need to send children to server
            $scope.updateFolderPromise = FolderService.updateFolder(f_)
                .then(
                function (data) {
                    var content = MessageService.handleMsg(data);
                    if (content) {
                        angular.copy(content, f);
                        f.name_ = f.name;
                        f.description_ = f.description;
                        f.editing = false;
                        //if the editing folder is the selected folder in tree then set selected attribute to selected
                        if (f.id == $scope.thisFolder.id) {
                            f.selected = 'selected';
                        }
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        }
    };
    //$scope.

    /**
     * delete selected folder or file in file list
     * */
    $scope.deleteSelectedFolderOrFile = function () {
        var r = confirm("Do you want to delete the selected item?");
        if (r == true) {
            var selected = [];
            for (var i = 0; i < $scope.thisFolder.children.length; i++) {
                if ($scope.thisFolder.children[i].selected) {
                    selected.push($scope.thisFolder.children[i].id);
                }
            }
            if (selected.length > 0) {
                $scope.fileTablePromise = FolderService.deleteSelectFolders($scope.thisFolder.id, selected).then(
                    function (data) {
                        var parentFolderAfterDeleted = MessageService.handleMsg(data);
                        if (parentFolderAfterDeleted) {
                            angular.copy(parentFolderAfterDeleted, $scope.thisFolder);
                            $scope.thisFolder.selected = "selected";
                        }
                    },
                    function (err) {
                        MessageService.handleServerErr(err);
                    }
                );
            }
        }
    };

    /**
     * when click create a new file or edit file
     * */
    $scope.editFile = function (fileNode) {
        $scope.thisFolder.showFileEditor = true;
        if (fileNode) {
            $scope.fileEditPromise = FolderService.getElement(fileNode.id, "FILE")
                .then(
                function (data) {
                    var file = MessageService.handleMsg(data);
                    if (file) {
                        $scope.editingFileNode = file;
                        $scope.editingFileNode.name_ = $scope.editingFileNode.name;
                        $scope.editingFileNode.description_ = $scope.editingFileNode.description;
                        $scope.editingFileNode.fileType_ = $scope.editingFileNode.fileType;
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        } else {
            $scope.editingFileNode = {isNew: true, parent_id: $scope.thisFolder.id};
            $scope.thisFolder.showFileEditor = true;
        }
    };
}]);


app.controller('FolderQuestionController', ['$scope', 'FolderService', 'filterFilter', '$timeout', 'MessageService', function ($scope, FolderService, filterFilter, $timeout, MessageService) {
    var Question = function (name, questionType, options, description) {

    };
    $scope.types = ['textarea', "select", "text", "checkbox", "selectEmployee", "selectDepartment", "file"];

    /**
     * for check question in the table start
     * */
    $scope.selectQuestion = function () {
        $scope.selectedAllQuestion = $scope.questionNodeList.every(function (itm) {
            return itm.selected;
        })
    };
    $scope.selectAllQuestion = function () {
        var toggleStatus = !$scope.selectedAllQuestion;
        angular.forEach($scope.questionNodeList, function (itm) {
            itm.selected = !toggleStatus;
        });
    };
    /**
     * for check question in the table end
     * */

        // hold all the question nodes in the $scope.thisFolder
    $scope.questionNodeList = [];
    $scope.loadAllQuestionNodes = function () {
        $scope.questionTablePromise = FolderService.getElementBasedOnType($scope.thisFolder.id, "QUESTION")
            .then(
            function (data) {
                var questions = MessageService.handleMsg(data);
                if (questions) {
                    $scope.questionNodeList = questions.children;
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };
    $timeout(function () {
        $scope.loadAllQuestionNodes()
    });

    /**
     * when click on the question name in the table
     * */
    $scope.newQuestion = {};

    $scope.editQuestion = function (f) {
        if (!f.options) {
            f.options = [];
        }
        f.editing = true;
        f.name_ = f.name;
        f.description_ = f.description;
        f.questionType_ = f.questionType;
        f.options_ = angular.copy(f.options);
    };

    /**
     * save a question to the folder($scope.thisFolder)
     * */
    $scope.saveQuestion = function (question) {
        question.name = question.name_;
        question.options = angular.copy(question.options_);
        question.description = question.description_;
        question.questionType = question.questionType_;
        $scope.newQuestionPromise = FolderService.saveQuestion($scope.thisFolder.id, question)
            .then(
            function (d) {
                var question = MessageService.handleMsg(d);
                if (question) {
                    $scope.questionNodeList.push(question);
                    $scope.newQuestion.editing = false;
                    $scope.newQuestion = {};
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    /**
     * update a question
     * */
    $scope.updateQuestion = function (questionNode) {

        questionNode.name = questionNode.name_;
        questionNode.description = questionNode.description_;
        questionNode.options = angular.copy(questionNode.options_);
        $scope.questionEditPromise = FolderService.updateQuestion($scope.thisFolder.id, questionNode)
            .then(
            function (data1) {
                var q = MessageService.handleMsg(data1);
                if (q) {
                    $scope.loadAllQuestionNodes();
                }
            },
            function (err) {
                MessageService.handleServerErr(err);
            }
        );
    };

    $scope.deleteSelectedQuestion = function () {
        var r = confirm("Do you want to delete the selected item?");
        if (r == true) {
            var selected = [];
            for (var i = 0; i < $scope.questionNodeList.length; i++) {
                if ($scope.questionNodeList[i].selected) {
                    selected.push($scope.questionNodeList[i].id);
                }
            }
            $scope.questionTablePromise = FolderService.deleteSelectElements($scope.thisFolder.id, selected, "QUESTION").then(
                function (data) {
                    var elementsUnderParentFolderAfterDeleted = MessageService.handleMsg(data);
                    if (elementsUnderParentFolderAfterDeleted) {
                        $scope.questionNodeList = elementsUnderParentFolderAfterDeleted.children;

                        $scope.selectedAllQuestion = false;
                        $scope.selectAllQuestion();

                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        }
    };

    $scope.typeChanged = function (question) {
        var type = question.questionType_;
        var content = "";
        switch (type) {
            case "text":
                content = '<plugin id="{+id+}"><input class="form-control" type=\"text\"></plugin>';
                break;
            case 'textarea':
                content = '<plugin id="{+id+}"><textarea class="form-control"/></plugin>';
                break;
            case 'select':
                content = '<plugin id="{+id+}"><select class="form-control"></select></plugin>';
                break;
            case 'checkbox':
                content = '<plugin id="{+id+}"></plugin>';
                break;
            case 'selectEmployee':
                content = '<plugin id="{+id+}"><select class="form-control"><option>Employee</option></select></plugin>';
                break;
            case 'selectDepartment':
                content = '<plugin id="{+id+}"><select class="form-control"><option>Department</option></select></plugin>';
                break;
            case 'file':
                content = '<plugin id="{+id+}"><input type="file" class="form-control"></plugin>';
                break;
        }
        question.content = content;
        console.log(question.content);
    };


    $scope.newOp = {name: '', value: ''};
    $scope.addOption = function (question) {
        if (!question.options_) {
            question.options = [];
            question.options_ = [];
        }
        question.options_.push({name: $scope.newOp.name, value: $scope.newOp.value});
        $scope.newOp.name = '';
        $scope.newOp.value = '';
    };

    $scope.removeOption = function (question, i) {
        question.options_.splice(i, 1);
    }
}]);


app.controller('FileController', ['$scope', 'FolderService', 'filterFilter', '$timeout', 'MessageService', function ($scope, FolderSerice, filterFilter, $timeout, MessageService) {
    // options for froala text editor
    $scope.froalaOptions = {
        heightMin: 600,
        heightMax: 800,
        events: {
            'froalaEditor.focus': function (e, editor) {
                editor.selection.restore();

            },
            'froalaEditor.blur': function (e, editor) {
                editor.selection.save();
            }
        }
    };

    $scope.fileTypes = ['CompanyFile','EmployeeReport'];

    $scope.loadQuestionsForFile = function () {
        var parentId = $scope.editingFileNode.parent_id;
        switch ($scope.editingFileNode.fileType_){
            case 'CompanyFile':
                $scope.questionsForFilePromise = FolderSerice.loadQuestionNodesForFile(parentId)
                    .then(
                    function (data) {
                        var questions = MessageService.handleMsg(data);
                        if (questions) {
                            $scope.questionsForFile = questions;
                        }
                    },
                    function (err) {
                        $scope.stopSpin(false, 'loading questions failed, please try later');
                    }
                );
                break;
            case 'EmployeeReport':
                $scope.questionsForFilePromise = FolderSerice.getElementBasedOnType(parentId,'EMPLOYEE_FIELD')
                    .then(
                    function (data) {
                        var questions = MessageService.handleMsg(data);
                        if (questions) {
                            $scope.questionsForFile = questions.children;
                        }
                    },
                    function (err) {
                        $scope.stopSpin(false, 'loading questions failed, please try later');
                    }
                );

        }
    };

    var init = function () {
        $timeout(
            function () {
                $scope.froalaOptions.froalaEditor('html.set', '');
                if ($scope.editingFileNode.content) {
                    var i = $scope.froalaOptions.froalaEditor('html.insert', $scope.editingFileNode.content, true);
                }
                $scope.editingFileNode.name_ = $scope.editingFileNode.name;
                $scope.editingFileNode.description_ = $scope.editingFileNode.description;
                $scope.editingFileNode.fileType_ = $scope.editingFileNode.fileType;
                $scope.loadQuestionsForFile();
            }
        );
    };

    $scope.$watch(
        function (scope) {
            return scope.editingFileNode;
        },
        function () {
            init();
        }
    );
    //$scope.froalaOptions.froalaEditor('html.set', "");
    //$scope.froalaOptions.froalaEditor('html.insert', $scope.editingFileNode.file.content, true);

    $scope.selectedQuestionNodeForFile = {};

    $scope.selectQuestionForFile = function (questionNode) {
        angular.forEach($scope.questionsForFile, function (itm) {
            itm.selected = false;
        });
        questionNode.selected = true;
        $scope.selectedQuestionNodeForFile = questionNode;
    };
    // insert a selected node in to the file
    $scope.insertQuestionToFile = function () {
        var data = $scope.selectedQuestionNodeForFile;
        var plugin = angular.element('<plugin></plugin>');
        var formField = angular.element('<input>');
        formField.attr('type', 'text');
        formField.attr('value',data.name);
        formField.attr('disabled', 'true');
        plugin.append(formField);
        plugin.attr("question_id", data.id).attr('name', data.name).attr("questionType", data.questionType);

        var el = angular.element("<div></div>");
        el.append(plugin);
        var txt = "{-" + el.html() + "-}";
        $scope.froalaOptions.froalaEditor('html.insert', txt, true);
        el = null;
    };

    var parseFileFormat = function (fileNode) {
        //parse format
        var content = $scope.froalaOptions.froalaEditor('html.get', false);
        fileNode.content = content;
        var plugins = angular.element(content).find('plugin');
        var questions = [];

        for (var i = 0; i < plugins.length; i++) {
            var question = {id: ''};
            question.id = plugins[i].getAttribute('question_id');
            if (!existQuestion(question, questions)) {
                questions.push(question);
            }
        }
        fileNode.questions = questions;

    };
    var existQuestion = function (q, questions) {
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].id == q.id) {
                return true;
            }
        }
        return false;
    }
    // save button clicked
    $scope.saveFile = function (fileNode) {
        parseFileFormat(fileNode);
        console.log(fileNode);
        fileNode.name = fileNode.name_;
        fileNode.description = fileNode.description_;
        fileNode.fileType = fileNode.fileType_;
        if (fileNode.isNew) {
            $scope.fileEditPromise = FolderSerice.saveFile(fileNode.parent_id, fileNode)
                .then(
                function (data) {
                    var file = MessageService.handleMsg(data);
                    if (file) {
                        $scope.thisFolder.children.push(file);
                        $scope.thisFolder.showFileEditor = false;
                        $scope.editingFileNode = file;
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        } else {
            $scope.fileEditPromise = FolderSerice.updateFile(fileNode.parent_id, fileNode)
                .then(
                function (data) {
                    var file = MessageService.handleMsg(data);
                    if (file) {
                        if ($scope.thisFolder.id != file.id) {
                            //$scope.thisFolder.children.push(file);
                            $scope.thisFolder.showFileEditor = false;
                            $scope.editingFileNode = angular.copy(file);
                            angular.forEach($scope.thisFolder.children, function (c) {
                                if (c.id == file.id) {
                                    angular.copy(file, c);
                                }
                            })
                        } else {
                            angular.copy(file, $scope.thisFolder);
                            $scope.thisFolder.selected = 'selected';
                        }
                    }
                },
                function (err) {
                    MessageService.handleServerErr(err);
                }
            );
        }
    }
}]);

app.factory('FolderService', ['$http', '$q', function ($http, $q) {

    return {
        /**
         * load all the nodes under root node
         * */
        getFolderTree: function () {
            return $http.get('/admin/files/')
                .then(
                function (response) {
                    return response.data
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        /**
         * create a new sub folder under parent folder whose id is parentId
         * */
        saveFolder: function (parentId, folder) {
            return $http.post('/admin/files/' + parentId, folder)
                .then(function (response) {
                    return response.data;
                }, function (errResponse) {
                    return $q.reject(errResponse);
                });
        },
        /**
         * update a folder
         * */
        updateFolder: function (folder) {
            return $http.put('/admin/files/', folder)
                .then(
                function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        /**
         * delete selected files or folders under parentId folder
         * return parent folder with children folder in it
         * */
        deleteSelectFolders: function (parentId, ids) {
            return $http.post('/admin/files/deleteFolders/' + parentId, ids)
                .then(function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        /**
         * delete selected  elements with type type under parentId folder
         * return all elements with type type under parentID folder
         * */
        deleteSelectElements: function (parentId, ids, type) {
            return $http.post('/admin/files/delete/' + parentId + '/' + type, ids)
                .then(function (response) {
                    return response.data;
                },
                function (errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        /**
         * load all elements which type is type under parentId folder
         * */
        getElementBasedOnType: function (parentId, type) {
            return $http.get('/admin/files/' + parentId + '/' + type)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },
        /**
         * get one specific element
         * */
        getElement: function (id, type) {
            return $http.get('/admin/files/get/' + type + '/' + id)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },
        // questions
        /**
         * create a question under parentId folder
         * */
        saveQuestion: function (parentId, question) {
            return $http.post('/admin/files/question/' + parentId, question)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        updateQuestion: function (parentId, question) {
            return $http.put('/admin/files/question/' + parentId, question)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },
        // file
        /**
         * fileParentId: file's parent id
         * return all questions in parent folder and parent folder's parent folder...
         * */
        loadQuestionNodesForFile: function (fileParentId) {
            return $http.get('/admin/files/file/getQuestions/' + fileParentId)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        saveFile: function (parentId, file) {
            return $http.post('/admin/files/file/' + parentId, file)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        updateFile: function (parentId, file) {
            return $http.put('/admin/files/file/' + parentId, file)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },


        getFolderForSelect: function () {
            return $http.get('/admin/files/module/getModulesForUser/').then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        // flow
        getFlowOfFolder: function (folderId) {
            return $http.get('/admin/files/folder/getFlowOfFolder/' + folderId).then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        loadQuestionNodesBasedOnFolderId: function (parentId) {
            return $http.get('/admin/files/folder/' + parentId + '/flow/getQuestions/')
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        //employee field

        /**
         * create a question under parentId folder
         * */
        saveEmployeeField: function (parentId, employeeField) {
            return $http.post('/admin/files/employee_field/' + parentId, employeeField)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },

        updateEmployeeField: function (parentId, employeeField) {
            return $http.put('/admin/files/employee_field/' + parentId, employeeField)
                .then(
                function (response) {
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        },
        
        loadEmployeeReport: function (folderId) {
            return $http.get('/admin/files/employee_report/' + folderId)
                .then(
                function(response){
                    return response.data;
                },
                function (err) {
                    return $q.reject(err);
                }
            );
        }
    };

}]);

