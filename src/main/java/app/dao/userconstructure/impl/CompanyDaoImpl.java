package app.dao.userconstructure.impl;

import app.dao.userconstructure.CompanyDao;
import app.model.userconstructure.Company;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CompanyDaoImpl extends HibernateBaseGenericDAOImpl<Company,String> implements CompanyDao {

    @Autowired
    public CompanyDaoImpl(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    @Override
    public void delete(Company entity) {
        super.delete(entity);
    }

    @Override
    public Company get(String id) {
        return super.get(id);
    }

    @Override
    public Company load(String id) {
        return super.load(id);
    }

    @Override
    public List<Company> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(Company entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(Company entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(Company entity) {
        super.update(entity);
    }


    @Override
    public Company getCompanyByUserId(int id) {
        return super.getbyParam("user_id",id);
    }
}
