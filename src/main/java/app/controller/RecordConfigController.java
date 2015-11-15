/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.forms.TableForm;
import app.model.userfield.RecordConfig;
import app.service.form.TableFormService;
import app.service.userFields.RecordConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by steve on 11/12/15.
 */
@RestController
public class RecordConfigController {
    ///user/recordConfig/
    @Autowired
    TableFormService tableFormService;
    @Autowired
    RecordConfigService recordConfigService;

    //load all for list
    @RequestMapping(value = "/user/recordConfig/tableForm/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TableForm>> getAllTableForm() {
        List<TableForm> tableForms = tableFormService.getTableFormsForList();
        return new ResponseEntity<>(tableForms, HttpStatus.OK);
    }

    //    getOneRecord: function (id) {
//        return $http.get('/user/recordConfig/'+id)
//                .then(
//                        function (response) {
//            return response.data
//        },
//        function (errResponse) {
//            return $q.reject(errResponse);
//        }
//        );
//    },
    @RequestMapping(value = "/user/recordConfig/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RecordConfig> getOneRecordConfig(@RequestParam int userId, @RequestParam String tableFormId) {

        List<RecordConfig> list = recordConfigService.getRecordConfigByUserIdAndTableFormId(userId, tableFormId);
        if (list.size() == 0) {
            TableForm tableForm = tableFormService.get(tableFormId);
            RecordConfig recordConfig = new RecordConfig();
            recordConfig.setUser_id(userId);
            recordConfig.setTableForm(tableForm);
            recordConfigService.save(recordConfig);
            return new ResponseEntity<>(recordConfig, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(list.get(0), HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/user/recordConfig/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RecordConfig> getOneRecordConfig(@PathVariable("id")String id,@RequestBody RecordConfig recordConfig ) {
        RecordConfig recordConfig1 = recordConfigService.get(id);
        if(recordConfig1 == null){
            return new ResponseEntity<RecordConfig>(HttpStatus.NOT_FOUND);
        }else{
            recordConfigService.update(recordConfig);
            return new ResponseEntity<RecordConfig>(recordConfig,HttpStatus.OK);
        }
    }



}
