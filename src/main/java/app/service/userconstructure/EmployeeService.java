/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userconstructure;

import app.model.userconstructure.Employee;
import app.newService.IBaseGenericService;

import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
public interface EmployeeService extends IBaseGenericService<Employee,String> {
    public List<Employee> getEmployeeByCompanyId(String company_id);
    public List<Employee> getEmployeeByDepartmentId(String department_id);
}
