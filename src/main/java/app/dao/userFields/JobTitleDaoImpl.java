/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.userFields;

import app.model.userfield.JobTitle;
import app.model.wordflow.workflowUser.UserWorkFlow;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/10/15.
 */
@Repository
public class JobTitleDaoImpl extends HibernateBaseGenericDAOImpl<JobTitle,String> implements JobTitleDao{
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public JobTitleDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(JobTitle entity) {
        super.delete(entity);
    }

    @Override
    public JobTitle get(String id) {
        return super.get(id);
    }

    @Override
    public JobTitle load(String id) {
        return super.load(id);
    }

    @Override
    public List<JobTitle> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(JobTitle entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(JobTitle entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(JobTitle entity) {
        super.update(entity);
    }

    @Override
    public JobTitle getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<JobTitle> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<JobTitle> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }

    @Override
    public List<JobTitle> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }

    @Override
    public List<JobTitle> getListbyFieldAndParams(String[] fields, Map<String, Object> map) {
        return super.getListbyFieldAndParams(fields, map);
    }
}
