/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.form;

import app.model.forms.Form;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by steve on 10/20/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class,loader = AnnotationConfigContextLoader.class)
public class FormServiceImplTest {

    @Autowired
    FormService formService;

    @Test
    public void testDelete() throws Exception {

    }

    @Test
    public void testGet() throws Exception {
        List<Form> list = formService.getFormListforMenu();
        for(Form form : list){
            System.out.println(form.getForm_name());
        }
        System.out.println(list.size());
    }

    @Test
    public void testLoad() throws Exception {

    }

    @Test
    public void testLoadAll() throws Exception {

    }

    @Test
    public void testSave() throws Exception {

    }

    @Test
    public void testSaveOrUpdate() throws Exception {

    }

    @Test
    public void testUpdate() throws Exception {

    }
}