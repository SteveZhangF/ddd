package app.service.form;

import app.dao.form.FormDao;
import app.model.forms.Form;
import app.model.report.Question;
import app.newService.BaseGenericServiceImpl;
import app.service.question.QuestionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.Criteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

/**
 * Created by steve on 10/9/15.
 */

@Service("formService")
@Transactional
public class FormServiceImpl extends BaseGenericServiceImpl<Form,Integer> implements FormService {


    @Autowired
    FormDao formDao;
    @Override
    public void delete(Form entity) {
        formDao.delete(entity);
    }
    @Override
    public Form get(Integer id) {
        return formDao.get(id);
    }

    @Override
    public Form load(Integer id) {
        return formDao.load(id);
    }

    @Override
    public List<Form> loadAll() {
        return formDao.loadAll();
    }

    @Override
    public void save(Form entity) {
        formDao.save(entity);
    }

    @Override
    public void saveOrUpdate(Form entity) {
        formDao.saveOrUpdate(entity);
    }

    @Override
    public void update(Form entity) {
        formDao.update(entity);
    }


//    private int id;
//    private String content;
//    private Date createTime;
//    private Date updateTime;
//    private String form_desc;
//    private String form_name;
//    private FormType formType;
    @Override
    public List<Form> getFormListforMenu() {
        String[] fields = {"id","createTime","updateTime","form_desc","form_name","formType"};
        return formDao.getListbyField(fields);
    }

    @Autowired
    QuestionService questionService;
    @Override
    public boolean updateFormContent(int id,String json) throws IOException {
        //        String s = "{\"id\":1," +
//                "\"content\":\"<p>{-<plugin id=\\\"1\\\" question_id=\\\"1\\\" name=\\\"fdvfdsv\\\"><input class=\\\"\\\" type=\\\"text\\\" disabled=\\\"disabled\\\" title=\\\"fdvfdsv\\\"></plugin>-}</p>\"," +
//                "\"createTime\":null," +
//                "\"updateTime\":null," +
//                "\"form_desc\":\"dad\"," +
//                "\"form_name\":\"newform\"," +
//                "\"formType\":\"CompanyForm\"," +
//                "\"questions\":[{\"id\":\"1\"}]}";
        Form form = this.get(id);
        if(form == null){
            return false;
        }
        ObjectMapper mapper = new ObjectMapper();
        JsonNode fnode = mapper.readTree(json);
        String content = fnode.path("content").asText();
        form.setContent(content);
        form.setUpdateTime(new Date(new java.util.Date().getTime()));
        JsonNode questions = fnode.path("questions");
        form.getQuestions().clear();
        for(JsonNode question:questions){
            int qid = question.path("id").asInt();
            Question questionObject = questionService.get(qid);
            form.getQuestions().add(questionObject);
        }
        this.update(form);
        return true;
    }

}
