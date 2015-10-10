package app.model.form;

/**
 * Created by steve on 10/9/15.
 */
public class FormInfo {
    private int fields;
    private String template;
    private String parse;
    private String data;

    public int getFields() {
        return fields;
    }

    public void setFields(int fields) {
        this.fields = fields;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getParse() {
        return parse;
    }

    public void setParse(String parse) {
        this.parse = parse;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
