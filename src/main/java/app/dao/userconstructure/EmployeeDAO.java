package app.dao.userconstructure;

import app.model.userconstructure.Employee;
import app.newDao.IBaseGenericDAO;

import java.util.List;

public interface EmployeeDAO extends IBaseGenericDAO<Employee,String>{
    List<Employee> getListforListByUserId(int userId);
    List<Employee> getListWithRecordsforListByUserId(int userId);
}
