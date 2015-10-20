/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.form;

import app.model.forms.Form;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by steve on 10/12/15.
 */
@Repository
public class FormDaoImpl extends HibernateBaseGenericDAOImpl<Form,Integer> implements FormDao{

   @Autowired
    public FormDaoImpl(SessionFactory sessionFactory){
       super(sessionFactory);
    }

    @Override
    public void delete(Form entity) {
        super.delete(entity);
    }

    @Override
    public Form get(Integer id) {
        return super.get(id);
    }

    @Override
    public Form load(Integer id) {
        return super.load(id);
    }

    @Override
    public List<Form> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(Form entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(Form entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(Form entity) {
        super.update(entity);
    }
}
