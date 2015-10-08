package app.service.userconstructure.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.dao.userconstructure.CompanyDAO;
import app.model.userconstructure.Company;
import app.service.userconstructure.CompanyService;

@Service("companyService")
@Transactional
public class CompanyServiceImpl implements CompanyService {
	@Autowired
	private CompanyDAO dao;

	@Override
	public Company findById(String id) {
		return dao.getCompanybyID(id);
	}

	@Override
	public void saveCompany(Company company) {
		dao.save(company);
	}

	@Override
	public void updateCompany(Company company) {
		Company entity = dao.getCompanybyID(company.getUuid());
		if (entity != null) {
			entity.setName(company.getName());
			entity.setAddress(company.getAddress());
			entity.setCompany_id(company.getCompany_id());
			entity.setFormType(company.getFormType());
			entity.setModules(company.getModules());
			entity.setPhone(company.getPhone());
			entity.setRecords(company.getRecords());
			entity.setUser_id(company.getUser_id());
		}

	}

	@Override
	public void deleteCompanyById(String id) {
		dao.delete(id);
	}

	@Override
	public List<Company> findAllCompany() {
		return dao.getAll();
	}

	@Override
	public Company findCompanybyUserID(int id) {
		// TODO Auto-generated method stub
		return dao.getCompanybyUserID(id);
	}

}
