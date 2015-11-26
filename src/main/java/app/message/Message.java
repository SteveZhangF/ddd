package app.message;

public class Message {
    protected MessageTitle title;

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    public MessageTitle getTitle() {
        return title;
    }

    protected Object content;

    public void setTitle(MessageTitle title) {
        this.title = title;
    }

    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public enum MessageTitle{
        SUCCESS,FAIL
    }

    public static Message getSuccessMsg(String description,Object object){
        Message message = new Message();
        message.setTitle(MessageTitle.SUCCESS);
        message.setDescription(description);
        message.setContent(object);
        return message;
    }

    public static Message getFailMsg(String description){
        Message message = new Message();
        message.setTitle(MessageTitle.FAIL);
        message.description = description;
        return message;
    }
}
