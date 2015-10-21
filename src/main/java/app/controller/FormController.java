package app.controller;

import app.model.forms.Form;
import app.service.form.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(form, HttpStatus.CREATED);
    }
//
//    //------------------- Update a FormTable (maybe not useful) --------------------------------------------------------
//
    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Form> updateFormTable(@PathVariable("id") int id, @RequestBody Form form) {
        formService.update(form);
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