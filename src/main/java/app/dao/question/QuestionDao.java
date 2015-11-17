/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.question;

import app.model.report.Question;
import app.newDao.IBaseGenericDAO;

import java.util.List;

/**
 * Created by steve on 10/18/15.
 */
public interface QuestionDao extends IBaseGenericDAO<Question,Integer> {

    List<Question> getQuestionsByFormId(int form_id);
}
