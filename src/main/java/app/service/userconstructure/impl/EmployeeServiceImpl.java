/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userconstructure.impl;

import app.dao.userconstructure.EmployeeDAO;
import app.model.userconstructure.Employee;
import app.model.userfield.EmploymentStatus;
import app.model.userfield.JobPosition;
import app.newService.BaseGenericServiceImpl;
import app.service.userconstructure.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.ManyToOne;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
@Service("employeeService")
@Transactional
public class EmployeeServiceImpl extends BaseGenericServiceImpl<Employee, String> implements EmployeeService {
    @Autowired
    EmployeeDAO employeeDAO;

    @Override
    public List<Employee> getEmployeebyUserId(int userid) {
        return employeeDAO.getListforListByUserId(userid);
    }

    @Override
    public void delete(Employee entity) {
        employeeDAO.delete(entity);
    }

    @Override
    public Employee get(String id) {
        return employeeDAO.get(id);
    }

    @Override
    public Employee load(String id) {
        return employeeDAO.load(id);
    }

    @Override
    public List<Employee> loadAll() {
        return employeeDAO.loadAll();
    }

    @Override
    public void save(Employee entity) {
        employeeDAO.save(entity);
    }

    @Override
    public void saveOrUpdate(Employee entity) {
        employeeDAO.saveOrUpdate(entity);
    }

    @Override
    public void update(Employee entity) {
        employeeDAO.update(entity);
    }

    @Override
    public Employee getEmployeePersonDetailbyId(String uuid) {
        String[] fields = {"uuid","firstName", "lastName", "driverLicenseNum", "ssn", "driverLicenseExp", "maritalStatus", "gender", "nationality", "birthday"};
        HashMap<String, Object> map = new HashMap<>();
        map.put("uuid", uuid);
        List<Employee> list = employeeDAO.getListbyFieldAndParams(fields, map);
        if(list.size() == 0){
            return null;
        }else{
            return list.get(0);
        }
    }
// @ManyToOne()
//private JobPosition jobPosition;
//    @ManyToOne()
//    private EmploymentStatus employmentStatus;
//    private Date joinedDate;
//    private Date startDate;
//    private Date endDate;
//    private String contractDetail;
    @Override
    public Employee getEmployeeJobDetailbyId(String uuid) {
        String[] fields = {"uuid","jobPosition", "employmentStatus", "joinedDate", "startDate", "endDate", "contractDetail" };
        HashMap<String, Object> map = new HashMap<>();
        map.put("uuid", uuid);
        List<Employee> list = employeeDAO.getListbyFieldAndParams(fields, map);
        if(list.size() == 0){
            return null;
        }else{
            return list.get(0);
        }
    }
}
