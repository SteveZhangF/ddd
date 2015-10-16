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
import app.newService.BaseGenericServiceImpl;
import app.service.userconstructure.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
@Service("employeeService")
public class EmployeeServiceImpl extends BaseGenericServiceImpl<Employee, String> implements EmployeeService {
    @Autowired
    EmployeeDAO employeeDAO;

    @Override
    public List<Employee> getEmployeeByCompanyId(String company_id) {
        return employeeDAO.getListbyParam("company_id", company_id);
    }

    @Override
    public List<Employee> getEmployeeByDepartmentId(String department_id) {
        return employeeDAO.getEmployeeByDepartmentId(department_id);
    }
}
