/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.model.forms.Folder;
import app.model.forms.Form;
import app.newService.IBaseGenericService;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

/**
 * Created by steve on 11/16/15.
 */
public interface FolderService extends IBaseGenericService<Folder, String> {
    JsonNode getAllFoldersForTree(String parentId);
    List<Folder> getFoldersBasedOnParentId(String parent_id);

    Folder addRoot(Folder folder);

    Folder addSubFolder(Folder folder,Folder parent);

    void deleteFolder(Folder folder);

    Folder getFolderByName(String name);

    List<Folder> getFolderForSelect();

    List<Folder> getQuestionNodesBasedOnFolderId(String id);

    Folder getFlowOfFolder(String folderId);

    List<Folder> listCustomizedNodeBasedOnFolderId(String id);

}
