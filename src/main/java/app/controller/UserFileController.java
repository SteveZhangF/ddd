/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.message.Message;
import app.model.files.FileElement;
import app.model.files.FileFileElement;
import app.model.files.FolderFileElement;
import app.model.user.User;
import app.model.wordflow.WorkFlow;
import app.service.file.FileService;
import app.service.system.UserService;
import app.service.workflow.WorkFlowService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 11/25/15.
 */
@RestController
public class UserFileController {

    //
    @Autowired
    UserService userService;
    @Autowired
    FileService fileService;

    //get user's folders
    @RequestMapping(value = "/user/folders/{userId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getUserFolderTree(@PathVariable int userId) throws IOException {
        User user = userService.get(userId);
        List<FolderFileElement> folders = user.getFolders();
        FileElement.FileType[] type = {FileElement.FileType.FOLDER, FileElement.FileType.FILE};
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode array = mapper.createArrayNode();
        for (FileElement folder : folders) {
            JsonNode foNode = fileService.loadFolderContainsChildren(folder, type, false);
            array.add(foNode);
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load folders success", array), HttpStatus.OK);
    }

    //get one specific element
    @RequestMapping(value = "/user/folders/get/{type}/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getOneElement(@PathVariable FileElement.FileType type, @PathVariable String id) throws IOException {
        FileElement element = fileService.get(id);
        if (element == null)
            return new ResponseEntity<>(Message.getFailMsg("No such " + type), HttpStatus.OK);
        return new ResponseEntity<>(Message.getSuccessMsg("load " + type + " successfully", element), HttpStatus.OK);
    }

    @Autowired
    WorkFlowService workFlowService;

    //get one flow of folder
    @RequestMapping(value = "/user/folders/folder/FLOW/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getFlowOfFolder(@PathVariable String id) throws IOException {
        FileElement element = fileService.get(id);
        if (element == null)
            return new ResponseEntity<>(Message.getFailMsg("No such folder found"), HttpStatus.OK);
        if (element.getType().equals(FileElement.FileType.FOLDER)) {
            String flowId = ((FolderFileElement) element).getWorkFlow_id();
            WorkFlow flow = null;
            if (flowId == null || (flow = workFlowService.get(flowId)) == null) {
                return new ResponseEntity<Message>(Message.getFailMsg("No flows for the folder " + element.getName()), HttpStatus.OK);
            }
            return new ResponseEntity<>(Message.getSuccessMsg("load flow for " + element.getName() + " successfully", flow), HttpStatus.OK);

        } else {
            return new ResponseEntity<>(Message.getFailMsg("No such folder found"), HttpStatus.OK);
        }

    }

    /**
     * get customized employee fields of userId
     */
    @RequestMapping(value = "/user/folders/file/employee_reports/{userId}", method = RequestMethod.GET)
    public ResponseEntity<Message> getUserEmployeeReports(@PathVariable int userId) {
        User user = userService.get(userId);
        if (user == null) {
            return new ResponseEntity<>(Message.getFailMsg("Load User Failed"), HttpStatus.OK);
        }
        FileElement.FileType[] type = {FileElement.FileType.FILE};
        List<FolderFileElement> folders = user.getFolders();
        List<FileElement> result = new ArrayList<>();
        for (FolderFileElement folder : folders) {
            List<FileElement> list = fileService.getChildrenByParentIdAndTypes(folder.getId(), type, false);
            for (FileElement fileElement : list) {
                if (((FileFileElement) fileElement).getFileType().equals(FileFileElement.FileFileType.EmployeeReport)) {
                    result.add(fileElement);
                }
            }
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load fields success!", result), HttpStatus.OK);
    }


}
