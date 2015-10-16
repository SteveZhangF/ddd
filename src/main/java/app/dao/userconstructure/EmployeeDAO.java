package app.dao.userconstructure;

import app.model.userconstructure.Employee;
import app.newDao.IBaseGenericDAO;

import java.util.List;

public interface EmployeeDAO extends IBaseGenericDAO<Employee,String>{
    public List<Employee> getEmployeeByDepartmentId(String department_id);
}
