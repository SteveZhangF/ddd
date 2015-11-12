/*
 * Copyright (c) 2015. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.UUID;

/**
 * Created by steve on 11/8/15.
 */
@Controller
public class UploadController {

    private static final int BUFFER_SIZE = 4096;
    @RequestMapping(value = "/upload/", method = RequestMethod.POST)
    public ResponseEntity<String> handleFileUpload(final HttpServletRequest request,final @RequestParam("userId") int userId,  final @RequestParam("type") String type, final @RequestParam("file") MultipartFile file) {
        try {
            System.out.println(type);
            String uuid = UUID.randomUUID().toString().replace("-","");
            System.out.println(uuid);
            System.out.println(file.getName());
            System.out.println(file.getOriginalFilename());
            String path = request.getServletContext().getRealPath("/");
            String fileName = uuid+file.getOriginalFilename(); //获得文件名
            String filePath = "/upload/" + userId + "/"+type+"/";//文件相对路径
            File targetFile = new File(path + filePath, fileName); //新建一个文件
            if (!targetFile.exists()) {
                targetFile.mkdirs();
            }
            file.transferTo(targetFile);
            String pathz = filePath+fileName;
            return new ResponseEntity<>(pathz, HttpStatus.OK);
        } catch (Throwable throwable) {
            throw new RuntimeException(throwable);
        }
    }

    @RequestMapping(value = "/upload/", method = RequestMethod.GET)
    public void getUploadedFile(final HttpServletRequest request,final HttpServletResponse response ,final @RequestParam("path") String path) throws IOException {
        URLDecoder.decode(path,"UTF-8");
        String mainpath = request.getServletContext().getRealPath("/");
        File targetFile = new File(mainpath +path);
        System.out.println(targetFile.getAbsolutePath());
        if(!targetFile.exists()){
            response.setStatus(404,"");
            return;
        }
        // construct the complete absolute path of the file
        FileInputStream inputStream = new FileInputStream(targetFile);

        // get MIME type of the file
        String mimeType = request.getServletContext().getMimeType(targetFile.getAbsolutePath());
        if (mimeType == null) {
            // set to binary type if MIME mapping not found
            mimeType = "application/octet-stream";
        }
        System.out.println("MIME type: " + mimeType);

        // set content attributes for the response
        response.setContentType(mimeType);
        response.setContentLength((int) targetFile.length());

        // set headers for the response
        String headerKey = "Content-Disposition";
        String headerValue = String.format("attachment; filename=\"%s\"",
                targetFile.getName());
        response.setHeader(headerKey, headerValue);

        // get output stream of the response
        OutputStream outStream = response.getOutputStream();

        byte[] buffer = new byte[BUFFER_SIZE];
        int bytesRead = -1;

        // write bytes read from the input stream into the output stream
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, bytesRead);
        }
        inputStream.close();
        outStream.close();
    }
}
