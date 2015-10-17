/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userconstructure.impl;

import app.dao.userconstructure.DepartmentDAO;
import app.model.userconstructure.Company;
import app.model.userconstructure.Department;
import app.newService.BaseGenericServiceImpl;
import app.service.userconstructure.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
@Service("departmentService")
@Transactional
public class DepartmentServiceImpl extends BaseGenericServiceImpl<Department,String> implements DepartmentService {
    @Autowired
    DepartmentDAO departmentDAO;
    @Override
    public List<Department> getbyCompanyId(String companyId) {
        return departmentDAO.getDepartmentsByCompanyId(companyId);
    }

    @Override
    public List<Department> getbyParentId(String parent_id) {
        return departmentDAO.getDepartmentsByParentId(parent_id);
    }

    @Override
    public void delete(Department entity) {
        departmentDAO.delete(entity);
    }

    @Override
    public Department get(String id) {
        return departmentDAO.get(id);
    }

    @Override
    public Department load(String id) {
        return departmentDAO.load(id);
    }

    @Override
    public List<Department> loadAll() {
        return departmentDAO.loadAll();
    }

    @Override
    public void save(Department entity) {
        departmentDAO.save(entity);
    }

    @Override
    public void saveOrUpdate(Department entity) {
        departmentDAO.saveOrUpdate(entity);
    }

    @Override
    public void update(Department entity) {
        departmentDAO.update(entity);
    }
}
