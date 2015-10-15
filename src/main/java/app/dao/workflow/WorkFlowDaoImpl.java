/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.workflow;

import app.model.form.FormTable;
import app.model.wordflow.WorkFlow;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by steve on 10/12/15.
 */
@Repository
public class WorkFlowDaoImpl extends HibernateBaseGenericDAOImpl<WorkFlow,String> implements WorkFlowDao {

   @Autowired
    public WorkFlowDaoImpl(SessionFactory sessionFactory){
       super(sessionFactory);
    }

    @Override
    public void delete(WorkFlow entity) {
        super.delete(entity);
    }

    @Override
    public WorkFlow get(String id) {
        return super.get(id);
    }

    @Override
    public WorkFlow load(String id) {
        return super.load(id);
    }

    @Override
    public List<WorkFlow> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(WorkFlow entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(WorkFlow entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(WorkFlow entity) {
        super.update(entity);
    }
}
