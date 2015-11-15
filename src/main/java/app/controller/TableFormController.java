/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.forms.TableForm;
import app.model.forms.TableFormField;
import app.model.userconstructure.Employee;
import app.service.form.TableFormFieldService;
import app.service.form.TableFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by steve on 11/12/15.
 */
@RestController
public class TableFormController {
    @Autowired
    TableFormService tableFormService;

    //load all for list
    @RequestMapping(value = "/tableForm/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TableForm>> getAllTableForm() {
        List<TableForm> tableForms = tableFormService.getTableFormsForList();
        return new ResponseEntity<>(tableForms, HttpStatus.OK);
    }

    @RequestMapping(value = "/tableForm/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TableForm> getOneTableForm(@PathVariable("id") String id) {
        TableForm tableForm = tableFormService.get(id);
        if(tableForm == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(tableForm, HttpStatus.OK);
    }

// create a new table form
    @RequestMapping(value = "/tableForm/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TableForm> saveTableForm(@RequestBody TableForm tableForm) {
        try {
            Timestamp date = new Timestamp(new java.util.Date().getTime());
            tableForm.setCreateTime(date);
            tableForm.setUpdateTime(date);
            tableFormService.save(tableForm);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(tableForm, HttpStatus.OK);
    }


    @RequestMapping(value = "/tableForm/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TableForm> updateTableForm(@PathVariable("id") String id, @RequestBody TableForm tableForm) {
        if(tableFormService.get(id) == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        Timestamp date = new Timestamp(new java.util.Date().getTime());
        tableForm.setUpdateTime(date);
        tableFormService.update(tableForm);
        return new ResponseEntity<>(tableForm, HttpStatus.OK);
    }

    //------------------- Delete Table Forms by ids[] --------------------------------------------------------

    @RequestMapping(value = "/tableForm/delete/", method = RequestMethod.POST)
    public ResponseEntity<TableForm> deleteTableForms(@RequestBody String[] ids) {
        for(String id:ids){
            try {
                TableForm tableForm = tableFormService.get(id);
                if (tableForm == null) {
                    continue;
                }
                tableFormService.delete(tableForm);
            }catch (Exception e){
                return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //fields

    @Autowired
    TableFormFieldService tableFormFieldService;


    // create a new table form
    @RequestMapping(value = "/tableForm/fields/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TableFormField> saveField(@RequestBody TableFormField field) {
        try {
            tableFormFieldService.save(field);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(field, HttpStatus.OK);
    }

    @RequestMapping(value = "/tableForm/fields/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TableFormField> deleteTableFormField(@PathVariable String id) {

        TableFormField field = tableFormFieldService.get(id);
        if(field == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        else
            tableFormFieldService.delete(field);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/tableForm/fields/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TableFormField> updateTableFormField(@PathVariable("id") String id, @RequestBody TableFormField formField) {
        if(tableFormFieldService.get(id) == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        tableFormFieldService.update(formField);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
