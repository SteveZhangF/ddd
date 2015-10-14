/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;


import app.helper.ObjectGenerator;
import app.model.form.ColumnAttribute;
import app.model.form.FormTable;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Transformer;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Method;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/10/15.
 */
@Repository("userFormService")
@Transactional
public class UserFormServiceImpl implements UserFormService {
    @Autowired
    FormService formService;
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void insert(int formID, Map<String, Object> values) {
        FormTable formTable = formService.get(formID);
        String insert = formService.generateInsertSQL(formTable);
        Session session = sessionFactory.openSession();
        session.getTransaction().begin();
        Query query = session.createSQLQuery(insert);
        for(ColumnAttribute columnAttribute : formService.get(formID).getColumnAttributes()){
            if(columnAttribute.getColumn_type().equals("macros")){
                String orgType = columnAttribute.getOrgtype();
                query.setParameter(orgType,values.get(orgType));
            }else {
                query.setParameter(columnAttribute.getColumn_Name(),values.get(columnAttribute.getColumn_Name()));
            }
        }
        System.out.print(query
                .getQueryString());
        query.executeUpdate();
        session.close();
    }



    @Override
    public List query(int formID, Map<String, Object> foreignMap) throws ClassNotFoundException {
        FormTable formTable = formService.get(formID);
        Map<String,Object> result = formService.generateSelectSQL(formTable,foreignMap);
        String selectSQL = (String)result.get("sql");
        System.out.print(selectSQL);
        Session session = sessionFactory.openSession();

        /**
         * tried to create a bean through cglib but failed
         * */
//
//        System.out.println(bean.getClass().getName());
//        Object object = bean;
//        Class clazz = object.getClass();
//        Method[] methods = clazz.getDeclaredMethods();
//        for (int i = 0; i < methods.length; i++) {
//            System.out.println(methods[i].getName());
//        }
//        query.addScalar("ID")
//                .addScalar("data_11")
//                .setResultTransformer(Transformers.aliasToBean(bean.getClass()))
//
//        ;
//        query.uniqueResult();

        /**
         * parse the result
         * */
        ObjectGenerator bean = (ObjectGenerator) result.get("bean");
        for(Object key : bean.beanMap.entrySet()){
            System.out.println(key);
        }
        List<Object[]> result2 = session.createSQLQuery(selectSQL).list();

        List resultList = new ArrayList<>();
        for(Object[] objects : result2){


            for(int i=1;i<objects.length;i++){
                ColumnAttribute columnAttribute = formTable.getColumnAttributes().get(i-1);
                String key = columnAttribute.getColumn_Name();
                if(columnAttribute.getPlugins().equals("macros")){
                    key = columnAttribute.getOrgtype();
                }
                System.out.println(key);
                bean.setValue(key,objects[i]);
            }
            bean.setValue("ID",((BigInteger)objects[0]).intValue());
            Object object = bean.getObject();
            resultList.add(object);
        }
        return resultList;
    }


}
