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
import java.util.List;

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
            children.add(getAllFoldersForTree(child.getId()));
        }
        if(folder!=null){
            ObjectNode node = mapper.valueToTree(folder);
            node.set("children",children);
            return node;
        }else{
            return children;
        }
    }

    @Override
    public List<Folder> getFoldersBasedOnParentId(String parent_id) {
        return folderDao.getListbyParam("parent_id", parent_id);
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
        folder.setCreateTime(new Timestamp(new java.util.Date().getTime()));
        folderDao.save(folder);
        return folder;
    }

    @Override
    public Folder addSubFolder(Folder folder, Folder parent) {
        folder.setLeaf(false);

        folder.setLevel(parent.getLevel() + 1);
        folder.setParent_id(parent.getId());
        folderDao.save(folder);
        return folder;
    }

    @Override
    public void deleteFolder(Folder folder){
        String parentId = folder.getParent_id();
        List<Folder> children = getFoldersBasedOnParentId(folder.getId());
        for(Folder child: children){
            child.setParent_id(parentId);
            child.setLevel(folder.getLevel());
            update(child);
        }
        delete(folder);
    }

    @Override
    public Folder getFolderByName(String name){
        name = name.trim();
        return folderDao.getbyParam("name",name);
    }
}
