package app.controller;

import app.message.Message;
import app.model.report.Question;
import app.model.report.Record;
import app.service.form.FormService;
import app.service.question.QuestionService;
import app.service.question.RecordService;
import app.service.system.UserService;
import app.service.userconstructure.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/10/15.
 */

@Controller
public class UserFormController {


    @Autowired
    UserService userService;
    @Autowired
    CompanyService companyService;
    @Autowired
    RecordService recordService;
    @Autowired
    FormService formService;
    @Autowired
    QuestionService questionService;

    // return the records which related to the given question id based on userid, oeid(companyid)
    @RequestMapping(value = "/user/form/record/{user_id}/{oe_id}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> getFormContentWithRecord(@PathVariable("user_id") int user_id,
                                                                 @PathVariable("oe_id") String oe_id, @RequestBody String[] questionids) {
        List<Record> records = new ArrayList<>();
        for (String qid : questionids) {
            Map<String, Object> map = new HashMap<>();
            map.put("oeId", oe_id);
            map.put("userId", user_id);
            map.put("questionId", qid);
            List<Record> list = recordService.getListbyParams(map);
            if (list.size() > 0) {
                records.add(list.get(0));
            }
        }
        return new ResponseEntity<>(Message.getSuccessMsg("Load records success",records), HttpStatus.OK);
    }

    @RequestMapping(value = "/user/form/questions/{form_id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Question>> getQuestionsByFormId(@PathVariable("form_id") int form_id) {
        List<Question> questions = questionService.getQuestionsByFormId(form_id);
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }

    @RequestMapping(value = "/user/form/saveValue/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Record>> saveQuestionValues(@RequestBody Record[] records) {
        for (Record record : records) {
            String oeId =record.getOeId();
            String questionId = record.getQuestionId();
            int userId = record.getUserId();
            Map<String, Object> map = new HashMap<>();
            map.put("oeId",oeId);
            map.put("userId",userId);
            map.put("questionId",questionId);
            List<Record> list = recordService.getListbyParams(map);
            if(list.size() == 0){
                recordService.save(record);
            }else{
                list.get(0).setValue(record.getValue());
                recordService.update(list.get(0));
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


}
