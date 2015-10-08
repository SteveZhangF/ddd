package app.service.userconstructure;

import java.util.List;

import app.model.userconstructure.Company;

public interface CompanyService {
	Company findById(String id);

	void saveCompany(Company employee);

	void updateCompany(Company employee);

	void deleteCompanyById(String id);

	List<Company> findAllCompany();
	
	Company findCompanybyUserID(int id);
}
