/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.file;

import app.model.files.FileElement;
import app.model.files.FileFileElement;
import app.model.files.FolderFileElement;
import app.model.files.QuestionFileElement;
import app.service.form.UserFormServiceImplTestContextConfiguration;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

/**
 * Created by steve on 11/23/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)

public class FileServiceImplTest {
    @Autowired
    FileService fileService;

//    @Test
//    public void testLoadTreeBasedOnNodeId() throws IOException {
//        FileElement root = fileService.get("4028808351333086015133308fb50000");
//////        root.setLeaf(false);
//////        root.setLevel(0);
//////        root.setRoot(true);
//////        root.setDeleted(false);
//////        root.setName("ROOT");
//        QuestionFileElement q1 = new QuestionFileElement();
//        q1.setName("QUESTION1");
//        q1.setParent(root);
//        q1.setDeleted(false);
//        q1.setQuestionType("TEXT");
//        fileService.save(q1);
//
//        FileElement rootz = fileService.get("4028808351332d870151332d90110000");
//        ObjectMapper mapper = new ObjectMapper();
//        StringWriter sw = new StringWriter();
//        mapper.writeValue(sw,rootz);
//        System.out.println(sw.toString());
//        System.out.println(rootz.getChildren().size());
//    }
    @Test
    public void testGetChildrenByParentIdAndTypes() throws IOException {
        String json = "{\"parent_id\":\"402880835138a725015138a865da0001\",\"name\":\"newfile\",\"content\":\"<p>{-<plugin id=\\\"{+id+}\\\" question_id=\\\"40288083513acd6101513acdcb110000\\\" name=\\\"question2\\\" questiontype=\\\"textarea\\\"><textarea class=\\\"\\\" disabled=\\\"disabled\\\" title=\\\"question2\\\"></textarea></plugin>-}</p>\",\"description\":\"newfile\"\n" +
                "    ,\n" +
                "    \"questions\":[\n" +
                "        {\"id\":\"40288083513af39e01513b0541430002\",\"name\":\"dddddd\",\"description\":null,\"createTime\":1448394178883,\"updateTime\":1448394178883,\"level\":0,\"leaf\":true,\"parent_id\":\"402880835138a725015138a7ee710000\",\"deleted\":false,\"root\":false,\"type\":\"QUESTION\",\"questionType\":\"select\",\"content\":\"<plugin id=\\\"{+id+}\\\"><select class=\\\"form-control\\\"></select></plugin>\",\"options\":[{\"id\":2,\"name\":\"ddd\",\"description\":null}]}\n" +
                "        ]\n" +
                "    \n" +
                "    \n" +
                "}";
        ObjectMapper mapper = new ObjectMapper();
        StringReader sr = new StringReader(json);

        FileFileElement fileFileElement = mapper.readValue(sr, FileFileElement.class);
        System.out.println(fileFileElement.getName());

    }
}
