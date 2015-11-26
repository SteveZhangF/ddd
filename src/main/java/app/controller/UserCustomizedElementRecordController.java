/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.files.FileElement;
import app.model.files.FolderFileElement;
import app.model.forms.CustomizedElement;
import app.model.forms.CustomizedElementRecord;
import app.model.forms.CustomizedElementRecordValue;
import app.model.forms.Folder;
import app.model.user.User;
import app.service.form.CustomizedElementRecordService;
import app.service.form.CustomizedElementService;
import app.service.form.FolderService;
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
    FolderService folderService;

    @RequestMapping(value = "/user/{userId}/customizedElementMenu/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CustomizedElement>> loadCustomizedElementMenus(@PathVariable int userId) {
        User user = userService.get(userId);
        List<FolderFileElement> folders = user.getFolders();
        List<CustomizedElement> menus = new ArrayList<>();
        for(FileElement folder:folders){
            List<Folder> customizedElementNodes = folderService.listCustomizedNodeBasedOnFolderId(folder.getId());
            for(Folder customizedElementNode : customizedElementNodes){
                CustomizedElement customizedElement = customizedElementService.get(customizedElementNode.getData_id());
                menus.add(customizedElement);
            }
        }
        return new ResponseEntity<>(menus, HttpStatus.OK);
    }

    @RequestMapping(value = "/user/{userId}/customizedElementRecord/{customizedElementId}/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CustomizedElementRecord>> listCustomizedElementRecordByUserIdAndElementId(@PathVariable int userId,
                                                                                                         @PathVariable String customizedElementId
    ) {

        CustomizedElement customizedElement = customizedElementService.get(customizedElementId);
        List<CustomizedElementRecord> list = customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElement);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @RequestMapping(value = "/user/{userId}/customizedElementRecord/{customizedElementId}/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CustomizedElementRecord>> createCustomizedElementRecord(@PathVariable int userId,
                                                                                       @PathVariable String customizedElementId
            , @RequestBody List<CustomizedElementRecordValue> values
    ) {
        CustomizedElement customizedElement = customizedElementService.get(customizedElementId);
        customizedElementRecordService.createCustomizedElementRecord(userId, customizedElement, values);
        List<CustomizedElementRecord> list = customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElement);

        return new ResponseEntity<>(list,HttpStatus.OK);
    }


    @RequestMapping(value = "/user/{userId}/customizedElementRecord/{customizedElementId}/", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CustomizedElementRecord>> updateCustomizedElementRecord(@PathVariable int userId,
                                                                                       @PathVariable String customizedElementId
            , @RequestBody CustomizedElementRecord record
    ) {
        customizedElementRecordService.update(record);
        CustomizedElement customizedElement = customizedElementService.get(customizedElementId);
        List<CustomizedElementRecord> list = customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(userId, customizedElement);
        return new ResponseEntity<>(list,HttpStatus.OK);
    }

}
