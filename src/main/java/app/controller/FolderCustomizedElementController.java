/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.forms.CustomizedElement;
import app.model.forms.Folder;
import app.service.form.CustomizedElementService;
import app.service.form.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by steve on 11/21/15.
 */
@RestController
public class FolderCustomizedElementController {
    //for user
    @Autowired
    FolderService folderService;
    @Autowired
    CustomizedElementService customizedElementService;


    @RequestMapping(value = "/folder/{folderId}/customizedElement/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Folder>> listCustomizedElementByFolderId(@PathVariable String folderId) throws IOException {
        Folder folder = folderService.get(folderId);
        if (folder == null) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
        List list = folderService.listCustomizedNodeBasedOnFolderId(folderId);
        return new ResponseEntity<List<Folder>>(list, HttpStatus.OK);
    }

    @RequestMapping(value = "/folder/{folderId}/customizedElement/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Folder> saveCustomizedElementToFolder(@PathVariable String folderId, @RequestBody CustomizedElement customizedElement) throws IOException {
        Folder parentFolder = folderService.get(folderId);
        if (parentFolder == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        customizedElementService.save(customizedElement);
        Folder customizedElementFolderNode = new Folder();
        customizedElementFolderNode.setName(customizedElement.getName());
        customizedElementFolderNode.setDescription(customizedElement.getDescription());
        customizedElementFolderNode.setLeaf(true);
        customizedElementFolderNode.setLevel(parentFolder.getLevel() + 1);
        customizedElementFolderNode.setDataType(Folder.FolderDataType.CustomizedElement);
        customizedElementFolderNode.setParent_id(folderId);
        customizedElementFolderNode.setData_id(customizedElement.getId());
        folderService.save(customizedElementFolderNode);
        return new ResponseEntity<Folder>(customizedElementFolderNode, HttpStatus.OK);
    }

    @RequestMapping(value = "/customizedElement/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CustomizedElement> getCustomizedElementById(@PathVariable String id) throws IOException {
        CustomizedElement customizedElement = customizedElementService.get(id);
        return new ResponseEntity<>(customizedElement, HttpStatus.OK);
    }

    @RequestMapping(value = "/folder/{folderId}/customizedElement/{folderNodeId}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Folder> updateCustomizedElementInFolder(@PathVariable String folderId, @PathVariable String folderNodeId, @RequestBody CustomizedElement customizedElement) throws IOException {
        Folder folder = folderService.get(folderNodeId);
        folder.setDescription(customizedElement.getDescription());
        folder.setName(customizedElement.getName());
        folderService.update(folder);
        customizedElementService.update(customizedElement);
        return new ResponseEntity<>(folder, HttpStatus.OK);
    }

    //    /folder/' + folderId + '/customizedElement/delete/
    //delete selected ids, and return the customized element nodes under parent folder
    @RequestMapping(value = "/folder/{parent_folder_id}/customizedElement/delete/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Folder>> deleteSelectedCustomizedElementFolderNode(@PathVariable String parent_folder_id,@RequestBody String[] deleteIds) throws IOException {
        for(String id: deleteIds){
            Folder folder = folderService.get(id);
            if(folder!=null){
                folder.setDeleted(true);
                folderService.update(folder);
            }
        }
        List list = folderService.listCustomizedNodeBasedOnFolderId(parent_folder_id);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
