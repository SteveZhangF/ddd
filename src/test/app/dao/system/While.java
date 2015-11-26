/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.dao.system;

import java.io.IOException;

/**
 * Created by steve on 11/19/15.
 */


public class While {
    public static void main(String[] args) throws IOException {
        String name = "ZZZaZa";
        While whilez = new While();
        System.out.print(whilez.replace(name));
    }


    public String replace(String str, char oldVal, char newVal){
        if(oldVal != newVal){
            char[] buf = str.toCharArray();
            int i=-1;
            while (++i<buf.length){
                buf[i] = oldVal == buf[i]? newVal:buf[i];
            }
            return  new String(buf);
        }



        return str;
    }

    public String replace(String val){
        char[] buf = val.toCharArray();
        int i=-1;
        while(++i<buf.length){
            if(buf[i]<=122 && buf[i]>=97)buf[i]-=32;
            else
                buf[i]+=32;
        }
        return new String(buf);

    }

//    public String replace(String str) {
//        char[] code = new char[str.length()];//做新字串用
//        for (int i = 0; i < str.length(); i++) {
//            code[i] = str.charAt(i);
//            if (code[i] >= 97 && code[i] <= 122) {
//                code[i] -= 32;
//            } else if (code[i] >= 65 && code[i] <= 90) {
//                code[i] += 32;
//            }
//        }
//        return new String(code);
//    }
}
