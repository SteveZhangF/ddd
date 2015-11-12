///*
// * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
// * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
// * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
// * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
// * Vestibulum commodo. Ut rhoncus gravida arcu.
// */
//
//package app.service.userconstructure.impl;
//
//import app.model.forms.FormType;
//import app.model.userconstructure.Company;
//import app.model.userconstructure.OrganizationElement;
//import app.service.form.UserFormServiceImplTestContextConfiguration;
//import app.service.userconstructure.CompanyService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.test.context.support.AnnotationConfigContextLoader;
//
//import java.io.IOException;
//import java.io.StringReader;
//
///**
// * Created by steve on 10/16/15.
// */
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = UserFormServiceImplTestContextConfiguration.class, loader = AnnotationConfigContextLoader.class)
//public class DepartmentServiceImplTest {
//
//    @Autowired
//    DepartmentService departmentService;
//    @Autowired
//    CompanyService companyService;
//    //@Test
//    public void testSave() throws IOException {
//        ObjectMapper mapper = new ObjectMapper();
//        StringReader sr  = new StringReader("{\"uuid\":null,\"name\":\"newdepartment\",\"address\":\"ee\",\"phone\":\"aa\",\"formType\":\"DepartmentForm\",\"company_id\":\"40288091507179050150717e7e1a0000\",\"children\":[],\"parent_id\":\"402880915071abff015071ac06640000\"}");
//        Department department = mapper.readValue(sr, Department.class);
//        String company_id = department.getCompany_id();
//        System.out.println("company id = " + company_id);
//        String parent_id = department.getParent_id();
//        System.out.println("parent id = " + parent_id);
//        Company company = companyService.get(parent_id);
//        if(company!=null){
//            company.getChildren().add(department);
//            department.setParent(company);
//        }else{
//            Department parent = departmentService.get(parent_id);
//            if(parent!=null){
//                parent.getChildren().add(department);
//                department.setParent(parent);
//            }else{
//                department.setParent(companyService.get(company_id));
//            }
//        }
//        departmentService.save(department);
//    }
//
//   // @Test
//    public void testGet(){
////        Company company = companyService.get("40288091507179050150717e7e1a0000");
////        System.out.println(company.getChildren().size());
//        Department department = departmentService.get("4028809150718f940150718f9bb80000");
//        System.out.println(department.getChildren().size());
//    }
//
//    //@Test
//    public void testDelete(){
//        Department department = departmentService.get("402880915071ab62015071ab67ff0000");
//        for(OrganizationElement organizationElement :department.getChildren()){
//            organizationElement.setParent(department.getParent());
//            System.out.println(organizationElement.getFormType());
//            if(organizationElement.getFormType().equals(FormType.DepartmentForm)){
//                departmentService.update((Department)organizationElement);
//            }else {
//
//            }
//        }
//        department.getChildren().clear();
//        departmentService.delete(department);
//    }
//
//    @Test
//    public void testUpdate() throws IOException {
//        ObjectMapper mapper = new ObjectMapper();
//        StringReader sr  = new StringReader("{\"uuid\":\"402880915071abff015071ac06640000\",\"name\":\"newdepartment\",\"address\":\"e2222e\",\"phone\":\"aa\",\"formType\":\"DepartmentForm\",\"company_id\":\"40288091507179050150717e7e1a0000\",\"children\":[],\"parent_id\":\"402880915071ab62015071ab67ff0000\"}");
//        Department department = mapper.readValue(sr, Department.class);
//        String company_id = department.getCompany_id();
//        System.out.println("company id = " + company_id);
//        String parent_id = department.getParent_id();
//        System.out.println("parent id = " + parent_id);
//        Company company = companyService.get(parent_id);
//        if(company!=null){
//            company.getChildren().add(department);
//            department.setParent(company);
//        }else{
//            Department parent = departmentService.get(parent_id);
//            if(parent!=null){
//                parent.getChildren().add(department);
//                department.setParent(parent);
//            }else{
//                department.setParent(companyService.get(company_id));
//            }
//        }
//        departmentService.update(department);
//    }
//
//
//}