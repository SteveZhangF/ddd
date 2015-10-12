package app.helper;

import app.model.form.ColumnAttribute;
import app.model.form.FormTable;
import freemarker.template.Template;
import org.hibernate.cfg.Configuration;
import org.hibernate.tool.hbm2ddl.SchemaExport;

import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * Created by steve on 10/9/15.
 */
public class TableGenerator {
    /**
     * tableVo
     */
    private FormTable tableVo;
    private List<ColumnAttribute> columnAttributes;

    /**
     * 构造函数
     *
     * @param tableVo
     */
    public TableGenerator(FormTable tableVo,List<ColumnAttribute> columnAttributes) {
        this.tableVo = tableVo;
        this.columnAttributes = columnAttributes;
    }


    /**
     *
     */
    public void generatorTable() {
        if (this.columnAttributes.isEmpty()) {
            System.out.println(" column attr list size==0 ");
            return;
        }

        Template tl;
        try {
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("entity", tableVo);

            tl = getTemplateConfig("/").getTemplate(
                    "template.hb.ftl");
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

    /**
     * 获取freemarker的cfg
     *
     * @param resource
     * @return Configuration
     */
    protected freemarker.template.Configuration getTemplateConfig(
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
    protected Configuration getHibernateCfg(String hbxml) {
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
    public void createDbTableByCfg(Configuration hbcfg) {
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
