package app.dao.userconstructure;


import app.model.userconstructure.Company;

import java.util.List;


public interface CompanyDAO {
    public Company getCompanybyUserID(int userid);

    public void save(Company p);

    public Company getCompanybyID(String uuid);

    public void delete(String id);

    public List<Company> getAll();

}

