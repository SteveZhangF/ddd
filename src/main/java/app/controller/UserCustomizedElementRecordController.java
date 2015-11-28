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
import app.model.files.FolderFileElement;
import app.model.forms.CustomizedElement;
import app.model.forms.CustomizedElementRecord;
import app.model.forms.CustomizedElementRecordValue;
import app.model.user.User;
import app.service.file.FileService;
import app.service.form.CustomizedElementRecordService;
import app.service.form.CustomizedElementService;
import app.service.system.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 11/22/15.
 */
@RestController
public class UserCustomizedElementRecordController {

    @Autowired
    CustomizedElementRecordService customizedElementRecordService;
    @Autowired
    CustomizedElementService customizedElementService;

    //    /user/'+userId+'/customizedElementMenu/'
    @Autowired
    UserService userService;
    @Autowired
    FileService fileService;

    /**
     * load all the user's customized element types
     */
    @RequestMapping(value = "/user/{userId}/customizedElementMenu/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> loadCustomizedElementMenus(@PathVariable int userId) {
        User user = userService.get(userId);
        List<FolderFileElement> folders = user.getFolders();
        List<FileElement> menus = new ArrayList<>();
        FileElement.FileType[] types = {FileElement.FileType.CUSTOMIZED_ELEMENT};
        for (FileElement folder : folders) {
            List<FileElement> customizedElementNodes = fileService.getChildrenByParentIdAndTypes(folder.getId(), types, false);
            menus.addAll(customizedElementNodes);
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load customized elements success!", menus), HttpStatus.OK);
    }

    /**
     * load the customized elements records of specific element
     */
    @RequestMapping(value = "/user/{userId}/customizedElementRecord/{customizedElementId}/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> listCustomizedElementRecordByUserIdAndElementId(@PathVariable int userId,
                                                                                   @PathVariable String customizedElementId
    ) {

        FileElement customizedElement = fileService.get(customizedElementId);
        if (customizedElement == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such customized element"), HttpStatus.OK);
        }

        if (!customizedElement.getType().equals(FileElement.FileType.CUSTOMIZED_ELEMENT)) {
            return new ResponseEntity<>(Message.getFailMsg("Not a customized element"), HttpStatus.OK);
        }
        CustomizedElement customizedElement1 = (CustomizedElement) customizedElement;
        List<CustomizedElementRecord> list = customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElement1);
        return new ResponseEntity<>(Message.getSuccessMsg("Load record success", list), HttpStatus.OK);
    }

    /**
     * add a new record of customized element id
     */
    @RequestMapping(value = "/user/{userId}/customizedElementRecord/{customizedElementId}/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> createCustomizedElementRecord(@PathVariable int userId,
                                                                 @PathVariable String customizedElementId
            , @RequestBody List<CustomizedElementRecordValue> values
    ) {
        FileElement fileElement = fileService.get(customizedElementId);
        if (!fileElement.getType().equals(FileElement.FileType.CUSTOMIZED_ELEMENT)) {
            return new ResponseEntity<>(Message.getFailMsg("Not a customized element"), HttpStatus.OK);
        }
        CustomizedElement customizedElement = (CustomizedElement) fileElement;

        customizedElementRecordService.createCustomizedElementRecord(userId, customizedElement, values);
        List<CustomizedElementRecord> list = customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElement);
        return new ResponseEntity<>(Message.getSuccessMsg("Create record success", list), HttpStatus.OK);
    }

    /**
     * update the record
     */
    @RequestMapping(value = "/user/{userId}/customizedElementRecord/{customizedElementId}/", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateCustomizedElementRecord(@PathVariable int userId,
                                                                 @PathVariable String customizedElementId
            , @RequestBody CustomizedElementRecord record
    ) {
        FileElement fileElement = fileService.get(customizedElementId);
        if (!fileElement.getType().equals(FileElement.FileType.CUSTOMIZED_ELEMENT)) {
            return new ResponseEntity<>(Message.getFailMsg("Not a customized element"), HttpStatus.OK);
        }
        CustomizedElement customizedElement = (CustomizedElement) fileElement;
        CustomizedElementRecord record1 = customizedElementRecordService.get(record.getId());
        if (record1 == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such record for " + customizedElement.getName()), HttpStatus.OK);
        }
        record1.setDeleted(false);
        record1.setCustomizedElement(customizedElement);
        record1.setValues(record.getValues());
        record1.setUserId(userId);
        record1.setCompanyId(record.getCompanyId());
        customizedElementRecordService.update(record1);

        List<CustomizedElementRecord> list = customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElement);
        return new ResponseEntity<>(Message.getSuccessMsg("Update record success", list), HttpStatus.OK);
    }

    /**
     * delete the record (set deleted to false)
     */
    @RequestMapping(value = "/user/{userId}/customizedElementRecord/{customizedElementId}/{recordId}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> deleteCustomizedElement(@PathVariable int userId,
                                                           @PathVariable String customizedElementId
            , @PathVariable String recordId
    ) {
        FileElement fileElement = fileService.get(customizedElementId);
        if (!fileElement.getType().equals(FileElement.FileType.CUSTOMIZED_ELEMENT)) {
            return new ResponseEntity<>(Message.getFailMsg("Not a customized element"), HttpStatus.OK);
        }

        CustomizedElement customizedElement = (CustomizedElement) fileElement;
        CustomizedElementRecord record1 = customizedElementRecordService.get(recordId);
        if (record1 == null) {
            return new ResponseEntity<>(Message.getFailMsg("No such record for " + customizedElement.getName()), HttpStatus.OK);
        }
        record1.setDeleted(true);
        customizedElementRecordService.update(record1);
        List<CustomizedElementRecord> list = customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElement);
        return new ResponseEntity<>(Message.getSuccessMsg("Update record success", list), HttpStatus.OK);
    }


}
