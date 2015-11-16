/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.forms.Folder;
import app.model.forms.Form;
import app.service.form.FolderService;
import app.service.form.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Created by steve on 11/16/15.
 */
@RestController
public class FolderController {

    @Autowired
    FolderService folderService;

    @RequestMapping(value = "/folder/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getFolderTree(@PathVariable String id) {
        if (id.equals("0")) {
            // if the root is not existing, then create one
            if (folderService.get(id) == null) {
                Folder folder = new Folder();
                folder.setName("Root");
                folder.setLeaf(false);
                folder.setLevel(0);
                folder.setDescription("I am a root folder, please don't delete me!");
                folder.setId("0");
                folderService.save(folder);
            }
        }
        String tree = folderService.getAllFoldersForTree(id).toString();
        return new ResponseEntity<>(tree, HttpStatus.OK);
    }

    @RequestMapping(value = "/folder/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Folder> saveFolder(@RequestBody Folder folder) {
        String name = folder.getName();
        if (folderService.getFolderByName(name) != null)
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        else {
            Folder parent = folderService.get(folder.getParent_id());
            if (parent != null) {
                folderService.addSubFolder(folder, parent);
            } else {
                //save as a root
                folder.setParent_id("0");
                folder.setLevel(1);
                folder.setLeaf(false);
                folderService.save(folder);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }


    @RequestMapping(value = "/folder/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Folder> updateFolder(@PathVariable String id, @RequestBody Folder folder) {
        if (folderService.get(id) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        folderService.update(folder);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/folder/deleteFolders/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Folder> deleteSelectFolders(@RequestBody String[] ids) {
        for (String id : ids) {
            Folder folder = folderService.get(id);
            folderService.deleteFolder(folder);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Autowired
    FormService formService;
    //
    @RequestMapping(value = "/folder/addForms/{parentId}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Folder> addForms(@PathVariable String parentId,@RequestBody int[] ids) {
        Folder parent = folderService.get(parentId);
        for (int id : ids) {
            Form form = formService.get(id);
            if(form!=null){
                Folder folder = new Folder();
                folder.setName(form.getForm_name());
                folder.setDescription(form.getForm_desc());
                folder.setLeaf(true);
                folder.setLevel(parent.getLevel() + 1);
                folder.setParent_id(parent.getId());
                folder.setForm_id(form.getId());
                folderService.save(folder);
            }

        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
