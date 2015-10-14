/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.newDao;

/**
 * Created by steve on 10/12/15.
 */

import app.config.hibernate.HibernateConfiguration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.orm.hibernate4.support.HibernateDaoSupport;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;


/**
 * @param <T>  实体类
 * @param <PK> 主键类，必须实现Serializable接口
 * @author zj
 * @version V1.0
 * @ClassName：HibernateBaseGenericDAOImpl
 * @Description：TODO(HibernateBaseGenericDAOImpl DAO层泛型基类，实现了基本的DAO功能 利用了Spring的HibernateDaoSupport功能)
 * @date：Jul 9, 2012 1:41:37 PM
 */
@Repository("hibernateBaseGenericDao")
@SuppressWarnings("all")
public class HibernateBaseGenericDAOImpl<T, PK extends Serializable> extends HibernateDaoSupport implements IBaseGenericDAO<T, PK> {

    private static Log logger = LogFactory.getLog(HibernateBaseGenericDAOImpl.class);

    private Class<T> entityClass;
//    @Autowired
//    SessionFactory sessionFactory;

    /**
     * 构造方法，根据实例类自动获取实体类类型
     */
    @Autowired
    public HibernateBaseGenericDAOImpl(SessionFactory sessionFactory) {
        this.setSessionFactory(sessionFactory);
        this.entityClass = null;
        Class c = getClass();
        Type t = c.getGenericSuperclass();
        if (t instanceof ParameterizedType) {
            Type[] p = ((ParameterizedType) t).getActualTypeArguments();
            this.entityClass = (Class<T>) p[0];
        }
    }

    /*
     * (non-Javadoc)
     * @see com.integration.framework.dao.IBaseGenericDAO#delete(java.lang.Object)
     */
    public void delete(T entity) {
        try {
            getHibernateTemplate().delete(entity);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
        }
    }

    /*
     * (non-Javadoc)
     * @see com.integration.framework.dao.IBaseGenericDAO#get(java.io.Serializable)
     */
    public T get(PK id) {
        return (T) getHibernateTemplate().get(entityClass, id);
    }

    /*
     * (non-Javadoc)
     * @see com.integration.framework.dao.IBaseGenericDAO#load(java.io.Serializable)
     */
    public T load(PK id) {
        return (T) getHibernateTemplate().load(entityClass, id);
    }

    /*
     * (non-Javadoc)
     * @see com.integration.framework.dao.IBaseGenericDAO#loadAll()
     */
    public List<T> loadAll() {
        return getHibernateTemplate().loadAll(entityClass);
    }

    /*
     * (non-Javadoc)
     * @see com.integration.framework.dao.IBaseGenericDAO#save(java.lang.Object)
     */
    public void save(T entity) {
        try {
            getHibernateTemplate().save(entity);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
        }
    }

    /*
     * (non-Javadoc)
     * @see com.integration.framework.dao.IBaseGenericDAO#saveOrUpdate(java.lang.Object)
     */
    public void saveOrUpdate(T entity) {
        try {
            getHibernateTemplate().saveOrUpdate(entity);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
        }
    }

    /*
     * (non-Javadoc)
     * @see com.integration.framework.dao.IBaseGenericDAO#update(java.lang.Object)
     */
    public void update(T entity) {
        try {
            getHibernateTemplate().update(entity);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
        }
    }
}

