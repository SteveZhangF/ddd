/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.dao.form.TableFormFieldDao;
import app.model.forms.TableFormField;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by steve on 11/12/15.
 */
@Service
@Transactional
public class TableFormFieldServiceImpl extends BaseGenericServiceImpl<TableFormField,String> implements TableFormFieldService {
    @Autowired
    TableFormFieldDao tableFormFieldDao;

    @Override
    public void delete(TableFormField entity) {
        tableFormFieldDao.delete(entity);
    }

    @Override
    public TableFormField get(String id) {
        return tableFormFieldDao.get(id);
    }

    @Override
    public TableFormField load(String id) {
        return tableFormFieldDao.load(id);
    }

    @Override
    public List<TableFormField> loadAll() {
        return tableFormFieldDao.loadAll();
    }

    @Override
    public void save(TableFormField entity) {
        tableFormFieldDao.save(entity);
    }

    @Override
    public void saveOrUpdate(TableFormField entity) {
        tableFormFieldDao.saveOrUpdate(entity);
    }

    @Override
    public void update(TableFormField entity) {
        tableFormFieldDao.update(entity);
    }
}
