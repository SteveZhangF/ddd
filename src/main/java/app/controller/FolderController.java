///*
// * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
// * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
// * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
// * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
// * Vestibulum commodo. Ut rhoncus gravida arcu.
// */
//
//package app.controller;
//
//import app.model.forms.Folder;
//import app.model.forms.Form;
//import app.model.report.Question;
//import app.model.user.User;
//import app.model.wordflow.WorkFlow;
//import app.service.form.FolderService;
//import app.service.form.FormService;
//import app.service.question.QuestionService;
//import app.service.system.UserService;
//import app.service.workflow.WorkFlowService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.node.ArrayNode;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.IOException;
//import java.util.List;
//
///**
// * Created by steve on 11/16/15.
// */
//@RestController
//public class FolderController {
//
//    @Autowired
//    FolderService folderService;
//
//    //for user
//    @Autowired
//    UserService userService;
//
//    @RequestMapping(value = "/user/folders/getWorkFlowIdByFolderId/{folderId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Folder> getWorkFlowIdByFolderId(@PathVariable String folderId) throws IOException {
//        Folder workFlowFolderNode = folderService.getFlowOfFolder(folderId);
//        return new ResponseEntity<>(workFlowFolderNode, HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/user/folders/getQuestionByFolderNodeId/{folderId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Question> getQuestionByFolerNodeId(@PathVariable String folderId) throws IOException {
//        Folder questionNode = folderService.get(folderId);
//        Question question =questionService.get(Integer.valueOf(questionNode.getData_id()));
//        return new ResponseEntity<>(question, HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/user/folders/{userId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<String> getUserFolderTree(@PathVariable int userId) throws IOException {
//        User user = userService.get(userId);
//        List<Folder> folders = user.getFolders();
//        ObjectMapper mapper = new ObjectMapper();
//        ArrayNode array = mapper.createArrayNode();
//        for (Folder folder : folders) {
//            String tree = folderService.getAllFoldersForTree(folder.getId()).toString();
//            array.add(mapper.readTree(tree));
//        }
//        return new ResponseEntity<>(array.toString(), HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/folder/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<String> getFolderTree(@PathVariable String id) {
//        if (id.equals("0")) {
//            // if the root is not existing, then create one
//            if (folderService.get(id) == null) {
//                Folder folder = new Folder();
//                folder.setName("Root");
//                folder.setLeaf(false);
//                folder.setLevel(0);
//                folder.setDescription("I am a root folder, please don't delete me!");
//                folder.setId("0");
//                folder.setDataType(Folder.FolderDataType.Folder);
//                folderService.save(folder);
//            }
//        }
//        String tree = folderService.getAllFoldersForTree(id).toString();
//        return new ResponseEntity<>(tree, HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/folder/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Folder> saveFolder(@RequestBody Folder folder) {
//        String name = folder.getName();
//        if (folderService.getFolderByName(name) != null)
//            return new ResponseEntity<>(HttpStatus.CONFLICT);
//        else {
//            Folder parent = folderService.get(folder.getParent_id());
//            if (parent != null) {
//                folderService.addSubFolder(folder, parent);
//            } else {
//                //save as a root/child
//                folder.setParent_id("0");
//                folder.setLevel(1);
//                folder.setLeaf(false);
//                folder.setDataType(Folder.FolderDataType.Folder);
//                folderService.save(folder);
//            }
//            return new ResponseEntity<>(HttpStatus.OK);
//        }
//    }
//
//
//    @RequestMapping(value = "/folder/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Folder> updateFolder(@PathVariable String id, @RequestBody Folder folder) {
//        if (folderService.get(id) == null) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//        folderService.update(folder);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/folder/deleteFolders/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Folder> deleteSelectFolders(@RequestBody String[] ids) {
//        for (String id : ids) {
//            Folder folder = folderService.get(id);
//            folderService.deleteFolder(folder);
//        }
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @Autowired
//    FormService formService;
//
//    //
//    @RequestMapping(value = "/folder/addForms/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Folder> addForms(@PathVariable String parentId, @RequestBody int[] ids) {
//        Folder parent = folderService.get(parentId);
//        for (int id : ids) {
//            Form form = formService.get(id);
//            if (form != null) {
//                Folder folder = new Folder();
//                folder.setName(form.getForm_name());
//                folder.setDescription(form.getForm_desc());
//                folder.setLeaf(true);
//                folder.setLevel(parent.getLevel() + 1);
//                folder.setParent_id(parent.getId());
//                folder.setData_id(String.valueOf(form.getId()));
//                folder.setDataType(Folder.FolderDataType.File);
//                folderService.save(folder);
//            }
//
//        }
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    @Autowired
//    QuestionService questionService;
//
//    @RequestMapping(value = "/folder/addQuestions/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Folder> addQuestions(@PathVariable String parentId, @RequestBody int[] ids) {
//        Folder parent = folderService.get(parentId);
//        for (int id : ids) {
//            Question question = questionService.get(id);
//            if (question != null) {
//                Folder folder = new Folder();
//                folder.setName(question.getName());
//                folder.setDescription(question.getDescription());
//                folder.setLeaf(true);
//                folder.setLevel(parent.getLevel() + 1);
//                folder.setParent_id(parent.getId());
//                folder.setData_id(String.valueOf(question.getId()));
//                folder.setDataType(Folder.FolderDataType.Question);
//                folderService.save(folder);
//            }
//        }
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//
//    @RequestMapping(value = "/folder/getFolderForSelect/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<List<Folder>> getFolderForSelect() {
//        List<Folder> list = folderService.getFolderForSelect();
//        return new ResponseEntity<>(list, HttpStatus.OK);
//    }
//
//
//    @RequestMapping(value = "/folder/getQuestions/{parentId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<List<Folder>> getQuestionNodesBasedOnFolderId(@PathVariable String parentId) {
//        List<Folder> list = folderService.getQuestionNodesBasedOnFolderId(parentId);
//        return new ResponseEntity<>(list, HttpStatus.OK);
//    }
//
//    @Autowired
//    WorkFlowService workFlowService;
//
//    @RequestMapping(value = "/folder/getFlowOfFolder/{folderId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Folder> getFlowOfFolder(@PathVariable String folderId) {
//
//        Folder workFlowFolderNode = folderService.getFlowOfFolder(folderId);
//        Folder folder = folderService.get(folderId);
//        if (folder == null) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//        if (workFlowFolderNode == null) {
//            WorkFlow workFlow = new WorkFlow();
//            workFlow.setName(folder.getName() + "_" + folderId);
//            workFlow.setDescription(folder.getDescription());
//            workFlowService.save(workFlow);
//            workFlowFolderNode = new Folder();
//            workFlowFolderNode.setDeleted(false);
//            workFlowFolderNode.setName("_WF" + folder.getName());
//            workFlowFolderNode.setDataType(Folder.FolderDataType.WorkFlow);
//            workFlowFolderNode.setLeaf(false);
//            workFlowFolderNode.setDescription(folder.getDescription());
//            workFlowFolderNode.setLevel(folder.getLevel() + 1);
//            workFlowFolderNode.setData_id(workFlow.getId());
//            workFlowFolderNode.setParent_id(folderId);
//            folderService.save(workFlowFolderNode);
//        }
//        return new ResponseEntity<>(workFlowFolderNode, HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/folder/getQuestionDataByFolderId/{folderId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Question> getQuestionDataBasedOnQuestionNodeId(@PathVariable String folderId) {
//        Folder folder = folderService.get(folderId);
//        Question question = questionService.get(Integer.valueOf(folder.getData_id()));
//        return new ResponseEntity<>(question, HttpStatus.OK);
//    }
//}
