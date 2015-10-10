package app.controller;

import app.model.form.FormTable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by steve on 10/10/15.
 */

@Controller
public class UserFormController {

    @RequestMapping(value = "/userform/view/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<FormTable> su(@PathVariable("id") int id) {

//        FormTable formTable = formService.findbyID(id);
//        if (formTable == null) {
//            return new ResponseEntity<FormTable>(HttpStatus.NOT_FOUND);
//        }
//
//
//        formService.delete(formTable);
        return new ResponseEntity<FormTable>(HttpStatus.OK);
    }
}
