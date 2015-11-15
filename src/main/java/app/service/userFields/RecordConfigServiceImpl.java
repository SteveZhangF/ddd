/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userFields;

import app.dao.userFields.RecordConfigDao;
import app.model.userfield.RecordConfig;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 11/13/15.
 */
@Service
@Transactional
public class RecordConfigServiceImpl extends BaseGenericServiceImpl<RecordConfig, String>
        implements RecordConfigService {
    @Autowired
    RecordConfigDao recordConfigDao;

    @Override
    public void delete(RecordConfig entity) {
        recordConfigDao.delete(entity);
    }

    @Override
    public RecordConfig get(String id) {
        return recordConfigDao.get(id);
    }

    @Override
    public RecordConfig load(String id) {
        return recordConfigDao.load(id);
    }

    @Override
    public List<RecordConfig> loadAll() {
        return recordConfigDao.loadAll();
    }

    @Override
    public void save(RecordConfig entity) {
        recordConfigDao.save(entity);
    }

    @Override
    public void saveOrUpdate(RecordConfig entity) {
        recordConfigDao.saveOrUpdate(entity);
    }

    @Override
    public void update(RecordConfig entity) {
        recordConfigDao.update(entity);
    }

    @Override
    public List<RecordConfig> getRecordConfigByUserIdAndTableFormId(int userId, String tableFormId) {
        return recordConfigDao.getRecordConfigByUserIdAndTableFormId(userId,tableFormId);
    }
}
