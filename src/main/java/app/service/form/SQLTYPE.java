package app.service.form;

/**
 * Created by steve on 10/10/15.
 */
public enum  SQLTYPE {
    INSERT("template.insert.ftl"),SELECT("template.select.ftl"),CREATE("template.hb.ftl");
    private String path;
    private SQLTYPE(String path){
        this.path = path;
    }
    public String getPath(){
        return  this.path;
    }
}
