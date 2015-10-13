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
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;
/**
 * Created by steve on 10/12/15.
 */

@Service
@SuppressWarnings("all")
public class BaseGenericServiceImpl<T, PK extends Serializable> implements IBaseGenericService<T, PK> {

    @Autowired
    private IBaseGenericDAO dao;

    public void delete(T entity) {
        dao.delete(entity);
    }

    public T get(PK id) {
        return (T) dao.get(id);
    }

    public T load(PK id) {
        return (T) dao.load(id);
    }

    public List<T> loadAll() {
        return dao.loadAll();
    }

    public void save(T entity) {
        dao.save(entity);
    }

    public void saveOrUpdate(T entity) {
        dao.saveOrUpdate(entity);
    }

    public void update(T entity) {
        dao.update(entity);
    }

}

