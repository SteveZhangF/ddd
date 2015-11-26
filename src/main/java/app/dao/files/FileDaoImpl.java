/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.files;

import app.model.files.FileElement;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/23/15.
 */
@Repository
public class FileDaoImpl extends HibernateBaseGenericDAOImpl<FileElement, String> implements FileDao {
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public FileDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public void delete(FileElement entity) {
        super.delete(entity);
    }

    @Override
    public FileElement get(String id) {
        return super.get(id);
    }

    @Override
    public FileElement load(String id) {
        return super.load(id);
    }

    @Override
    public List<FileElement> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(FileElement entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(FileElement entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(FileElement entity) {
        super.update(entity);
    }

    @Override
    public FileElement getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<FileElement> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<FileElement> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }

    @Override
    public List<FileElement> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }

    @Override
    public List<FileElement> getListbyFieldAndParams(String[] fields, Map<String, Object> map) {
        return super.getListbyFieldAndParams(fields, map);
    }


    @Override
    public List<FileElement> getChildrenByParentIdAndTypes(String parentId, FileElement.FileType[] types, boolean deleted) {
        Session session = getSessionFactory().getCurrentSession();
        StringBuilder sb = new StringBuilder();
        sb.append("from FileElement as fe where fe.parent_id='");
        sb.append(parentId);
        sb.append("' and fe.deleted= ");
        sb.append(deleted);
        if (types != null && types.length > 0) {
            sb.append(" and (");
            for (int i = 0; i < types.length; i++) {
                sb.append(" fe.type= '" + types[i]);
                sb.append("'");
                if (i < types.length - 1) {
                    sb.append(" or ");
                }
            }
            sb.append(")");
        }
        System.out.println(sb.toString());
        Query query = session.createQuery(sb.toString());
        return query.list();
    }

    @Override
    public FileElement loadTreeBasedOnNodeId(String id) {
        Session session = getSessionFactory().getCurrentSession();
//一次取出全部节点
        Query query = session.createQuery("from FileElement as m");
        List<FileElement> list = query.list();
//从一级缓存中取出根节点（根节点为1000）
        FileElement root = (FileElement) session.get(FileElement.class, id);
//        session.close();
        return root;
    }
}
