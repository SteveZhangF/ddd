package app.dao.userconstructure;

import app.model.userconstructure.Employee;

public interface EmployeeDAO {
    public void save(Employee p);

    public Employee getEmployeebyID(String uuid);

    public void delete(String id);
}
