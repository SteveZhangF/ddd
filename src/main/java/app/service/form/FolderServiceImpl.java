/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.dao.form.FolderDao;
import app.model.forms.Folder;
import app.newService.BaseGenericServiceImpl;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/16/15.
 */
@Service
@Transactional
public class FolderServiceImpl extends BaseGenericServiceImpl<Folder, String> implements FolderService {
    @Autowired
    FolderDao folderDao;

    @Override
    public void delete(Folder entity) {
        folderDao.delete(entity);
    }

    @Override
    public Folder get(String id) {
        return folderDao.get(id);
    }

    @Override
    public Folder load(String id) {
        return folderDao.load(id);
    }

    @Override
    public List<Folder> loadAll() {
        return folderDao.loadAll();
    }

    @Override
    public void save(Folder entity) {
        entity.setCreateTime(new Timestamp(new java.util.Date().getTime()));
        entity.setUpdateTime(new Timestamp(new java.util.Date().getTime()));
        folderDao.save(entity);
    }

    @Override
    public void saveOrUpdate(Folder entity) {
        entity.setCreateTime(new Timestamp(new java.util.Date().getTime()));
        entity.setUpdateTime(new Timestamp(new java.util.Date().getTime()));
        folderDao.saveOrUpdate(entity);
    }

    @Override
    public void update(Folder entity) {
        entity.setUpdateTime(new Timestamp(new java.util.Date().getTime()));
        folderDao.update(entity);
    }

    @Override
    public JsonNode getAllFoldersForTree(String parentId) {
        ObjectMapper mapper = new ObjectMapper();

        Folder folder = get(parentId);
        ArrayNode children = mapper.createArrayNode();
        List<Folder> childrenObjects = getFoldersBasedOnParentId(parentId);

        for (Folder child : childrenObjects) {
            if (child.getDataType() == null) {
                child.setDataType(Folder.FolderDataType.Folder);
            }
            if (child.getDataType().equals(Folder.FolderDataType.CustomizedElement)||child.getDataType().equals(Folder.FolderDataType.Question) || child.getDataType().equals(Folder.FolderDataType.WorkFlow))
                continue;
            children.add(getAllFoldersForTree(child.getId()));
        }
        if (folder != null) {
            ObjectNode node = mapper.valueToTree(folder);
            node.set("children", children);
            return node;
        } else {
            return children;
        }
    }

    @Override
    public List<Folder> getFoldersBasedOnParentId(String parent_id) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("parent_id", parent_id);
        map.put("deleted", false);
        return folderDao.getListbyParams(map);
    }

    @Override
    public Folder addRoot(Folder newFolder) {
        String name = newFolder.getName();
        String description = newFolder.getDescription();
        Folder folder = new Folder();
        folder.setName(name);
        folder.setDescription(description);
        folder.setLeaf(false);
        folder.setParent_id("0");
        folder.setLevel(1);
        folder.setDataType(Folder.FolderDataType.Folder);
        folder.setCreateTime(new Timestamp(new java.util.Date().getTime()));
        save(folder);
        return folder;
    }

    @Override
    public Folder addSubFolder(Folder folder, Folder parent) {
        folder.setLeaf(false);
        folder.setDataType(Folder.FolderDataType.Folder);
        folder.setData_id("0");
        folder.setLevel(parent.getLevel() + 1);
        folder.setParent_id(parent.getId());
        save(folder);
        return folder;
    }

    @Override
    public void deleteFolder(Folder folder) {
        String parentId = folder.getParent_id();
        List<Folder> children = getFoldersBasedOnParentId(folder.getId());
        for (Folder child : children) {
            child.setParent_id(parentId);
            child.setLevel(folder.getLevel());
            update(child);
        }
        folder.setDeleted(true);
        update(folder);
    }

    @Override
    public Folder getFolderByName(String name) {
        name = name.trim();
        return folderDao.getbyParam("name", name);
    }

    @Override
    public List<Folder> getFolderForSelect() {
        String[] fields = {"id", "name"};
        HashMap<String, Object> map = new HashMap<>();
        map.put("parent_id", "0");
        map.put("deleted", false);
        map.put("dataType", Folder.FolderDataType.Folder);
        return folderDao.getListbyFieldAndParams(fields, map);
    }

    @Override
    public List<Folder> getQuestionNodesBasedOnFolderId(String id) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("parent_id", id);
        map.put("dataType", Folder.FolderDataType.Question);
        map.put("deleted", false);
        return folderDao.getListbyParams(map);
    }

    @Override
    public Folder getFlowOfFolder(String folderId) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("parent_id", folderId);
        map.put("dataType", Folder.FolderDataType.WorkFlow);
        map.put("deleted", false);
        List<Folder> list = folderDao.getListbyParams(map);
        if (list.size() == 0) return null;
        else
            return folderDao.getListbyParams(map).get(0);
    }

    @Override
    public List<Folder> listCustomizedNodeBasedOnFolderId(String id) {
        Map<String, Object> map = new HashMap<>();
        map.put("parent_id", id);
        map.put("dataType", Folder.FolderDataType.CustomizedElement);
        map.put("deleted", false);
        return folderDao.getListbyParams(map);
    }
}
