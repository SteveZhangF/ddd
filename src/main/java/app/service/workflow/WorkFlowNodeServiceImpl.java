/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.workflow;

import app.dao.workflow.WorkFlowNodeDao;
import app.model.wordflow.WorkFlowNode;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by steve on 10/24/15.
 */
@Service
public class WorkFlowNodeServiceImpl extends BaseGenericServiceImpl<WorkFlowNode,String> implements WorkFlowNodeService{

    @Autowired
    private WorkFlowNodeDao workFlowNodeDao;

    @Override
    public void delete(WorkFlowNode entity) {
        workFlowNodeDao.delete(entity);
    }

    @Override
    public WorkFlowNode get(String id) {
        return workFlowNodeDao.get(id);
    }

    @Override
    public WorkFlowNode load(String id) {
        return workFlowNodeDao.load(id);
    }

    @Override
    public List<WorkFlowNode> loadAll() {
        return workFlowNodeDao.loadAll();
    }

    @Override
    public void save(WorkFlowNode entity) {
        workFlowNodeDao.save(entity);
    }

    @Override
    public void saveOrUpdate(WorkFlowNode entity) {
        workFlowNodeDao.saveOrUpdate(entity);
    }

    @Override
    public void update(WorkFlowNode entity) {
        workFlowNodeDao.update(entity);
    }
}
