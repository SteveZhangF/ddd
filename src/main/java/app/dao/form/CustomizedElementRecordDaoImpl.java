/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.form;

import app.model.forms.CustomizedElementRecord;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/22/15.
 */
@Repository
public class CustomizedElementRecordDaoImpl extends HibernateBaseGenericDAOImpl<CustomizedElementRecord,String> implements CustomizedElementRecordDao {
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public CustomizedElementRecordDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(CustomizedElementRecord entity) {
        super.delete(entity);
    }

    @Override
    public CustomizedElementRecord get(String id) {
        return super.get(id);
    }

    @Override
    public CustomizedElementRecord load(String id) {
        return super.load(id);
    }

    @Override
    public List<CustomizedElementRecord> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(CustomizedElementRecord entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(CustomizedElementRecord entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(CustomizedElementRecord entity) {
        super.update(entity);
    }

    @Override
    public CustomizedElementRecord getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<CustomizedElementRecord> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<CustomizedElementRecord> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }

    @Override
    public List<CustomizedElementRecord> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }

    @Override
    public List<CustomizedElementRecord> getListbyFieldAndParams(String[] fields, Map<String, Object> map) {
        return super.getListbyFieldAndParams(fields, map);
    }
}
