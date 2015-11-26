/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.files;

import app.model.files.FileElement;
import app.newDao.IBaseGenericDAO;

import java.util.List;

/**
 * Created by steve on 11/23/15.
 */
public interface FileDao extends IBaseGenericDAO<FileElement, String> {
    FileElement loadTreeBasedOnNodeId(String id);

    List<FileElement> getChildrenByParentIdAndTypes(String parentId, FileElement.FileType[] type,boolean deleted);
}
