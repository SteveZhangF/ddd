package app.controller;

import app.service.form.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

/**
 * Created by steve on 10/10/15.
 */

@Controller
public class UserFormController {


//    @Autowired
//    FormService formService;
//    @Autowired
//    UserFormService userFormService;
//
//    // view the form
//    @RequestMapping(value = "/userform/view/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<FormTable> su(@PathVariable("id") int id) {
//
//        FormTable formTable = formService.get(id);
//        if (formTable == null) {
//            return new ResponseEntity<FormTable>(HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity<FormTable>(formTable, HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/userform/viewrecord/",method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity viewRecord (@RequestBody Map<String,String> map) throws ClassNotFoundException {
//        userFormService.query(Integer.valueOf(map.get("form_id")),null);
//
//        return new ResponseEntity(HttpStatus.OK);
//    }
//
//    @RequestMapping(value="",method=RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity insertRecord(@RequestBody Map<String,Object> map){
//        int form_id = Integer.valueOf((String)map.get("form_id"));
//        userFormService.insert(form_id,map);
//        return null;
//    }
}
