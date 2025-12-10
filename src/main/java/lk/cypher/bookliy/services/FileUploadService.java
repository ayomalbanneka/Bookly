package lk.cypher.bookliy.services;

import jakarta.servlet.ServletContext;
import jakarta.ws.rs.WebApplicationException;
import lk.cypher.bookliy.util.ENV;
import org.apache.commons.io.FilenameUtils;
import org.glassfish.jersey.media.multipart.ContentDisposition;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileUploadService {
    private static final String uploadDIR = "/uploads";
    private final ServletContext servletContext;

    public FileUploadService(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    // Upload file to the specified directory and return FileItem
    public FileItem uploadFile(String directoryName, InputStream inputStream, ContentDisposition fileMetaData){
        String pathName = uploadDIR + "/" + directoryName;
        return writeFile(pathName, inputStream, fileMetaData);
    }

    // Write file to disk and return FileItem
    private FileItem writeFile(String pathName, InputStream inputStream, ContentDisposition contentDisposition){
        Path uploadPath = Paths.get(servletContext.getRealPath(pathName));
        String extension = FilenameUtils.getExtension(contentDisposition.getFileName());
        String fileName = System.currentTimeMillis() + "." + extension;

        if(!Files.exists(uploadPath)){
            try{
                System.out.println("Upload directory does not exist. Creating Directory: \"" + uploadPath + "\"");
                Files.createDirectories(uploadPath);
            }catch (IOException e){
                throw new RuntimeException(e);
            }
        }

        try{
            int read;
            byte[] bytes = new byte[1024];
            OutputStream outputStream = new FileOutputStream(uploadPath + "/" + fileName);
            while((read = inputStream.read(bytes)) != -1){
                outputStream.write(bytes, 0, read);
            }
            outputStream.flush();
            outputStream.close();
        } catch (IOException e) {
            throw new WebApplicationException("Error while uploading file. Please try again." + e.getMessage());
        }

        String appUrl = ENV.get("app.url");

        /*
         * http://localhost:8080/bookliy/uploads/subDirectory/productId/fileName
         * http://localhost:8080/bookliy/uploads/products/1/123456789.jpg
         */

        String url = servletContext.getContextPath() + uploadPath + "/" + fileName; // /bookliy/uploads/products/1/123456789.jpg
        String path = pathName.substring(1) + "/" + fileName; // /uploads/products/1/123456789.jpg
        String fullUrl = appUrl + "/" + uploadPath + "/" + fileName; //http://localhost:8080/bookliy/uploads/products/1/123456789.jpg

        return new FileItem(fileName, contentDisposition.getFileName(), path, url, fullUrl);
    }

    public static class FileItem{
        private String fileName;
        private String originalFileName;
        private String filePath;
        private String url;
        private String fullUrl;

        public FileItem(String fileName, String originalFileName, String filePath, String url, String fullUrl) {
            this.fileName = fileName;
            this.originalFileName = originalFileName;
            this.filePath = filePath;
            this.url = url;
            this.fullUrl = fullUrl;
        }

        public String getFullUrl() {
            return fullUrl;
        }

        public void setFullUrl(String fullUrl) {
            this.fullUrl = fullUrl;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getOriginalFileName() {
            return originalFileName;
        }

        public void setOriginalFileName(String originalFileName) {
            this.originalFileName = originalFileName;
        }

        public String getFilePath() {
            return filePath;
        }

        public void setFilePath(String filePath) {
            this.filePath = filePath;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}
