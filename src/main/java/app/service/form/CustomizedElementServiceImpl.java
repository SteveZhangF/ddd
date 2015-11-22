/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.dao.form.CustomizedElementDao;
import app.model.forms.CustomizedElement;
import app.model.forms.Folder;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/21/15.
 */
@Service
@Transactional
public class CustomizedElementServiceImpl  extends BaseGenericServiceImpl<CustomizedElement, String> implements CustomizedElementService {

    @Autowired
    CustomizedElementDao customizedElementDao;

    @Override
    public void delete(CustomizedElement entity) {
        customizedElementDao.delete(entity);
    }

    @Override
    public CustomizedElement get(String id) {
        return customizedElementDao.get(id);
    }

    @Override
    public CustomizedElement load(String id) {
        return customizedElementDao.load(id);
    }

    @Override
    public List<CustomizedElement> loadAll() {
        return customizedElementDao.loadAll();
    }

    @Override
    public void save(CustomizedElement entity) {
        customizedElementDao.save(entity);
    }

    @Override
    public void saveOrUpdate(CustomizedElement entity) {
        customizedElementDao.saveOrUpdate(entity);
    }

    @Override
    public void update(CustomizedElement entity) {
        customizedElementDao.update(entity);
    }

}
