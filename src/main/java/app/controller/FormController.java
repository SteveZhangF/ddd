package app.controller;

import app.helper.FormParser;
import app.model.form.FormTable;
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

    @RequestMapping(value = "/formtable/", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<FormTable>> listAllFormTable() {
        List<FormTable> formTables = formService.list();
        if (formTables.isEmpty()) {
            return new ResponseEntity<List<FormTable>>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<List<FormTable>>(formTables, HttpStatus.OK);
    }


    //-------------------Retrieve Single FormTable--------------------------------------------------------

    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormTable> getForm(@PathVariable("id") int id) {
        FormTable formTable = formService.findbyID(id);
        if (formTable == null) {
            return new ResponseEntity<FormTable>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<FormTable>(formTable, HttpStatus.OK);
    }


    //-------------------Create a FormTable--------------------------------------------------------

    @RequestMapping(value = "/formtable/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormTable> createForm(@RequestBody String formTable) {
        System.out.println(formTable);

        //TODO generate the form table record and create table in the database
        FormParser formParser = new FormParser(formTable);
        FormTable ft = formParser.parseForm();
        formService.save(ft);
        formService.generatorTable(ft);
        return new ResponseEntity<FormTable>(ft, HttpStatus.CREATED);
    }

    //------------------- Update a FormTable (maybe not useful) --------------------------------------------------------

    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormTable> updateFormTable(@PathVariable("id") int id, @RequestBody String formTable) {
//        formTable.setId(id);
//        formService.update(formTable);
        FormParser formParser = new FormParser(formTable);
        FormTable ft = formParser.parseForm();
        formService.save(ft);
        formService.generatorTable(ft);
        return new ResponseEntity<FormTable>(ft, HttpStatus.OK);
    }


    //------------------- Delete a formtable --------------------------------------------------------

    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.DELETE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormTable> deleteFormbyID(@PathVariable("id") int id) {

        FormTable formTable = formService.findbyID(id);
        if (formTable == null) {
            System.out.println("Unable to delete. Company with id " + id + " not found");
            return new ResponseEntity<FormTable>(HttpStatus.NOT_FOUND);
        }
        formService.delete(formTable);
        return new ResponseEntity<FormTable>(HttpStatus.OK);
    }

}