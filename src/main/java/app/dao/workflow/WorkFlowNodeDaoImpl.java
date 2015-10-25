/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.workflow;

import app.model.wordflow.WorkFlowNode;
import app.newDao.HibernateBaseGenericDAOImpl;
import app.newDao.IBaseGenericDAO;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by steve on 10/24/15.
 */
@Repository
public class WorkFlowNodeDaoImpl extends HibernateBaseGenericDAOImpl<WorkFlowNode,String> implements  WorkFlowNodeDao{

    /**
     * @param sessionFactory
     */
    @Autowired
    public WorkFlowNodeDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(WorkFlowNode entity) {
        super.delete(entity);
    }

    @Override
    public WorkFlowNode get(String id) {
        return super.get(id);
    }

    @Override
    public WorkFlowNode load(String id) {
        return super.load(id);
    }

    @Override
    public List<WorkFlowNode> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(WorkFlowNode entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(WorkFlowNode entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(WorkFlowNode entity) {
        super.update(entity);
    }

    @Override
    public WorkFlowNode getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<WorkFlowNode> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<WorkFlowNode> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }
}
