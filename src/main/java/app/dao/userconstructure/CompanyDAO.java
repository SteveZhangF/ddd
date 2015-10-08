package app.dao.userconstructure;


import java.util.List;

import app.model.userconstructure.Company;


public interface CompanyDAO {
	public Company getCompanybyUserID(int userid);
	
	public void save(Company p) ;

	public Company getCompanybyID(String uuid) ;

	public void delete(String id) ;
	
	public List<Company> getAll();

}

