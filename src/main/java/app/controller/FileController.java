/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.message.Message;
import app.model.files.*;
import app.model.forms.CustomizedElement;
import app.model.wordflow.WorkFlow;
import app.service.file.FileService;
import app.service.workflow.WorkFlowService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Created by steve on 11/23/15.
 */

@RestController
public class FileController {
    @Autowired
    FileService fileService;

    /**
     * load all the whole files tree
     */
    @RequestMapping(value = "/admin/files/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getAllFileTree() throws IOException {
        JsonNode root = fileService.loadAllFolderTree();
        Message msg = Message.getSuccessMsg("Load Files Tree Success!", root);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    /**
     * create a child folder into the parentId folder
     */
    @RequestMapping(value = "/admin/files/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> createFolderToFolder(@PathVariable String parentId, @RequestBody FolderFileElement folder) {

        if (folder.getName() == null || folder.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }
        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such parent folder"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }
        FileElement fileElement = new FolderFileElement();
        fileElement.setName(folder.getName());
        fileElement.setDescription(folder.getDescription());
        fileElement.setLevel(parent.getLevel()+1);
        fileElement.setDeleted(false);
        List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, fileElement.getName(), fileElement.getType());
        if (list.size() > 0) {
            return new ResponseEntity<>(Message.getFailMsg("Folder Already Exists"), HttpStatus.OK);
        }
        fileElement.setParent_id(parentId);
        fileService.save(fileElement);
        Message msg = Message.getSuccessMsg("Create Folder " + folder.getName() + "Under " + parent.getName() + " Success!", fileElement);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }


