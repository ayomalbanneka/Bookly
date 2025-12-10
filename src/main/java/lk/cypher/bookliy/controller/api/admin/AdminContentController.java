package lk.cypher.bookliy.controller.api.admin;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.admin.AdminContentServices;

@Path("/admin/data")
public class AdminContentController {

    @Path("/categories")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    public Response loadAllCategories() {
        String responseJson = new AdminContentServices().loadAllCategories();
        return Response.ok().entity(responseJson).build();
    }
}
