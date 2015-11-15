/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.form;

import app.model.forms.TableForm;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/12/15.
 */
@Repository
public class TableFormDaoImpl extends HibernateBaseGenericDAOImpl<TableForm,String> implements TableFormDao {


    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public TableFormDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(TableForm entity) {
        super.delete(entity);
    }

    @Override
    public TableForm get(String id) {
        return super.get(id);
    }

    @Override
    public TableForm load(String id) {
        return super.load(id);
    }

    @Override
    public List<TableForm> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(TableForm entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(TableForm entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(TableForm entity) {
        super.update(entity);
    }

    @Override
    public TableForm getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<TableForm> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<TableForm> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }

    @Override
    public List<TableForm> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }

    @Override
    public List<TableForm> getListbyFieldAndParams(String[] fields, Map<String, Object> map) {
        return super.getListbyFieldAndParams(fields, map);
    }
}
