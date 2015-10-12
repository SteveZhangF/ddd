/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package test.service.form;

import app.config.hibernate.HibernateConfiguration;
import app.model.form.FormTable;
import app.service.form.FormService;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

/**
 * Created by steve on 10/10/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
public class FormServiceTest {

    @Autowired
    FormService formService;
    @Autowired
    HibernateConfiguration hibernateConfiguration;


    @Test
    public void saveTest(){

    }

    @Test
    public void listTest() throws IOException {
        List<FormTable> formTables = formService.list();
        ObjectMapper mapper = new ObjectMapper();
        StringWriter sw = new StringWriter();
        mapper.writeValue(sw,formTables);
        System.out.println(sw.toString());
        assert (sw.toString().contains(""));
    }

    @Configuration
    @ComponentScan("app.config.hibernate")
    static class ContextConfig{
        HibernateConfiguration hibernateConfiguration = new HibernateConfiguration();
        @Bean
        public HibernateConfiguration getHibernateConfiguration(){
            return hibernateConfiguration;
        }
    }
}
