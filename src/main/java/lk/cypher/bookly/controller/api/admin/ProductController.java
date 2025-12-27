package lk.cypher.bookly.controller.api.admin;

import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookly.dto.ProductDTO;
import lk.cypher.bookly.entity.Product;
import lk.cypher.bookly.services.admin.FileUploadService;
import lk.cypher.bookly.services.admin.ProductServices;
import lk.cypher.bookly.util.AppUtil;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataParam;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Path("/admin/products")
public class ProductController {

    @Path("/save-product")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response saveProduct(String productJson, @Context HttpServletRequest request) {
        ProductDTO productDTO = AppUtil.gson.fromJson(productJson, ProductDTO.class);
        String responseJson = new ProductServices().addNewProduct(productDTO, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/{productId}/upload-image")
    @PUT
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadProductImages(
            @PathParam("productId") int productId,
            @FormDataParam("image") FormDataBodyPart formDataBodyPart,
            @Context ServletContext context) {

        List<FileUploadService.FileItem> fileItems = new ArrayList<>();
        FileUploadService fileUploadService = new FileUploadService(context);
        ProductServices productService = new ProductServices();
        Product product = productService.getProductById(productId);

        formDataBodyPart.getParent().getBodyParts().forEach(bodyPart -> {

            InputStream inputStream = bodyPart.getEntityAs(InputStream.class);
            ContentDisposition contentDisposition = bodyPart.getContentDisposition();
            System.out.println("Uploading file: " + contentDisposition.getFileName());

            FileUploadService.FileItem fileItem = fileUploadService
                    .uploadFile("products/" + productId, inputStream, contentDisposition);

            fileItems.add(fileItem);
            product.getImages().add(fileItem.getFilePath());

        });

        String responseJson = productService.updateProduct(product);
        return Response.ok().entity(responseJson).build();
    }
}
