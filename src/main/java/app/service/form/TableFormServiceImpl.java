/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.dao.form.TableFormDao;
import app.model.forms.TableForm;
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
public class TableFormServiceImpl extends BaseGenericServiceImpl<TableForm, String> implements TableFormService {

    @Autowired
    TableFormDao tableFormDao;

    @Override
    public void delete(TableForm entity) {
        tableFormDao.delete(entity);
    }

    @Override
    public TableForm get(String id) {
        return tableFormDao.get(id);
    }

    @Override
    public TableForm load(String id) {
        return tableFormDao.load(id);
    }

    @Override
    public List<TableForm> loadAll() {
        return tableFormDao.loadAll();
    }

    @Override
    public void save(TableForm entity) {
        tableFormDao.save(entity);
    }

    @Override
    public void saveOrUpdate(TableForm entity) {
        tableFormDao.saveOrUpdate(entity);
    }

    @Override
    public void update(TableForm entity) {
        tableFormDao.update(entity);
    }

    @Override
    public List<TableForm> getTableFormsForList() {
        String[] fields = {"id","name","createTime","updateTime"};
        return tableFormDao.getListbyField(fields);
    }
}
