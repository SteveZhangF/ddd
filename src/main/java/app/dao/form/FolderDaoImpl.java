/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.form;

import app.model.forms.Folder;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/16/15.
 */
@Repository
public class FolderDaoImpl extends HibernateBaseGenericDAOImpl<Folder,String> implements FolderDao {
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public FolderDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(Folder entity) {
        super.delete(entity);
    }

    @Override
    public Folder get(String id) {
        return super.get(id);
    }

    @Override
    public Folder load(String id) {
        return super.load(id);
    }

    @Override
    public List<Folder> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(Folder entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(Folder entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(Folder entity) {
        super.update(entity);
    }

    @Override
    public Folder getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<Folder> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<Folder> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }

    @Override
    public List<Folder> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }

    @Override
    public List<Folder> getListbyFieldAndParams(String[] fields, Map<String, Object> map) {
        return super.getListbyFieldAndParams(fields, map);
    }
}
