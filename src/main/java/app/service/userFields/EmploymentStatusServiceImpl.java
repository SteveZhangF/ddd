/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userFields;

import app.dao.userFields.EmploymentStatusDao;
import app.model.userfield.EmploymentStatus;
import app.model.userfield.JobTitle;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by steve on 11/10/15.
 */
@Transactional
@Service
public class EmploymentStatusServiceImpl extends BaseGenericServiceImpl<EmploymentStatus,String> implements EmploymentStatusService {

    @Autowired
    EmploymentStatusDao employmentStatusDao;
    @Override
    public void delete(EmploymentStatus entity) {
        employmentStatusDao.delete(entity);
    }

    @Override
    public EmploymentStatus get(String id) {
        return employmentStatusDao.get(id);
    }

    @Override
    public EmploymentStatus load(String id) {
        return employmentStatusDao.load(id);
    }

    @Override
    public List<EmploymentStatus> loadAll() {
        return employmentStatusDao.loadAll();
    }

    @Override
    public void save(EmploymentStatus entity) {
        employmentStatusDao.save(entity);
    }

    @Override
    public void saveOrUpdate(EmploymentStatus entity) {
        employmentStatusDao.saveOrUpdate(entity);
    }

    @Override
    public void update(EmploymentStatus entity) {
        employmentStatusDao.update(entity);
    }

    @Override
    public List<EmploymentStatus> getListByUserId(int userId) {
        return  employmentStatusDao.getListbyParam("userId",userId);
    }
}
