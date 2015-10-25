package app.controller;

import app.model.forms.Form;
import app.model.report.Question;
import app.service.form.FormService;
import app.service.question.QuestionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

/**
 * Created by steve on 10/10/15.
 */
@RestController
public class FormController {

    @Autowired
    FormService formService;  //Service which will do all data retrieval/manipulation work


    //-------------------Retrieve All FormTables --------------------------------------------------------

    @RequestMapping(value = "/formtable/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Form>> listAllFormTable() {
        List<Form> formTables = formService.getFormListforMenu();
        if (formTables.isEmpty()) {
            return new ResponseEntity<List<Form>>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<List<Form>>(formTables, HttpStatus.OK);
    }
//
//
    //-------------------Retrieve Single FormTable--------------------------------------------------------

    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Form> getForm(@PathVariable("id") int id) {
        Form formTable = formService.get(id);
        if (formTable == null) {
            return new ResponseEntity<Form>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Form>(formTable, HttpStatus.OK);
    }

    //
//    //-------------------Create a FormTable--------------------------------------------------------
//
    @RequestMapping(value = "/formtable/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Form> createForm(@RequestBody Form form) {
        //TODO generate the form table record and create table in the database
        try {
            formService.save(form);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(form, HttpStatus.CREATED);
    }

    //
//    //------------------- Update a FormTable (maybe not useful) --------------------------------------------------------
//
    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Form> updateFormTable(@PathVariable("id") int id, @RequestBody Form form) {
//        content: null
//        createTime: null
//        formType: "CompanyForm"
//        form_desc: "dad"
//        form_name: "newform"
//        id: 1
//        updateTime: null
        Form form1 = formService.get(id);
        if (form1 != null) {
            form1.setForm_name(form.getForm_name());
            form1.setUpdateTime(new Date(new java.util.Date().getTime()));
            form1.setFormType(form.getFormType());
            form1.setForm_desc(form.getForm_desc());
            formService.update(form1);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @Autowired
    QuestionService questionService;
    @RequestMapping(value = "/formtable/detail/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Form> updateFormDetail(@PathVariable("id") int id, @RequestBody String json) throws IOException {
        formService.updateFormContent(id,json);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //
//
//    //------------------- Delete a formtable --------------------------------------------------------
//
    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Form> deleteFormbyID(@PathVariable("id") int id) {

        Form formTable = formService.get(id);
        if (formTable == null) {
            System.out.println("Unable to delete. Company with id " + id + " not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        formService.delete(formTable);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}