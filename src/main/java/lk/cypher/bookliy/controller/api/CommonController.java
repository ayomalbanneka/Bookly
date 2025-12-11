package lk.cypher.bookliy.controller.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.CommonServices;

@Path("/common")
public class CommonController {
    @Path("/single-product")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadSingleProduct(@QueryParam("productId") int id) {
        String responseJson = new CommonServices().getSingleProduct(id);
        return Response.ok().entity(responseJson).build();
    }
}