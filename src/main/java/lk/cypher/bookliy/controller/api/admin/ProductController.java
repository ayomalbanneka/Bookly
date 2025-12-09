package lk.cypher.bookliy.controller.api.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.dto.ProductDTO;
import lk.cypher.bookliy.util.AppUtil;

@Path("/admin/products")
public class ProductController {

    @Path("/save-product")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response saveProduct(@FormParam("product") String productJson, @Context HttpServletRequest request) {
        ProductDTO productDTO = AppUtil.gson.fromJson(productJson, ProductDTO.class);
        return Response.ok().entity("").build();
    }
}
