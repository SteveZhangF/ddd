package app.message;

public class Message {
    protected String title;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    protected String content;

    public void setTitle(String title) {
        this.title = title;
    }
}
