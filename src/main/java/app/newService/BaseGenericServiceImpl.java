/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.newService;

import app.newDao.IBaseGenericDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;
/**
 * Created by steve on 10/12/15.
 */

@Service
@Transactional
@SuppressWarnings("all")
public class BaseGenericServiceImpl<T, PK extends Serializable> implements IBaseGenericService<T, PK> {

    @Autowired
    @Qualifier("hibernateBaseGenericDao")
    private IBaseGenericDAO hibernateBaseGenericDao;

    public void delete(T entity) {
        hibernateBaseGenericDao.delete(entity);
    }

    public T get(PK id) {
        return (T) hibernateBaseGenericDao.get(id);
    }

    public T load(PK id) {
        return (T) hibernateBaseGenericDao.load(id);
    }

    public List<T> loadAll() {
        return hibernateBaseGenericDao.loadAll();
    }

    public void save(T entity) {
        hibernateBaseGenericDao.save(entity);
    }

    public void saveOrUpdate(T entity) {
        hibernateBaseGenericDao.saveOrUpdate(entity);
    }

    public void update(T entity) {
        hibernateBaseGenericDao.update(entity);
    }

}

