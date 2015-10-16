package app.dao.userconstructure;

import app.model.userconstructure.Department;
import app.newDao.IBaseGenericDAO;

import java.util.List;

public interface DepartmentDAO extends IBaseGenericDAO<Department,String> {
    public List<Department> getDepartmentsByCompanyId(String company_id);
    public List<Department> getDepartmentsByParentId(String parent_id);
}
