package app.dao.userconstructure.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import app.dao.AbstractDao;
import app.dao.userconstructure.CompanyDAO;
import app.model.user.User;
import app.model.userconstructure.Company;
@Repository("companyDao")
public class CompanyDaoImpl extends AbstractDao<String, Company> implements CompanyDAO {

	@Override
	public Company getCompanybyUserID(int userid) {
		Criteria crit = createEntityCriteria();
		crit.add(Restrictions.eq("user_id", userid));
		return (Company) crit.uniqueResult();
	}

	@Override
	public void save(Company p) {
		super.persist(p);
	}

	@Override
	public Company getCompanybyID(String uuid) {
		return super.getByKey(uuid);
	}

	@Override
	public void delete(String id) {
		// TODO Auto-generated method stub
		Company company = getCompanybyID(id);
		super.delete(company);

	}

	@Override
	public List<Company> getAll() {
		return (List<Company>)createEntityCriteria().list();
	}


}
