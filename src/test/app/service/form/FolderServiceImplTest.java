/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.model.forms.Folder;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.util.List;

/**
 * Created by steve on 11/16/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)

public class FolderServiceImplTest {

    @Autowired
    FolderService folderService;

    @Test
    public void testGetFoldersForTree() throws Exception {
        System.out.println(folderService.loadAll().size());
    }

    @Test
    public void testDeleteFolder() throws Exception{
        Folder folder = folderService.get("40288085510f412901510f412fe70000");
        folderService.deleteFolder(folder);
        testGetFoldersForTree();
    }

    @Test
    public void testGetAllFoldersForTree() throws Exception{
        JsonNode node = folderService.getAllFoldersForTree("0");
        System.out.print(node);
    }

    @Test
    public void testGetFoldersBasedOnParentId() throws Exception {
        String parentId = "40288085510f412901510f412fe70000";
        List<Folder> list = folderService.getFoldersBasedOnParentId(parentId);
        System.out.println(list.size());
    }

    @Test
    public void testSave() throws Exception {
        Folder folder = new Folder();
        folder.setName("Root2");
        folder.setDescription("Hi,This is a root");

        folder = folderService.addRoot(folder);


        Folder subFolder = new Folder();
        subFolder.setName("child1");
        subFolder.setDescription("this is a child node");

        folderService.addSubFolder(subFolder, folder);

        Folder subFolder2 = new Folder();
        subFolder2.setName("child2");
        subFolder2.setDescription("another child node");
        folderService.addSubFolder(subFolder2, folder);

    }
}