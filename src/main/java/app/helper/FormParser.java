package app.helper;

/**
 * Created by steve on 10/9/15.
 */


import app.model.form.ColumnAttribute;
import app.model.form.FormTable;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * {"fields":11,"template":"<p style=\"text-align: center;\"><br/></p><p style=\"text-align: center;\"><span style=\"font-size: 24px;\">示例表</span></p><table class=\"table table-bordered\"><tbody><tr class=\"firstRow\"><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\">文本框</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"227\"><input style=\"text-align: left; width: 150px;\" title=\"文本框\" value=\"雷劈网\" name=\"data_1\" orgheight=\"\" orgwidth=\"150\" orgalign=\"left\" orgfontsize=\"\" orghide=\"0\" leipiplugins=\"text\" orgtype=\"text\"/></td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"85\">下拉菜单</td><td valign=\"top\" style=\"border-color: rgb(221, 221, 221);\" width=\"312\">{|-<span leipiplugins=\"select\"><select name=\"data_2\" title=\"下拉菜单\" leipiplugins=\"select\" size=\"1\" orgwidth=\"150\" style=\"width: 150px;\"><option value=\"下拉\">下拉</option><option value=\"菜单\">菜单</option></select>&nbsp;&nbsp;</span>-|}</td></tr><tr><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\">单选</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"41\">{|-<span leipiplugins=\"radios\" name=\"data_3\" title=\"单选\"><input type=\"radio\" name=\"data_3\" value=\"单选1\"  checked=\"checked\"/>单选1&nbsp;<input type=\"radio\" name=\"data_3\" value=\"单选2\"  />单选2&nbsp;</span>-|}</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"85\">复选</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"312\">{|-<span leipiplugins=\"checkboxs\"  title=\"复选\"><input type=\"checkbox\" name=\"data_4\" value=\"复选1\"  checked=\"checked\"/>复选1&nbsp;<input type=\"checkbox\" name=\"data_5\" value=\"复选2\"  checked=\"checked\"/>复选2&nbsp;<input type=\"checkbox\" name=\"data_6\" value=\"复选3\"  />复选3&nbsp;</span>-|}</td></tr><tr><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\">宏控件</td><td valign=\"top\" style=\"border-color: rgb(221, 221, 221);\" width=\"41\"><input name=\"data_7\" type=\"text\" value=\"{macros}\" title=\"宏控件\" leipiplugins=\"macros\" orgtype=\"sys_date_cn\" orghide=\"0\" orgfontsize=\"12\" orgwidth=\"150\" style=\"font-size: 12px; width: 150px;\"/></td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"85\">二维码</td><td valign=\"top\" style=\"border-color: rgb(221, 221, 221);\" width=\"312\"><img name=\"data_8\" title=\"雷劈网\" value=\"http://www.leipi.org\" orgtype=\"url\" leipiplugins=\"qrcode\" src=\"js/ueditor/formdesign/images/qrcode.gif\" orgwidth=\"40\" orgheight=\"40\" style=\"width: 40px; height: 40px;\"/></td></tr></tbody></table><p><input name=\"data_9\" leipiplugins=\"listctrl\" type=\"text\" value=\"{列表控件}\" readonly=\"readonly\" title=\"采购商品列表\" orgtitle=\"商品名称`数量`单价`小计`描述`\" orgcoltype=\"text`int`int`int`text`\" orgunit=\"```元``\" orgsum=\"0`0`0`1`0`\" orgcolvalue=\"`````\" orgwidth=\"100%\" style=\"width: 100%;\"/></p><p><textarea title=\"多行文本\" name=\"data_10\" leipiplugins=\"textarea\" value=\"\" orgrich=\"0\" orgfontsize=\"12\" orgwidth=\"600\" orgheight=\"80\" style=\"font-size:12px;width:600px;height:80px;\"></textarea></p><p><img name=\"data_11\" title=\"进度条\" leipiplugins=\"progressbar\" orgvalue=\"20\" orgsigntype=\"progress-info\" src=\"js/ueditor/formdesign/images/progressbar.gif\"/></p>","parse":"<p style=\"text-align: center;\"><br/></p><p style=\"text-align: center;\"><span style=\"font-size: 24px;\">示例表</span></p><table class=\"table table-bordered\"><tbody><tr class=\"firstRow\"><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\">文本框</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"227\">{data_1}</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"85\">下拉菜单</td><td valign=\"top\" style=\"border-color: rgb(221, 221, 221);\" width=\"312\">{data_2}</td></tr><tr><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\">单选</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"41\">{data_3}</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"85\">复选</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"312\">{checkboxs_0}</td></tr><tr><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\">宏控件</td><td valign=\"top\" style=\"border-color: rgb(221, 221, 221);\" width=\"41\">{data_7}</td><td valign=\"top\" style=\"word-break: break-all; border-color: rgb(221, 221, 221);\" width=\"85\">二维码</td><td valign=\"top\" style=\"border-color: rgb(221, 221, 221);\" width=\"312\">{data_8}</td></tr></tbody></table><p>{data_9}</p><p>{data_10}</p><p>{data_11}</p>","data":[{"style":"text-align: left; width: 150px;","title":"文本框","value":"雷劈网","name":"data_1","orgheight":"","orgwidth":"150","orgalign":"left","orgfontsize":"","orghide":"0","leipiplugins":"text","orgtype":"text","content":"<input style=\"text-align: left; width: 150px;\" title=\"文本框\" value=\"雷劈网\" name=\"data_1\" orgheight=\"\" orgwidth=\"150\" orgalign=\"left\" orgfontsize=\"\" orghide=\"0\" leipiplugins=\"text\" orgtype=\"text\"/>"},{"leipiplugins":"select","name":"data_2","title":"下拉菜单","size":"1","orgwidth":"150","style":"width: 150px;","value":"下拉,菜单","content":"<span leipiplugins=\"select\"><select name=\"data_2\" title=\"下拉菜单\" leipiplugins=\"select\" size=\"1\" orgwidth=\"150\" style=\"width: 150px;\"><option value=\"下拉\">下拉</option><option value=\"菜单\">菜单</option></select>&nbsp;&nbsp;</span>"},{"leipiplugins":"radios","title":"单选","name":"data_3","value":"单选1,单选2","content":"<span leipiplugins=\"radios\" name=\"data_3\" title=\"单选\"><input type=\"radio\" name=\"data_3\" value=\"单选1\"  checked=\"checked\"/>单选1&nbsp;<input type=\"radio\" name=\"data_3\" value=\"单选2\"  />单选2&nbsp;</span>","options":[{"value":"单选1","type":"radio","checked":"checked","name":"data_3"},{"value":"单选2","type":"radio","name":"data_3"}]},{"leipiplugins":"checkboxs","title":"复选","parse_name":"checkboxs_0","name":"data_4,data_5,data_6","value":"复选1,复选2,复选3","content":"<span leipiplugins=\"checkboxs\"  title=\"复选\"><input type=\"checkbox\" name=\"data_4\" value=\"复选1\"  checked=\"checked\"/>复选1&nbsp;<input type=\"checkbox\" name=\"data_5\" value=\"复选2\"  checked=\"checked\"/>复选2&nbsp;<input type=\"checkbox\" name=\"data_6\" value=\"复选3\"  />复选3&nbsp;</span>","options":[{"name":"data_4","value":"复选1","type":"checkbox","checked":"checked"},{"name":"data_5","value":"复选2","type":"checkbox","checked":"checked"},{"name":"data_6","value":"复选3","type":"checkbox"}]},{"name":"data_7","type":"text","value":"{macros}","title":"宏控件","leipiplugins":"macros","orgtype":"sys_date_cn","orghide":"0","orgfontsize":"12","orgwidth":"150","style":"font-size: 12px; width: 150px;","content":"<input name=\"data_7\" type=\"text\" value=\"{macros}\" title=\"宏控件\" leipiplugins=\"macros\" orgtype=\"sys_date_cn\" orghide=\"0\" orgfontsize=\"12\" orgwidth=\"150\" style=\"font-size: 12px; width: 150px;\"/>"},{"name":"data_8","title":"雷劈网","value":"http://www.leipi.org","orgtype":"url","leipiplugins":"qrcode","src":"js/ueditor/formdesign/images/qrcode.gif","orgwidth":"40","orgheight":"40","style":"width: 40px; height: 40px;","content":"<img name=\"data_8\" title=\"雷劈网\" value=\"http://www.leipi.org\" orgtype=\"url\" leipiplugins=\"qrcode\" src=\"js/ueditor/formdesign/images/qrcode.gif\" orgwidth=\"40\" orgheight=\"40\" style=\"width: 40px; height: 40px;\"/>"},{"name":"data_9","leipiplugins":"listctrl","type":"text","value":"{列表控件}","readonly":"readonly","title":"采购商品列表","orgtitle":"商品名称`数量`单价`小计`描述`","orgcoltype":"text`int`int`int`text`","orgunit":"```元``","orgsum":"0`0`0`1`0`","orgcolvalue":"`````","orgwidth":"100%","style":"width: 100%;","content":"<input name=\"data_9\" leipiplugins=\"listctrl\" type=\"text\" value=\"{列表控件}\" readonly=\"readonly\" title=\"采购商品列表\" orgtitle=\"商品名称`数量`单价`小计`描述`\" orgcoltype=\"text`int`int`int`text`\" orgunit=\"```元``\" orgsum=\"0`0`0`1`0`\" orgcolvalue=\"`````\" orgwidth=\"100%\" style=\"width: 100%;\"/>"},{"title":"多行文本","name":"data_10","leipiplugins":"textarea","value":"","orgrich":"0","orgfontsize":"12","orgwidth":"600","orgheight":"80","style":"font-size:12px;width:600px;height:80px;","content":"<textarea title=\"多行文本\" name=\"data_10\" leipiplugins=\"textarea\" value=\"\" orgrich=\"0\" orgfontsize=\"12\" orgwidth=\"600\" orgheight=\"80\" style=\"font-size:12px;width:600px;height:80px;\"></textarea>"},{"name":"data_11","title":"进度条","leipiplugins":"progressbar","orgvalue":"20","orgsigntype":"progress-info","src":"js/ueditor/formdesign/images/progressbar.gif","content":"<img name=\"data_11\" title=\"进度条\" leipiplugins=\"progressbar\" orgvalue=\"20\" orgsigntype=\"progress-info\" src=\"js/ueditor/formdesign/images/progressbar.gif\"/>"}],"add_fields":{"data_1":{"name":"data_1","leipiplugins":"text"},"data_2":{"name":"data_2","leipiplugins":"select"},"data_3":{"name":"data_3","leipiplugins":"radios"},"data_4":{"name":"data_4","leipiplugins":"checkboxs"},"data_5":{"name":"data_5","leipiplugins":"checkboxs"},"data_6":{"name":"data_6","leipiplugins":"checkboxs"},"data_7":{"name":"data_7","leipiplugins":"macros"},"data_8":{"name":"data_8","leipiplugins":"qrcode"},"data_9":{"name":"data_9","leipiplugins":"listctrl"},"data_10":{"name":"data_10","leipiplugins":"textarea"},"data_11":{"name":"data_11","leipiplugins":"progressbar"}}}
 */
