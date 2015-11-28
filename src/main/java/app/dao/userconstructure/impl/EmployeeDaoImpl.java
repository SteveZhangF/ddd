/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.userconstructure.impl;

import app.dao.userconstructure.EmployeeDAO;
import app.model.userconstructure.Employee;
import app.newDao.HibernateBaseGenericDAOImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/15/15.
 */
@Repository
public class EmployeeDaoImpl extends HibernateBaseGenericDAOImpl<Employee,String> implements EmployeeDAO {

    /**
     * 构造方法，根据实例类自动获取实体类类型
     *
     * @param sessionFactory
     */
    @Autowired
    public EmployeeDaoImpl(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public Employee getbyParam(String param, Object value) {
        return super.getbyParam(param, value);
    }

    @Override
    public List<Employee> getListbyParam(String param, Object value) {
        return super.getListbyParam(param, value);
    }

    @Override
    public List<Employee> getListbyField(String[] fields) {
        return super.getListbyField(fields);
    }

    @Override
    public List<Employee> getListbyParams(Map<String, Object> map) {
        return super.getListbyParams(map);
    }

    @Override
    public void delete(Employee entity) {
        super.delete(entity);
    }

    @Override
    public Employee get(String id) {
        return super.get(id);
    }

    @Override
    public Employee load(String id) {
        return super.load(id);
    }

    @Override
    public List<Employee> loadAll() {
        return super.loadAll();
    }

    @Override
    public void save(Employee entity) {
        super.save(entity);
    }

    @Override
    public void saveOrUpdate(Employee entity) {
        super.saveOrUpdate(entity);
    }

    @Override
    public void update(Employee entity) {
        super.update(entity);
    }

    @Override
    public List<Employee> getListforListByUserId(int userId) {
        String[] fields = {"uuid","firstName","lastName","email","phone","address","userId","gender"};
        HashMap<String,Object> map = new HashMap<>();
        map.put("userId",userId);
        return super.getListbyFieldAndParams(fields,map);
    }

}
