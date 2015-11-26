/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.file;

import app.model.files.FileElement;
import app.newService.IBaseGenericService;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.File;
import java.util.List;

/**
 * Created by steve on 11/23/15.
 */
public interface FileService extends IBaseGenericService<FileElement, String> {
    JsonNode loadAllFolderTree();

    List<FileElement> getFileElementByNameParentIdType(String parentId, String name, FileElement.FileType type);

    JsonNode loadFolderContainsChildren(FileElement folder,FileElement.FileType[] types,boolean deleted);

    List<FileElement> getFoldersBasedOnParent(FileElement parent);

    List<FileElement> getChildrenByParentIdAndTypes(String parentId,FileElement.FileType[] type,boolean deleted);

    List<FileElement> getQuestionsForFile(FileElement fileElement);
    List<FileElement> getQuestionsForFlow(FileElement fileElement);

    List<FileElement> getModuleForSelect();
}
