package engine.htmlengine;

import java.io.*;
import java.util.HashMap;


public class TemplatePool {


    private HashMap<String, String> templatePool = new HashMap<String, String>();

    private static class TemplatePoolFactory {
        private static TemplatePool instance = new TemplatePool();
    }

    public static TemplatePool getInstance() {
        return TemplatePoolFactory.instance;
    }

    public String getHtmlTemplate(String key) {
        String temp = null;
        String result = templatePool.get(key);
        if (result == null) {
            result = "";
            String path = "/../../resource/template/" + key.split(":")[0] + "/" + key.split(":")[1] + ".html";
//			System.out.println(path);

            InputStream is = TemplatePool.class.getResourceAsStream(path);
            BufferedReader br = new BufferedReader(new InputStreamReader(is));
            try {
                while ((temp = br.readLine()) != null) {
                    result += temp;
                }
            } catch (FileNotFoundException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            templatePool.put(key, result);
        }
        return result;
    }
}
