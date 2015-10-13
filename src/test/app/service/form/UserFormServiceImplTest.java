/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.config.hibernate.HibernateConfiguration;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.*;

/**
 * Created by steve on 10/12/15.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class,loader = AnnotationConfigContextLoader.class)
public class UserFormServiceImplTest extends TestCase {

    @Test
    public void testInsert() throws Exception {
        Map<String,Object> map = new HashMap<>();
        System.out.println(hibernateConfiguration);

        map.put("form_id",18);
        map.put("data_1","test");
        int form_id = Integer.valueOf(""+map.get("form_id"));
        userformService.insert(form_id,map);
//        userformService.query(0,map);
    }

    @Test
    public void testGetForm() throws Exception {
        int id = 18;

    }

    @Test
    public void testQuery() throws Exception {

    }

    @Autowired
    UserFormService userformService;
    @Autowired
    HibernateConfiguration hibernateConfiguration;
}