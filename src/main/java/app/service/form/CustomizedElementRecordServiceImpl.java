/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.dao.form.CustomizedElementRecordDao;
import app.model.forms.CustomizedElement;
import app.model.forms.CustomizedElementRecord;
import app.model.forms.CustomizedElementRecordValue;
import app.model.forms.Folder;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;

/**
 * Created by steve on 11/22/15.
 */

@Service
@Transactional
public class CustomizedElementRecordServiceImpl extends BaseGenericServiceImpl<CustomizedElementRecord, String> implements CustomizedElementRecordService {

    @Autowired
    CustomizedElementRecordDao customizedElementRecordDao;

    @Override
    public void delete(CustomizedElementRecord entity) {
        customizedElementRecordDao.delete(entity);
    }

    @Override
    public CustomizedElementRecord get(String id) {
        return customizedElementRecordDao.get(id);
    }

    @Override
    public CustomizedElementRecord load(String id) {
        return customizedElementRecordDao.load(id);
    }

    @Override
    public List<CustomizedElementRecord> loadAll() {
        return customizedElementRecordDao.loadAll();
    }

    @Override
    public void save(CustomizedElementRecord entity) {
        entity.setCreateTime(new Timestamp(new java.util.Date().getTime()));
        entity.setUpdateTime(new Timestamp(new java.util.Date().getTime()));
        customizedElementRecordDao.save(entity);
    }

    @Override
    public void saveOrUpdate(CustomizedElementRecord entity) {
        customizedElementRecordDao.saveOrUpdate(entity);
    }

    @Override
    public void update(CustomizedElementRecord entity) {
        entity.setUpdateTime(new Timestamp(new java.util.Date().getTime()));
        customizedElementRecordDao.update(entity);
    }

    @Override
    public List<CustomizedElementRecord> listCustomizedElementRecordByUserIdAndElementId(int userId, CustomizedElement element) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("userId", userId);
        map.put("customizedElement",element);
        map.put("deleted",false);
        return customizedElementRecordDao.getListbyParams(map);
    }

    @Override
    public void createCustomizedElementRecord(int userId, CustomizedElement customizedElement, List<CustomizedElementRecordValue> values) {
        CustomizedElementRecord customizedElementRecord = new CustomizedElementRecord();
        customizedElementRecord.setUserId(userId);
        customizedElementRecord.setCustomizedElement(customizedElement);
        customizedElementRecord.setValues(values);
        customizedElementRecord.setDeleted(false);
        save(customizedElementRecord);
    }
}
