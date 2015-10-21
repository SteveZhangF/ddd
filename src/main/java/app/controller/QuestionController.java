/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import app.model.report.Question;
import app.service.question.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by steve on 10/18/15.
 */
@RestController
public class QuestionController {
    @Autowired
    QuestionService questionService;
    @RequestMapping(value = "/question/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Question>> getAllQuestion() {
        List<Question> questions = questionService.loadAll();
        return new ResponseEntity<>(questions,HttpStatus.OK);
    }
    @RequestMapping(value = "/question/",method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Question> saveQuestion(@RequestBody Question question){
        try {
            questionService.save(question);
            questionService.setPluginId(question);
        }catch (Exception e){
            e.printStackTrace();
            return  new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(question,HttpStatus.OK);
    }

    @RequestMapping(value = "/question/{id}",method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Question> deleteQuestion(@PathVariable("id") int id){
        try{
            Question question = questionService.get(id);
            if(question == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }else{
                questionService.delete(question);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @RequestMapping(value="/question/{id}",method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Question> updateQuestion(@PathVariable("id") int id, @RequestBody Question question){
        try{
            questionService.update(question);
            questionService.setPluginId(question);
            return new ResponseEntity<>(question,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

}
