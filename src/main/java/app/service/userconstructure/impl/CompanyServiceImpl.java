package app.service.userconstructure.impl;

import app.dao.userconstructure.CompanyDao;
import app.model.userconstructure.Company;
import app.newService.BaseGenericServiceImpl;
import app.service.userconstructure.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("companyService")
@Transactional
public class CompanyServiceImpl extends BaseGenericServiceImpl<Company, String> implements CompanyService {

    @Autowired
    CompanyDao companyDao;

    @Override
    public Company getCompanybyUser(int user_id) {
        return companyDao.getCompanyByUserId(user_id);
    }

    @Override
    public void delete(Company entity) {
        companyDao.delete(entity);
    }

    @Override
    public Company get(String id) {
        return companyDao.get(id);
    }

    @Override
    public Company load(String id) {
        return companyDao.load(id);
    }

    @Override
    public List<Company> loadAll() {
        return companyDao.loadAll();
    }

    @Override
    public void save(Company entity) {
        companyDao.save(entity);
    }

    @Override
    public void saveOrUpdate(Company entity) {
        companyDao.saveOrUpdate(entity);
    }

    @Override
    public void update(Company entity) {
        companyDao.update(entity);
    }


}
