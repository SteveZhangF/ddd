/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userFields;

import app.model.userfield.RecordConfig;
import app.service.form.UserFormServiceImplTestContextConfiguration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by steve on 11/13/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)
public class RecordConfigServiceImplTest {

    @Autowired
    RecordConfigService recordConfigService;
    @Test
    public void testGetRecordConfigByUserIdAndTableFormId() throws Exception {
        List list = recordConfigService.getRecordConfigByUserIdAndTableFormId(1, "4028808550fef0dc0150fef212130003");
        RecordConfig recordConfig = (RecordConfig)list.get(0);

        System.out.println(recordConfig.getTableForm().getContent());
    }
}