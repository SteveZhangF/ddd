/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userFields;

import app.dao.userFields.JobTitleDao;
import app.model.userfield.JobTitle;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by steve on 11/10/15.
 */
@Service("jobTitleService")
@Transactional
public class JobTitleServiceImpl extends BaseGenericServiceImpl<JobTitle,String> implements JobTitleService {

    @Autowired
    JobTitleDao jobTitleDao;


    @Override
    public void delete(JobTitle entity) {
        jobTitleDao.delete(entity);
    }

    @Override
    public JobTitle get(String id) {
        return jobTitleDao.get(id);
    }

    @Override
    public JobTitle load(String id) {
        return jobTitleDao.load(id);
    }

    @Override
    public List<JobTitle> loadAll() {
        return jobTitleDao.loadAll();
    }

    @Override
    public void save(JobTitle entity) {
        jobTitleDao.save(entity);
    }

    @Override
    public void saveOrUpdate(JobTitle entity) {
        jobTitleDao.saveOrUpdate(entity);
    }

    @Override
    public void update(JobTitle entity) {
        jobTitleDao.update(entity);
    }

    @Override
    public List<JobTitle> getListByUserId(int userId) {
        return jobTitleDao.getListbyParam("userId",userId);
    }
}
