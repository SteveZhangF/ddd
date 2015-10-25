/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.workflow;

import app.model.wordflow.WorkFlow;
import app.model.wordflow.WorkFlowNode;
import app.service.form.UserFormServiceImplTestContextConfiguration;
import com.fasterxml.jackson.databind.ObjectMapper;
import junit.framework.TestCase;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Map;

/**
 * Created by steve on 10/14/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)
public class WorkFlowServiceImplTest extends TestCase {
    @Autowired
    WorkFlowService workFlowService;

    @Before
    public void setUp() throws Exception {

    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void testDelete() throws Exception {

    }
    @Test
    public void testJson() throws Exception{
        ObjectMapper mapper = new  ObjectMapper();
        StringReader stringReader = new StringReader("{\"id\":\"40288085509cd72e01509cd7869a0000\",\"description\":\"newwf\",\"name\":\"newwf\",\"nodes\":[{\"id\":\"40288085509cdc2b01509cde7dc80000\",\"name\":\"start\",\"type\":\"Normal\",\"x\":\"58px\",\"y\":\"77px\",\"data\":{\"id\":0,\"description\":\"start node\"},\"nexts\":[{\"_if\":\"\",\"_then\":\"40288085509cdc2b01509cde82650001\"}],\"prev\":\"\"},{\"id\":\"40288085509cdc2b01509cde82650001\",\"name\":\"end\",\"type\":\"Normal\",\"x\":\"393px\",\"y\":\"81px\",\"data\":{\"id\":1,\"description\":\"end node\"},\"nexts\":[],\"prev\":\"40288085509cdc2b01509cde7dc80000\"}]}");


        WorkFlow workFlow = mapper.readValue(stringReader,WorkFlow.class);
        workFlowService.update(workFlow);

        workFlow = workFlowService.get("40288085509cd72e01509cd7869a0000");
        System.out.println(mapper.writeValueAsString(workFlow));
    }


    @Test
    public void testSaveOrUpdate() throws Exception {

    }

    @Test
    public void testUpdate() throws Exception {

    }
}