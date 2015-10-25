/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.service.workflow;

import app.dao.workflow.WorkFlowDao;
import app.model.wordflow.WorkFlow;
import app.newService.BaseGenericServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;

/**
 * Created by steve on 10/9/15.
 */

@Service("workFlowService")
@Transactional
public class WorkFlowServiceImpl extends BaseGenericServiceImpl<WorkFlow, String> implements WorkFlowService {


    @Autowired
    WorkFlowDao workFlowDao;

    @Override
    public void delete(WorkFlow entity) {
        workFlowDao.delete(entity);
    }

    @Override
    public WorkFlow get(String id) {
        return workFlowDao.get(id);
    }

    @Override
    public WorkFlow load(String id) {
        return workFlowDao.load(id);
    }

    @Override
    public List<WorkFlow> loadAll() {
        return workFlowDao.loadAll();
    }

    @Override
    public void save(WorkFlow entity) {
        workFlowDao.save(entity);
    }

    @Override
    public void saveOrUpdate(WorkFlow entity) {
        workFlowDao.saveOrUpdate(entity);
    }

    @Override
    public void update(WorkFlow entity) {
        workFlowDao.update(entity);
    }

    @Override
    public List<WorkFlow> getListForMenu() {
        String[] fields = {"id","name","description"};
        return workFlowDao.getListbyField(fields);
    }
}

