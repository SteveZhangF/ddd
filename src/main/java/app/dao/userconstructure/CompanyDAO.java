package app.dao.userconstructure;


import app.model.form.FormTable;
import app.model.userconstructure.Company;
import app.newDao.IBaseGenericDAO;

import java.util.List;


public interface CompanyDao extends IBaseGenericDAO<Company,String> {

    public Company getCompanyByUserId(int id);
}

