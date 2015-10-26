/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.UserWorkFlow;

import app.model.wordflow.WorkFlow;
import app.model.wordflow.workflowUser.UserWorkFlow;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/15/15.
 */
@Repository
public class UserWorkFlowDaoImpl extends HibernateBaseGenericDAOImpl<UserWorkFlow,String> implements UserWorkFlowDao{
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public UserWorkFlowDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(UserWorkFlow entity) {
        super.delete(entity);
    }

    @Override
    public UserWorkFlow get(String id) {
        return super.get(id);
    }

    @Override
    public UserWorkFlow load(String id) {
        return super.load(id);
    }

    @Override
    public List<UserWorkFlow> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(UserWorkFlow entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(UserWorkFlow entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(UserWorkFlow entity) {
        super.update(entity);
    }

    @Override
    public UserWorkFlow getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<UserWorkFlow> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<UserWorkFlow> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }

    @Override
    public List<UserWorkFlow> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }
}
