package app.model.form;

import app.model.wordflow.WorkFlowNode;
import app.model.wordflow.WorkFlowNodeElement;
import org.hibernate.annotations.*;
import org.hibernate.annotations.CascadeType;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by steve on 10/9/15.
 * <p>
 * CREATE TABLE df_form (
 * id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
 * name VARCHAR(200) NOT NULL,
 * displayName VARCHAR(200) DEFAULT NULL,
 * type VARCHAR(50) DEFAULT NULL,
 * creator VARCHAR(50) DEFAULT NULL,
 * createTime VARCHAR(50) DEFAULT NULL,
 * originalHtml TEXT,
 * parseHtml TEXT,
 * fieldNum INT DEFAULT 0
 * );
 * ALTER TABLE DF_FORM ADD UNIQUE (NAME);
 * <p>
 * CREATE TABLE df_field (
 * id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
 * name VARCHAR(200) NOT NULL,
 * plugins VARCHAR(200) DEFAULT NULL,
 * title VARCHAR(50) DEFAULT NULL,
 * type  VARCHAR(50) DEFAULT NULL,
 * flow  VARCHAR(10) DEFAULT NULL,
 * tableName VARCHAR(50) DEFAULT NULL,
 * formId INT NOT NULL
 * );
 */
@Entity
@Table(name = "tbl_form_column")
public class ColumnAttribute implements WorkFlowNodeElement{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String column_type;
    private String column_Name;
    private String plugins; // the element type in html such as <input type="text"/> here is the plugins is text
    private String title;

    private boolean isForeign;
    @Lob
    @Column(name = "content", columnDefinition = "BLOB")
    private String content;// used to display the element in the html but not the value ( for the user to fill in)

    @ManyToOne
    @JoinColumn(name = "formTable")
    @Cascade({CascadeType.SAVE_UPDATE})
    private FormTable formTable;

    public String getOrgtype() {
        return orgtype;
    }

    public void setOrgtype(String orgtype) {
        this.orgtype = orgtype;
    }

    // 主要处理macros
    private String orgtype = "";


    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    private int length;

    public int getId() {
        return id;
    }

    @Override
    public String getName() {
        return this.getTitle();
    }

    @Override
    public String getNodeType() {
        return "ColumnAttributeNode";
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getColumn_type() {
        return column_type;
    }

    public void setColumn_type(String column_type) {
        this.column_type = column_type;
    }

    public String getColumn_Name() {
        return column_Name;
    }

    public void setColumn_Name(String column_Name) {
        this.column_Name = column_Name;
    }

    public FormTable getFormTable() {
        return formTable;
    }

    public void setFormTable(FormTable formTable) {
        this.formTable = formTable;
    }

    public String getPlugins() {
        return plugins;
    }

    public void setPlugins(String plugins) {
        this.plugins = plugins;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isForeign() {
        return isForeign;
    }

    public void setIsForeign(boolean isForeign) {
        this.isForeign = isForeign;
    }

}
