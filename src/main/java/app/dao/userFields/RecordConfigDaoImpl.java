/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.userFields;

import app.model.userfield.RecordConfig;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/13/15.
 */
@Repository
public class RecordConfigDaoImpl extends HibernateBaseGenericDAOImpl<RecordConfig,String> implements RecordConfigDao{
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public RecordConfigDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(RecordConfig entity) {
        super.delete(entity);
    }

    @Override
    public RecordConfig get(String id) {
        return super.get(id);
    }

    @Override
    public RecordConfig load(String id) {
        return super.load(id);
    }

    @Override
    public List<RecordConfig> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(RecordConfig entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(RecordConfig entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(RecordConfig entity) {
        super.update(entity);
    }

    @Override
    public RecordConfig getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<RecordConfig> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<RecordConfig> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }

    @Override
    public List<RecordConfig> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }

    @Override
    public List<RecordConfig> getListbyFieldAndParams(String[] fields, Map<String, Object> map) {
        return super.getListbyFieldAndParams(fields, map);
    }

    @Override
    public List<RecordConfig> getRecordConfigByUserIdAndTableFormId(int userId, String tableFormId) {
        Session sess = getSessionFactory().getCurrentSession();

        List list = sess.createSQLQuery("SELECT * FROM RecordConfig rc, TableForm tf WHERE rc.tableForm_id = tf.id AND rc.user_id=" + userId)
                .addEntity("recordConfig", RecordConfig.class).list();

        return list;
    }
}