    /**
     * update the folder
     */
    @RequestMapping(value = "/admin/files/", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateFolder(@RequestBody FolderFileElement folder) {

        if (folder.getName() == null || folder.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }

        FileElement fileElement = fileService.get(folder.getId());
        if (fileElement == null) {
            return new ResponseEntity<>(Message.getFailMsg("Folder not found"), HttpStatus.OK);
        }

        List<FileElement> list = fileService.getFileElementByNameParentIdType(fileElement.getParent_id(), folder.getName(), fileElement.getType());
        if (!folder.getName().equals(fileElement.getName())) {
            if (list.size() > 0) {
                return new ResponseEntity<>(Message.getFailMsg("Folder Name Already Exists"), HttpStatus.OK);
            }
        }

        fileElement.setName(folder.getName());
        fileElement.setDescription(folder.getDescription());
        fileService.update(fileElement);
        Message msg = Message.getSuccessMsg("Update Folder " + folder.getName() + " Success!", fileElement);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    /**
     * delete the selected folder(setDeleted to true)
     * return the parent folder with children (only folder and file)
     */
    @RequestMapping(value = "/admin/files/deleteFolders/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> deleteSelectFolders(@PathVariable String parentId, @RequestBody String[] ids) {
        FileElement parent = fileService.get(parentId);
        FileElement.FileType[] types = {FileElement.FileType.FILE, FileElement.FileType.FOLDER};
        if (parent == null)
            return new ResponseEntity<>(Message.getFailMsg("Delete files failed"), HttpStatus.OK);
        for (String id : ids) {
            FileElement fileElement = fileService.get(id);
            if (fileElement != null) {
                fileElement.setDeleted(true);
                fileService.update(fileElement);
            }
        }
        JsonNode parentz = fileService.loadFolderContainsChildren(parent, types, false);
        return new ResponseEntity<>(Message.getSuccessMsg("Delete files successfully", parentz), HttpStatus.OK);
    }

    /**
     * create a question and add it to the parentId folder
     */
    @RequestMapping(value = "/admin/files/question/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> createQuestionToFolder(@PathVariable String parentId, @RequestBody QuestionFileElement question) {
        if (question.getName() == null || question.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }
        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such parent folder"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }

        question.setDeleted(false);
        question.setLeaf(true);

        List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, question.getName(), question.getType());
        if (list.size() > 0) {
            return new ResponseEntity<>(Message.getFailMsg("Question Already Exists in the same folder"), HttpStatus.OK);
        }
        question.setParent_id(parentId);
        fileService.save(question);
        Message msg = Message.getSuccessMsg("Create Question " + question.getName() + " Under " + parent.getName() + " Success!", question);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    /**
     * update the question
     */
    @RequestMapping(value = "/admin/files/question/{parentId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateQuestion(@PathVariable String parentId, @RequestBody QuestionFileElement question) {

        if (question.getName() == null || question.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }

        FileElement fileElement = fileService.get(question.getId());
        if (fileElement == null) {
            return new ResponseEntity<>(Message.getFailMsg("Question not found"), HttpStatus.OK);
        }

        if (!question.getName().equals(fileElement.getName())) {
            List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, question.getName(), fileElement.getType());
            if (list.size() > 0) {
                return new ResponseEntity<>(Message.getFailMsg("Question Name Already Exists"), HttpStatus.OK);
            }
        }

        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("Parent folder is not existing"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }

        fileService.update(question);
        Message msg = Message.getSuccessMsg("Update question " + question.getName() + " Success!", question);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    /**
     * delete the selected folder(setDeleted to true)
     * return the parent folder with children (only folder and file)
     */
    @RequestMapping(value = "/admin/files/delete/{parentId}/{type}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> deleteSelectedElement(@PathVariable String parentId, @PathVariable FileElement.FileType type, @RequestBody String[] ids) {
        FileElement parent = fileService.get(parentId);
        FileElement.FileType[] types = {type};
        if (parent == null)
            return new ResponseEntity<>(Message.getFailMsg("Delete files failed,No such parent"), HttpStatus.OK);
        for (String id : ids) {
            FileElement fileElement = fileService.get(id);
            if (fileElement != null) {
                fileElement.setDeleted(true);
                fileService.update(fileElement);
            }
        }
        JsonNode parentz = fileService.loadFolderContainsChildren(parent, types, false);
        return new ResponseEntity<>(Message.getSuccessMsg("Delete files successfully", parentz), HttpStatus.OK);
    }

//    getElementBasedOnType: function (parentId,type) {
//        return $http.get('/admin/files/'+parentId+'/'+type)
//                .then(
//                        function (response) {
//            return response.data;
//        },
//        function (err) {
//            return $q.reject(err);
//        }
//        );
//    },

    /**
     * load all elements with type type under parentId
     * will return parent too
     */
    @RequestMapping(value = "/admin/files/{parentId}/{type}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getElementBasedOnType(@PathVariable FileElement.FileType type, @PathVariable String parentId) throws IOException {
        FileElement parent = fileService.get(parentId);
        FileElement.FileType[] types = {type};
        if (parent == null)
            return new ResponseEntity<>(Message.getFailMsg("No such parent folder"), HttpStatus.OK);
        JsonNode parentz = fileService.loadFolderContainsChildren(parent, types, false);
        return new ResponseEntity<>(Message.getSuccessMsg("load " + type + "s successfully", parentz), HttpStatus.OK);
    }

    /**
     * get one specific element
     * /admin/files/'+type+'/'+id
     */
    @RequestMapping(value = "/admin/files/get/{type}/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getOneElement(@PathVariable FileElement.FileType type, @PathVariable String id) throws IOException {
        FileElement element = fileService.get(id);
        if (element == null)
            return new ResponseEntity<>(Message.getFailMsg("No such " + type), HttpStatus.OK);
        return new ResponseEntity<>(Message.getSuccessMsg("load " + type + " successfully", element), HttpStatus.OK);
    }

    /**
     * load questions for file
     * return questions in file's parent folder and questions in file's parent folder's parent folder's and ......
     */
    @RequestMapping(value = "/admin/files/file/getQuestions/{fileId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getQuestionsForFile(@PathVariable String fileId) throws IOException {

        FileElement element = fileService.get(fileId);
        if (element == null)
            return new ResponseEntity<>(Message.getFailMsg("No such file"), HttpStatus.OK);
        List<FileElement> questions = fileService.getQuestionsForFile(element);
        return new ResponseEntity<>(Message.getSuccessMsg("load questions successfully", questions), HttpStatus.OK);
    }

    //'+parentId,file

    /**
     * create a file and add it to the parentId folder
     */
    @RequestMapping(value = "/admin/files/file/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> createFileToFolder(@PathVariable String parentId, @RequestBody FileFileElement file) {
        if (file.getName() == null || file.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }
        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such parent folder"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }

        file.setDeleted(false);
        file.setLeaf(true);

        List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, file.getName(), file.getType());
        if (list.size() > 0) {
            return new ResponseEntity<>(Message.getFailMsg("File Already Exists in the same folder"), HttpStatus.OK);
        }
        file.setParent_id(parentId);
        fileService.save(file);
        Message msg = Message.getSuccessMsg("Create file " + file.getName() + " Under " + parent.getName() + " Success!", file);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }


    /**
     * update the file
     */
    @RequestMapping(value = "/admin/files/file/{parentId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateFile(@PathVariable String parentId, @RequestBody FileFileElement file) {

        if (file.getName() == null || file.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }

        FileElement fileElement = fileService.get(file.getId());
        if (fileElement == null) {
            return new ResponseEntity<>(Message.getFailMsg("File not found"), HttpStatus.OK);
        }

        if (!file.getName().equals(fileElement.getName())) {
            List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, file.getName(), fileElement.getType());
            if (list.size() > 0) {
                return new ResponseEntity<>(Message.getFailMsg("File Name Already Exists"), HttpStatus.OK);
            }
        }

        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("Parent folder is not existing"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }

        fileService.update(file);
        Message msg = Message.getSuccessMsg("Update file " + file.getName() + " Success!", file);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    //

    @Autowired
    WorkFlowService workFlowService;

    @RequestMapping(value = "/admin/files/folder/getFlowOfFolder/{folderId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getWorkFlowOfFolder(@PathVariable String folderId) throws IOException {

        FileElement element = fileService.get(folderId);
        if (element == null)
            return new ResponseEntity<>(Message.getFailMsg("No such folder"), HttpStatus.OK);
        if (!element.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("Not a folder, flow can only be created for a folder"), HttpStatus.OK);
        }
        String wfId = ((FolderFileElement) element).getWorkFlow_id();
        if (wfId == null || wfId.trim().equals("") || workFlowService.get(wfId) == null) {
            WorkFlow workFlow = new WorkFlow();
            workFlow.setName(element.getName() + "_WF");
            workFlow.setDescription(element.getDescription());
            workFlowService.save(workFlow);
            ((FolderFileElement) element).setWorkFlow_id(workFlow.getId());
            fileService.update(element);
            return new ResponseEntity<>(Message.getSuccessMsg("load flow successfully", workFlow), HttpStatus.OK);
        } else {
            WorkFlow workFlow = workFlowService.get(wfId);
            return new ResponseEntity<>(Message.getSuccessMsg("load flow successfully", workFlow), HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/admin/files/folder/{folderId}/flow/getQuestions/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getQuestionsUnderFolderAndChildFolderForFlow(@PathVariable String folderId) {
        FileElement folder = fileService.get(folderId);
        if (folder == null) {
            return new ResponseEntity<Message>(Message.getFailMsg("No such folder"), HttpStatus.OK);
        }
        List<FileElement> list = fileService.getQuestionsForFlow(folder);
        return new ResponseEntity<Message>(Message.getSuccessMsg("load questions successfully", list), HttpStatus.OK);
    }


    @RequestMapping(value = "/admin/files/module/getModulesForUser/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getFolderForSelect() {
        List module = fileService.getModuleForSelect();
        if (module == null)
            return new ResponseEntity<>(Message.getFailMsg("No root folder created, please create root first"), HttpStatus.OK);
        return new ResponseEntity<>(Message.getSuccessMsg("Load Module Successfully", module), HttpStatus.OK);
    }

    @RequestMapping(value = "/admin/files/folder/getCustomizedElement/{folderId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getCustomizedElementsOfFolder(@PathVariable String folderId) throws IOException {

        FileElement element = fileService.get(folderId);
        if (element == null)
            return new ResponseEntity<>(Message.getFailMsg("No such folder"), HttpStatus.OK);
        if (!element.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("Not a folder, flow can only be created for a folder"), HttpStatus.OK);
        }

        FileElement.FileType[] types = {FileElement.FileType.CUSTOMIZED_ELEMENT};

        List ces = fileService.getChildrenByParentIdAndTypes(element.getId(), types, false);
        return new ResponseEntity<>(Message.getSuccessMsg("Load Customized Element Success", ces), HttpStatus.OK);
    }
    @RequestMapping(value = "/admin/files/folder/customizedElement/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> createCustomizedElementToFolder(@PathVariable String parentId, @RequestBody CustomizedElement element) {
        if (element.getName() == null || element.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }
        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such parent folder"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }

        element.setDeleted(false);
        element.setLeaf(true);

        List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, element.getName(), element.getType());
        if (list.size() > 0) {
            return new ResponseEntity<>(Message.getFailMsg("File Already Exists in the same folder"), HttpStatus.OK);
        }
        element.setParent_id(parentId);
        fileService.save(element);
        Message msg = Message.getSuccessMsg("Create file " + element.getName() + " Under " + parent.getName() + " Success!", element);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    /**
     * update the file
     */
    @RequestMapping(value = "/admin/files/folder/customizedElement/{parentId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateCustomizedElement(@PathVariable String parentId, @RequestBody CustomizedElement file) {

        if (file.getName() == null || file.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }

        FileElement fileElement = fileService.get(file.getId());
        if (fileElement == null) {
            return new ResponseEntity<>(Message.getFailMsg("Element not found"), HttpStatus.OK);
        }

        if (!file.getName().equals(fileElement.getName())) {
            List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, file.getName(), fileElement.getType());
            if (list.size() > 0) {
                return new ResponseEntity<>(Message.getFailMsg("Element Name Already Exists"), HttpStatus.OK);
            }
        }

        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("Parent folder is not existing"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }

        fileService.update(file);
        Message msg = Message.getSuccessMsg("Update file " + file.getName() + " Success!", file);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }


    /**
     * create a employee field and add it to the parentId folder
     */
    @RequestMapping(value = "/admin/files/employee_field/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> createEmployeeField(@PathVariable String parentId, @RequestBody EmployeeFieldFileElement employeeFieldFileElement) {
        if (employeeFieldFileElement.getName() == null || employeeFieldFileElement.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }
        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such parent folder"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }

        employeeFieldFileElement.setDeleted(false);
        employeeFieldFileElement.setLeaf(true);

        List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, employeeFieldFileElement.getName(), employeeFieldFileElement.getType());
        if (list.size() > 0) {
            return new ResponseEntity<>(Message.getFailMsg("This Employee Field Already Exists in the same folder"), HttpStatus.OK);
        }
        employeeFieldFileElement.setParent_id(parentId);
        fileService.save(employeeFieldFileElement);
        Message msg = Message.getSuccessMsg("Create employee field " + employeeFieldFileElement.getName() + " Under " + parent.getName() + " Success!", employeeFieldFileElement);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    /**
     * update the employee field
     */
    @RequestMapping(value = "/admin/files/employee_field/{parentId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateEmployeeField(@PathVariable String parentId, @RequestBody EmployeeFieldFileElement employeeFieldFileElement) {

        if (employeeFieldFileElement.getName() == null || employeeFieldFileElement.getName().trim().equals("")) {
            return new ResponseEntity<>(Message.getFailMsg("Name can not be null"), HttpStatus.OK);
        }

        FileElement fileElement = fileService.get(employeeFieldFileElement.getId());
        if (fileElement == null) {
            return new ResponseEntity<>(Message.getFailMsg("Employee field not found"), HttpStatus.OK);
        }

        if (!employeeFieldFileElement.getName().equals(fileElement.getName())) {
            List<FileElement> list = fileService.getFileElementByNameParentIdType(parentId, employeeFieldFileElement.getName(), fileElement.getType());
            if (list.size() > 0) {
                return new ResponseEntity<>(Message.getFailMsg("Employee Field Name Already Exists"), HttpStatus.OK);
            }
        }

        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("Parent folder is not existing"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }

        fileService.update(employeeFieldFileElement);
        Message msg = Message.getSuccessMsg("Update question " + employeeFieldFileElement.getName() + " Success!", employeeFieldFileElement);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }


    /**
     * create a employee field and add it to the parentId folder
     */
    @RequestMapping(value = "/admin/files/employee_report/{parentId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getEmployeeReportOfFolder(@PathVariable String parentId) {
        FileElement parent = fileService.get(parentId);
        if (parent == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such parent folder"), HttpStatus.OK);
        }
        if (!parent.getType().equals(FileElement.FileType.FOLDER)) {
            return new ResponseEntity<>(Message.getFailMsg("parent is not a folder"), HttpStatus.OK);
        }
        FileElement.FileType[] type = {FileElement.FileType.EMPLOYEE_REPORT};
        List list = fileService.getChildrenByParentIdAndTypes(parentId, type, false);
        if(list
                .size()==0){
            FileElement report = new EmployeeReport();
            report.setParent_id(parentId);
            report.setDeleted(false);
            fileService.save(report);
            return new ResponseEntity<>(Message.getSuccessMsg("Load employee report success",report),HttpStatus.OK);

        }else{
            return new ResponseEntity<>(Message.getSuccessMsg("Load employee report success",list.get(0)),HttpStatus.OK);
        }
    }

}