//

//private String column_type;
//private String column_Name;
//private String plugins; // the element type in html such as <input type="text"/> here is the plugins is text
//private String title;
//content
public class FormParser {
    String formInfo;

    public FormParser(String input) {
        this.formInfo = input;
    }

    /**
     * parse and generate or update the form table
     * @Para formTable the form Table which need to be updated, set null when create a new one
     * @return  return the updated form table or new one
     * */
    public FormTable parseForm(FormTable formTable) {
//            id: formid,
//                    form_name: form_name,
//                    form_desc: form_desc,
//                    creator: creator,
//                    fields_count: fields_count,
//                    context: parse_form.context,
//                    context_parse: parse_form.context_parse,
//                    data:parse_form.data
        ObjectMapper mapper = new ObjectMapper();
        if(formTable == null){
            formTable = new FormTable();
            System.out.println("============================");
            System.err.println("creating new form table");
            System.out.println("============================");
        }
        try {
            JsonNode rootNode = mapper.readTree(formInfo); // 读取Json
            formTable.setFields_count(Integer.valueOf(rootNode.get("fields_count").asInt()));
            formTable.setCreator(rootNode.get("creator")==null?"":rootNode.get("creator").asText());
//            formTable.setId(rootNode.get("id").asInt());
            formTable.setForm_desc(rootNode.get("form_desc").asText());
            formTable.setContext(rootNode.get("context").asText());
            formTable.setContext_parse(rootNode.get("context_parse").asText());
            formTable.setForm_name(rootNode.get("form_name").asText());

//            formTable.getColumnAttributes().clear();
            JsonNode dataNodes = rootNode.path("data");
            for (int i = 0; i < dataNodes.size(); i++) {
                ColumnAttribute ca = new ColumnAttribute();
                JsonNode fields = dataNodes.get(i);
                String plugins = fields.get("leipiplugins").asText();
                String title = fields.get("title").asText();
                String content = fields.get("content").asText();
                String name = fields.get("name").asText();
                name = name.replace(",","__");
                ca.setColumn_type("string");
                ca.setFormTable(formTable);
                ca.setLength(100);
                ca.setColumn_Name(name);
                ca.setContent(content);
                ca.setTitle(title);
                ca.setPlugins(plugins);
                //macros
                if(plugins.equals("macros")){
                    System.out.println(fields);
                    String orgtype = fields.get("orgtype").asText();
                    ca.setOrgtype(orgtype);
                    // now date

                    if(orgtype.equals("sys_date_cn")){
                        ca.setColumn_type("date");
                    }else{
                        ca.setIsForeign(true);
                    }
                }
                //TODO  for name just set the type to string and the length to 100 need to be fixed
                formTable.addColumn(ca);
            }

        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
        return formTable;
    }
}
