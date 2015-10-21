/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.question;

import app.model.report.Question;
import app.service.form.UserFormServiceImplTestContextConfiguration;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import static org.junit.Assert.*;

/**
 * Created by steve on 10/18/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)
public class QuestionServiceImplTest {

    @Autowired
    QuestionService questionService;

    @Test
    public void testSetPluginId(){
        Question question = questionService.get(4);
        question.setContent("<plugin id=\\\"{+id+}\\\"><input class=\\\"form-control\\\" type=\\\"text\\\"></plugin>");
        questionService.setPluginId(question);
        System.out.println(question.getContent());
    }

    @Test
    public void testDelete() throws Exception {

    }

    @Test
    public void testGet() throws Exception {

    }

    @Test
    public void testLoad() throws Exception {

    }

    @Test
    public void testLoadAll() throws Exception {

    }

    @Test
    public void testSave() throws Exception {
        String json = "{\"id\":\"1\",\"name\":\"questions1\",\"type\":\"text\",\"content\":\"<input type=\\\"text\\\" id = '{#ID}' class=\\\"form-control\\\">\"}";
        ObjectMapper mapper = new ObjectMapper();
        Question question = mapper.readValue(json, Question.class);
        questionService.save(question);
    }

    @Test
    public void testSaveOrUpdate() throws Exception {

    }

    @Test
    public void testUpdate() throws Exception {

    }
}