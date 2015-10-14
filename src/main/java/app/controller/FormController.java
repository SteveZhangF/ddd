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

    @RequestMapping(value = "/formtable/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<FormTable>> listAllFormTable() {
        List<FormTable> formTables = formService.loadAll();
        if (formTables.isEmpty()) {
            return new ResponseEntity<List<FormTable>>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<List<FormTable>>(formTables, HttpStatus.OK);
    }


    //-------------------Retrieve Single FormTable--------------------------------------------------------

    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormTable> getForm(@PathVariable("id") int id) {
        FormTable formTable = formService.get(id);
        if (formTable == null) {
            return new ResponseEntity<FormTable>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<FormTable>(formTable, HttpStatus.OK);
    }


    //-------------------Create a FormTable--------------------------------------------------------

    @RequestMapping(value = "/formtable/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormTable> createForm(@RequestBody String json) {
        //TODO generate the form table record and create table in the database
        FormParser formParser = new FormParser(json);
        FormTable ft = formParser.parseForm(null);
        formService.save(ft);
        ft.setTable_name("CSTBL_" + ft.getId());
        formService.update(ft);
        formService.generatorTable(ft);

        return new ResponseEntity<FormTable>(ft, HttpStatus.CREATED);
    }

    //------------------- Update a FormTable (maybe not useful) --------------------------------------------------------

    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormTable> updateFormTable(@PathVariable("id") int id, @RequestBody String json) {

        FormParser formParser = new FormParser(json);
        FormTable ft2 = formService.get(id);
        ft2.clearColumn();
        System.out.println(ft2.getTable_name());
        formParser.parseForm(ft2);
        System.out.print("==========updating---");
        System.out.print(ft2.getTable_name());
        formService.update(ft2);
        formService.generatorTable(ft2);
        System.out.print("---updating end============");
        return new ResponseEntity<FormTable>(ft2, HttpStatus.OK);
    }


    //------------------- Delete a formtable --------------------------------------------------------

    @RequestMapping(value = "/formtable/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FormTable> deleteFormbyID(@PathVariable("id") int id) {

        FormTable formTable = formService.get(id);
        if (formTable == null) {
            System.out.println("Unable to delete. Company with id " + id + " not found");
            return new ResponseEntity<FormTable>(HttpStatus.NOT_FOUND);
        }
        formService.delete(formTable);
        return new ResponseEntity<FormTable>(HttpStatus.OK);
    }

}