package app.dao.userconstructure;


import app.model.userconstructure.Company;
import app.newDao.IBaseGenericDAO;

import java.util.List;


public interface CompanyDAO extends IBaseGenericDAO<Company,String> {

    public Company getCompanyByUserId(int id);
}

