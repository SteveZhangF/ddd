/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.question;

import app.model.report.Question;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by steve on 10/18/15.
 */
@Repository
public class QuestionDaoImpl extends HibernateBaseGenericDAOImpl<Question,Integer> implements QuestionDao {
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public QuestionDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(Question entity) {
        super.delete(entity);
    }

    @Override
    public Question get(Integer id) {
        return super.get(id);
    }

    @Override
    public Question load(Integer id) {
        return super.load(id);
    }

    @Override
    public List<Question> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(Question entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(Question entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(Question entity) {
        super.update(entity);
    }

    @Override
    public Question getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<Question> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }
}
