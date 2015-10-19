/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.question;

import app.model.report.Answer;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by steve on 10/18/15.
 */

@Repository
public class AnswerDaoImpl extends HibernateBaseGenericDAOImpl<Answer,Integer> implements AnswerDao {
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public AnswerDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(Answer entity) {
        super.delete(entity);
    }

    @Override
    public Answer get(Integer id) {
        return super.get(id);
    }

    @Override
    public Answer load(Integer id) {
        return super.load(id);
    }

    @Override
    public List<Answer> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(Answer entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(Answer entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(Answer entity) {
        super.update(entity);
    }

    @Override
    public Answer getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<Answer> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }
}
