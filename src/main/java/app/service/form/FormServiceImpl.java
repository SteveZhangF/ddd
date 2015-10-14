package app.service.form;

import app.dao.form.FormDao;
import app.helper.ObjectGenerator;
import app.model.form.ColumnAttribute;
import app.model.form.FormTable;
import app.newService.BaseGenericServiceImpl;
import freemarker.template.Template;
import org.hibernate.cfg.Configuration;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * Created by steve on 10/9/15.
 */

@Service("formService")
@Transactional
public class FormServiceImpl extends BaseGenericServiceImpl<FormTable,Integer> implements FormService {


    @Autowired
    FormDao formDao;
    @Override
    public void delete(FormTable entity) {
//        super.delete(entity);
        formDao.delete(entity);
    }

    @Override
    public FormTable get(Integer id) {
        return formDao.get(id);
    }

    @Override
    public FormTable load(Integer id) {
        return formDao.load(id);
    }

    @Override
    public List<FormTable> loadAll() {
        return formDao.loadAll();
    }

    @Override
    public void save(FormTable entity) {
        formDao.save(entity);
    }

    @Override
    public void saveOrUpdate(FormTable entity) {
        formDao.saveOrUpdate(entity);
    }

    @Override
    public void update(FormTable entity) {
        formDao.update(entity);
    }

    /**
     * actually, it should named createTable.
     * Create or update the table based on the FormTable
     *
     * @Param FormTable table information
     */
    @Override
    public void generatorTable(FormTable tableVo) {
        if (tableVo.getColumnAttributes().isEmpty()) {
            System.out.println(" column attr list size==0 ");
            return;
        }

        Template tl;
        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("entity", tableVo);

            tl = getTemplateConfig("/").getTemplate(
                    SQLTYPE.CREATE.getPath());
            Writer out = new StringWriter();
            tl.process(paramMap, out);
            String hbxml = out.toString();
            System.out.println(hbxml);
            Configuration hbcfg = this.getHibernateCfg(hbxml);

            createDbTableByCfg(hbcfg);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String generateInsertSQL(FormTable formTable) {
        if (formTable.getColumnAttributes().isEmpty()) {
            System.out.println(" column attr list size==0 ");
            return null;
        }

        Template tl;
        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("entity", formTable);

            tl = getTemplateConfig("/").getTemplate(
                    SQLTYPE.INSERT.getPath());
            Writer out = new StringWriter();
            tl.process(paramMap, out);
            String insertsql = out.toString();
            return insertsql;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Map<String, Object> generateSelectSQL(FormTable formTable, Map<String, Object> foreignMap) throws ClassNotFoundException {
        Map<String, Object> result = new HashMap<>();
        if (formTable.getColumnAttributes().isEmpty()) {
            System.out.println(" column attr list size==0 ");
            return null;
        }
        // 设置类成员属性
        HashMap propertyMap = new HashMap();
        for (ColumnAttribute columnAttribute : formTable.getColumnAttributes()) {
            String type = "java.lang.String";
            String name = columnAttribute.getColumn_Name();
            if (columnAttribute.getPlugins().equals("macros")) {
                if (columnAttribute.getColumn_type().equals("date")) {
                    type = "java.sql.Date";
                }
                name = columnAttribute.getOrgtype();

            }
            propertyMap.put(name, Class.forName(type));
        }
        propertyMap.put("ID",Class.forName("java.lang.Integer"));
        // 生成动态 Bean
        ObjectGenerator bean = new ObjectGenerator(propertyMap);

        result.put("bean", bean);
        Template tl;
        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("entity", formTable);
            paramMap.put("foreignMap", foreignMap);

            tl = getTemplateConfig("/").getTemplate(
                    SQLTYPE.SELECT.getPath());
            Writer out = new StringWriter();
            tl.process(paramMap, out);
            String selectSQL = out.toString();
            result.put("sql", selectSQL);
            result.put("form",formTable);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取freemarker的cfg
     *
     * @param resource
     * @return Configuration
     */
    private freemarker.template.Configuration getTemplateConfig(
            String resource) {

        freemarker.template.Configuration cfg = new freemarker.template.Configuration();
        cfg.setDefaultEncoding("UTF-8");
        cfg.setClassForTemplateLoading(this.getClass(), resource);
        return cfg;
    }

    /**
     * 处理hibernate的配置文件
     *
     * @param :resource
     */
    private Configuration getHibernateCfg(String hbxml) {
//        Configuration hbcfg =  hibernateConfiguration.dataSource().

        org.hibernate.cfg.Configuration hbcfg = new org.hibernate.cfg.Configuration();
        hbcfg.configure("/hibernate.cfg.xml");
        Properties extraProp = new Properties();
        extraProp.put("hibernate.hbm2ddl.auto", "update");
        hbcfg.addProperties(extraProp);
        hbcfg.addXML(hbxml);
        return hbcfg;
    }

    /**
     * 根据hibernate cfg配置文件动态建表
     *
     * @param hbcfg
     */
    private void createDbTableByCfg(Configuration hbcfg) {
        SchemaExport schemaExport;
        try {
            schemaExport = new SchemaExport(hbcfg);
            // 设置脚本文件
//            schemaExport.setOutputFile(scriptFileName);
            schemaExport.create(true, true);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
