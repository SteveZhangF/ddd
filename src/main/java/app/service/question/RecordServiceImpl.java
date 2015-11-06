/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.question;

import app.dao.question.RecordDao;
import app.model.report.Record;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/18/15.
 */
@Service
@Transactional
public class RecordServiceImpl extends BaseGenericServiceImpl<Record, Integer> implements RecordService {

    @Autowired
    RecordDao answerDao;

    @Override
    public void delete(Record entity) {
        answerDao.delete(entity);
    }

    @Override
    public Record get(Integer id) {
        return answerDao.get(id);
    }

    @Override
    public Record load(Integer id) {
        return answerDao.load(id);
    }

    @Override
    public List<Record> loadAll() {
        return answerDao.loadAll();
    }

    @Override
    public void save(Record entity) {
        answerDao.save(entity);
    }

    @Override
    public void saveOrUpdate(Record entity) {
        answerDao.saveOrUpdate(entity);
    }

    @Override
    public void update(Record entity) {
        answerDao.update(entity);
    }

    @Override
    public List<Record> getListbyParams(Map<String, Object> map) {
        return answerDao.getListbyParams(map);
    }
}
