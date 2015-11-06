/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.question;

import app.model.report.Record;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * Created by steve on 10/18/15.
 */

@Repository
public class RecordDaoImpl extends HibernateBaseGenericDAOImpl<Record,Integer> implements RecordDao {
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public RecordDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(Record entity) {
        super.delete(entity);
    }

    @Override
    public Record get(Integer id) {
        return super.get(id);
    }

    @Override
    public Record load(Integer id) {
        return super.load(id);
    }

    @Override
    public List<Record> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(Record entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(Record entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(Record entity) {
        super.update(entity);
    }

    @Override
    public Record getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<Record> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<Record> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }
}
