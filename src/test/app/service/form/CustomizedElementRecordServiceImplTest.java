///*
// * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
// * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
// * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
// * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
// * Vestibulum commodo. Ut rhoncus gravida arcu.
// */
//
//package app.service.form;
//
//import app.model.forms.CustomizedElement;
//import app.model.forms.CustomizedElementField;
//import app.model.forms.CustomizedElementRecord;
//import app.model.forms.CustomizedElementRecordValue;
//import app.model.report.Question;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.test.context.support.AnnotationConfigContextLoader;
//
//import java.io.StringWriter;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import static org.junit.Assert.*;
//
///**
// * Created by steve on 11/22/15.
// */
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)
//public class CustomizedElementRecordServiceImplTest {
//
//    @Autowired
//    CustomizedElementRecordService customizedElementRecordService;
//    @Autowired
//    CustomizedElementService customizedElementService;
//    @Test
//    public void testListCustomizedElementRecordByUserIdAndElementId() throws Exception {
//        CustomizedElement customizedElement = customizedElementService.loadAll().get(0);
//        customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(1,customizedElement);
//    }
//    @Test
//    public void testSave() throws Exception {
////        CustomizedElement customizedElement = customizedElementService.loadAll().get(0);
////        "values":[
////        {
////            "id":"40288083512fe8b301512fe8ba0e0001",
////                "customizedElementField":{
////            "id":"40288083512f034b01512f04d6010001",
////                    "name":"name",
////                    "description":null,
////                    "type":"String"
////        },
////            "value":"vasdad"
////        }
////        ],
//        String json = "[\n" +
//                "        {\n" +
//                "            \"id\":\"40288083512fe8b301512fe8ba0e0001\",\n" +
//                "                \"customizedElementField\":{\n" +
//                "            \"id\":\"40288083512f034b01512f04d6010001\",\n" +
//                "                    \"name\":\"name\",\n" +
//                "                    \"description\":null,\n" +
//                "                    \"type\":\"String\"\n" +
//                "        },\n" +
//                "            \"value\":\"vasdad\"\n" +
//                "        }\n" +
//                "        ]";
//        ObjectMapper mapper = new ObjectMapper();
//        List<CustomizedElementRecordValue> values = mapper.readValue(json, ArrayList.class);
//        System.out.println(values.get(0).getClass().getName());
////        questionService.save(question);
////        List<CustomizedElementRecordValue> values = new ArrayList<>();
////        for(CustomizedElementField field:customizedElement.getFields()){
////            CustomizedElementRecordValue value = new CustomizedElementRecordValue();
////            value.setCustomizedElementField(field);
////            value.setValue("vasdad");
////            values.add(value);
////        }
////        customizedElementRecordService.createCustomizedElementRecord(1,customizedElement,values);
////
////
////        List list = customizedElementRecordService.listCustomizedElementRecordByUserIdAndElementId(1, customizedElement);
////        ObjectMapper objectMapper = new ObjectMapper();
////        StringWriter sw = new StringWriter();
////        objectMapper.writeValue(sw,list);
////        System.out.println(sw.toString());
//    }
//}