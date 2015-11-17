/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.question;

import app.dao.question.QuestionDao;
import app.model.report.Question;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by steve on 10/18/15.
 */
@Service
public class QuestionServiceImpl extends BaseGenericServiceImpl<Question,Integer> implements QuestionService {

    @Autowired
    private QuestionDao questionDao;

    @Override
    public void delete(Question entity) {
        questionDao.delete(entity);
    }

    @Override
    public Question get(Integer id) {
        return questionDao.get(id);
    }

    @Override
    public Question load(Integer id) {
        return questionDao.load(id);
    }

    @Override
    public List<Question> loadAll() {
        return questionDao.loadAll();
    }

    @Override
    public void save(Question entity) {
        questionDao.save(entity);
    }

    @Override
    public void saveOrUpdate(Question entity) {
        questionDao.saveOrUpdate(entity);
    }

    @Override
    public void update(Question entity) {
        questionDao.update(entity);
    }

    @Override
    public void setPluginId(Question question) {
        String content = question.getContent();
        if(content.contains("{+id+}")){
            content = content.replace("{+id+}",""+question.getId());
            question.setContent(content);
            this.update(question);
        }
    }

    @Override
    public List<Question> getQuestionsByFormId(int form_id) {
        return  questionDao.getQuestionsByFormId(form_id);
    }
}
