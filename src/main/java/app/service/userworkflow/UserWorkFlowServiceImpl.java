/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.userworkflow;

import app.dao.UserWorkFlow.UserWorkFlowDao;
import app.dao.workflow.WorkFlowDao;
import app.model.wordflow.WorkFlow;
import app.model.wordflow.workflowUser.UserWorkFlow;
import app.newService.BaseGenericServiceImpl;
import app.service.workflow.WorkFlowService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Created by steve on 10/15/15.
 */
public class UserWorkFlowServiceImpl extends BaseGenericServiceImpl<UserWorkFlow, String> implements UserWorkFlowService {
    @Autowired
    UserWorkFlowDao userWorkFlowDao;

    @Override
    public void delete(UserWorkFlow entity) {
        userWorkFlowDao.delete(entity);
    }

    @Override
    public UserWorkFlow get(String id) {
        return userWorkFlowDao.get(id);
    }

    @Override
    public UserWorkFlow load(String id) {
        return userWorkFlowDao.load(id);
    }

    @Override
    public List<UserWorkFlow> loadAll() {
        return userWorkFlowDao.loadAll();
    }

    @Override
    public void save(UserWorkFlow entity) {
        userWorkFlowDao.save(entity);
    }

    @Override
    public void saveOrUpdate(UserWorkFlow entity) {
        userWorkFlowDao.saveOrUpdate(entity);
    }

    @Override
    public void update(UserWorkFlow entity) {
        userWorkFlowDao.update(entity);
    }
}
