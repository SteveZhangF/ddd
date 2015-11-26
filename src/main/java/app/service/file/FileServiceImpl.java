/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.file;

import app.dao.files.FileDao;
import app.model.files.FileElement;
import app.model.files.FolderFileElement;
import app.newService.BaseGenericServiceImpl;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/23/15.
 */
@Service
@Transactional
public class FileServiceImpl extends BaseGenericServiceImpl<FileElement, String> implements FileService {
    @Autowired
    FileDao fileDao;

    @Override
    public void delete(FileElement entity) {
        fileDao.delete(entity);
    }

    @Override
    public FileElement get(String id) {
        return fileDao.get(id);
    }

    @Override
    public FileElement load(String id) {
        return fileDao.load(id);
    }

    @Override
    public List<FileElement> loadAll() {
        return fileDao.loadAll();
    }

    @Override
    public void save(FileElement entity) {
        entity.setCreateTime(new Timestamp(new java.util.Date().getTime()));
        entity.setUpdateTime(new Timestamp(new java.util.Date().getTime()));
        fileDao.save(entity);
    }

    @Override
    public void saveOrUpdate(FileElement entity) {
        fileDao.saveOrUpdate(entity);
    }

    @Override
    public void update(FileElement entity) {
        entity.setUpdateTime(new Timestamp(new java.util.Date().getTime()));
        fileDao.update(entity);
    }


    public JsonNode loadFolderContainsChildren(FileElement folder, FileElement.FileType[] types, boolean deleted) {
//        List<FileElement> childrenObjects = getChildrenByParentIdAndTypes(folder.getId(),type,false);
//        childrenObjects.forEach(this::loadFolderContainsChildren);
//        folder.setChildren(childrenObjects);

        ObjectMapper mapper = new ObjectMapper();
        ArrayNode children = mapper.createArrayNode();
        List<FileElement> childrenObjects = getChildrenByParentIdAndTypes(folder.getId(), types, deleted);
        for (FileElement child : childrenObjects) {
            children.add(loadFolderContainsChildren(child, types, deleted));
        }
        if (folder != null) {
            ObjectNode node = mapper.valueToTree(folder);
            node.set("children", children);
            return node;
        } else {
            return children;
        }
    }

    public List<FileElement> getFoldersBasedOnParent(FileElement parent) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("parent_id", parent.getId());
        map.put("deleted", false);
        return fileDao.getListbyParams(map);
    }

    @Override
    public JsonNode loadAllFolderTree() {
        FileElement.FileType[] types = {FileElement.FileType.FILE, FileElement.FileType.FOLDER};
        FileElement root = fileDao.getbyParam("root", true);
        if (root == null) {
            root = new FolderFileElement();
            root.setDeleted(false);
            root.setLeaf(false);
            root.setParent_id(null);
            root.setName("ROOT");
            root.setDescription("This is a root folder, please do not modify it");
            root.setLevel(0);
            root.setRoot(true);
            fileDao.save(root);
        }
        return loadFolderContainsChildren(root, types, false);
    }


    @Override
    public List<FileElement> getFileElementByNameParentIdType(String parentId, String name, FileElement.FileType type) {
        Map<String, Object> map = new HashMap<>();
        map.put("parent_id", parentId);
        map.put("name", name);
        map.put("type", type);
        map.put("deleted", false);
        List list = fileDao.getListbyParams(map);
        return list;
    }

    @Override
    public List<FileElement> getChildrenByParentIdAndTypes(String parentId, FileElement.FileType[] type, boolean deleted) {
        return fileDao.getChildrenByParentIdAndTypes(parentId, type, deleted);
    }

    @Override
    public List<FileElement> getQuestionsForFile(FileElement fileElement) {
        FileElement.FileType[] type = {FileElement.FileType.QUESTION};
        List<FileElement> questions = getChildrenByParentIdAndTypes(fileElement.getId(), type, false);

        if (fileElement.getParent_id() != null) {
            FileElement parent = get(fileElement.getParent_id());
            if (parent != null) {
                questions.addAll(getQuestionsForFile(parent));
            }
        }
        return questions;
    }


    /**
     * @param fileElement
     * @return
     */
    @Override
    public List<FileElement> getQuestionsForFlow(FileElement fileElement) {
        FileElement.FileType[] type = {FileElement.FileType.QUESTION, FileElement.FileType.FOLDER};
        List<FileElement> questionsAndChildFolder = getChildrenByParentIdAndTypes(fileElement.getId(), type, false);
        List<FileElement> questions = new ArrayList<>();
        for (FileElement child : questionsAndChildFolder) {
            if (child.getType().equals(FileElement.FileType.FOLDER)) {
                questions.addAll(getQuestionsForFlow(child));
            } else {
                questions.add(child);
            }
        }
        return questions;
    }

    @Override
    public List<FileElement> getModuleForSelect() {
        FileElement fileElement = fileDao.getbyParam("root", true);
        if (fileElement == null) return null;
        FileElement.FileType[] type = {FileElement.FileType.FOLDER};
        List list = fileDao.getChildrenByParentIdAndTypes(fileElement.getId(), type,false);
        return list;
    }
}

