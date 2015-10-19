/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.question;

import app.dao.question.AnswerDao;
import app.model.report.Answer;
import app.newService.BaseGenericServiceImpl;
import app.newService.IBaseGenericService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by steve on 10/18/15.
 */
@Service
public class AnswerServiceImpl extends BaseGenericServiceImpl<Answer,Integer> implements AnswerService {

    @Autowired
    AnswerDao answerDao;

    @Override
    public void delete(Answer entity) {
        answerDao.delete(entity);
    }

    @Override
    public Answer get(Integer id) {
        return answerDao.get(id);
    }

    @Override
    public Answer load(Integer id) {
        return answerDao.load(id);
    }

    @Override
    public List<Answer> loadAll() {
        return answerDao.loadAll();
    }

    @Override
    public void save(Answer entity) {
        answerDao.save(entity);
    }

    @Override
    public void saveOrUpdate(Answer entity) {
        answerDao.saveOrUpdate(entity);
    }

    @Override
    public void update(Answer entity) {
        answerDao.update(entity);
    }
}
