/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package test.service.form;

import app.config.hibernate.HibernateConfiguration;
import app.helper.FormParser;
import app.model.form.ColumnAttribute;
import app.model.form.FormTable;
import app.service.form.FormService;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.SessionFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@ContextConfiguration(classes =FormServiceTestContextConfiguration.class ,loader = AnnotationConfigContextLoader.class)
public class FormServiceTest {

    @Autowired
    FormService formService;


//    @Autowired
//    HibernateConfiguration hibernateConfiguration;

//    @Test
//    public void getTest() throws IOException {
//        int id = 20;
//        FormTable formTable = formService.get(id);
//        ObjectMapper mapper = new ObjectMapper();
//        StringWriter sw = new StringWriter();
//        mapper.writeValue(sw,formTable);
//        System.out.println(sw.toString());
//        assert (sw.toString().contains(formTable.getId()+""));
//    }

    @Test
    public void saveTest(){
        String json = "{\"id\":\"\",\"fields_count\":1,\"creator\":\"\",\"createTime\":\"\",\"updateTime\":\"\",\"_del\":\"\",\"context_parse\":\"<p>ddddd{data_1}z</p>\",\"context\":\"<p>ddddd<input name=\\\"data_1\\\" type=\\\"text\\\" title=\\\"w\\\" value=\\\"\\\" leipiplugins=\\\"text\\\" orghide=\\\"0\\\" orgalign=\\\"left\\\" orgwidth=\\\"150\\\" orgtype=\\\"text\\\" style=\\\"text-align: left; width: 150px;\\\">z</p>\",\"form_desc\":\"\",\"form_name\":\"\",\"data\":[{\"name\":\"data_1\",\"type\":\"text\",\"title\":\"w\",\"value\":\"\",\"leipiplugins\":\"text\",\"orghide\":\"0\",\"orgalign\":\"left\",\"orgwidth\":\"150\",\"orgtype\":\"text\",\"style\":\"text-align: left; width: 150px;\",\"content\":\"<input name=\\\"data_1\\\" type=\\\"text\\\" title=\\\"w\\\" value=\\\"\\\" leipiplugins=\\\"text\\\" orghide=\\\"0\\\" orgalign=\\\"left\\\" orgwidth=\\\"150\\\" orgtype=\\\"text\\\" style=\\\"text-align: left; width: 150px;\\\">\"}]}";
        FormParser formParser = new FormParser(json);
        FormTable ft = formParser.parseForm(null);
        formService.save(ft);
        ft.setTable_name("CSTBL_"+ft.getId());
        formService.update(ft);
        formService.generatorTable(ft);
    }

    @Test
    public void updateTest(){
        String json = "{\"id\":\"47\",\"fields_count\":1,\"creator\":\"\",\"createTime\":\"\",\"updateTime\":\"\",\"_del\":\"\",\"context_parse\":\"<p>ddddd{data_1}z</p>\",\"context\":\"<p>ddddd<input name=\\\"data_1\\\" type=\\\"text\\\" title=\\\"w\\\" value=\\\"\\\" leipiplugins=\\\"text\\\" orghide=\\\"0\\\" orgalign=\\\"left\\\" orgwidth=\\\"150\\\" orgtype=\\\"text\\\" style=\\\"text-align: left; width: 150px;\\\">z</p>\",\"form_desc\":\"\",\"form_name\":\"\",\"data\":[{\"name\":\"data_1\",\"type\":\"text\",\"title\":\"w\",\"value\":\"\",\"leipiplugins\":\"text\",\"orghide\":\"0\",\"orgalign\":\"left\",\"orgwidth\":\"150\",\"orgtype\":\"text\",\"style\":\"text-align: left; width: 150px;\",\"content\":\"<input name=\\\"data_1\\\" type=\\\"text\\\" title=\\\"w\\\" value=\\\"\\\" leipiplugins=\\\"text\\\" orghide=\\\"0\\\" orgalign=\\\"left\\\" orgwidth=\\\"150\\\" orgtype=\\\"text\\\" style=\\\"text-align: left; width: 150px;\\\">\"}]}";

        FormParser formParser = new FormParser(json);
        FormTable ft2 = formService.get(37);
        ft2.clearColumn();
        System.out.println(ft2.getTable_name());
        formParser.parseForm(ft2);
        System.out.println("==========================");
        System.out.println(ft2.getTable_name());
        System.out.println("==========================");
        formService.update(ft2);
        formService.generatorTable(ft2);
    }


//    @Test
//    public void deleteTest(){
//        formService.delete(formService.get(37));
//    }

//    @Test
//    public void listTest() throws IOException {
//        List<FormTable> formTables = formService.loadAll();
//        ObjectMapper mapper = new ObjectMapper();
//        StringWriter sw = new StringWriter();
//        mapper.writeValue(sw,formTables);
//        System.out.println(sw.toString());
//    }
}
