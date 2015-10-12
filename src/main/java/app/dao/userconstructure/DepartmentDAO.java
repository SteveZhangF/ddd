package app.dao.userconstructure;

import app.model.userconstructure.Department;

public interface DepartmentDAO {
    public void save(Department p);

    public Department getDepartmentbyID(String uuid);

    public void delete(String id);

}
