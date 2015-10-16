/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.userconstructure.impl;

import app.dao.userconstructure.CompanyDao;
import app.dao.userconstructure.DepartmentDAO;
import app.model.userconstructure.Company;
import app.model.userconstructure.Department;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
@Repository
public class DepartmentDaoImpl  extends HibernateBaseGenericDAOImpl<Department,String> implements DepartmentDAO {
    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public DepartmentDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public List<Department> getDepartmentsByCompanyId(String company_id) {
        return super.getListbyParam("company_id",company_id);
    }

    @Override
    public List<Department> getDepartmentsByParentId(String parent_id) {
        return super.getListbyParam("parent_id",parent_id);
    }
}

