package lk.cypher.bookly.controller.api.admin;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookly.dto.AdminDTO;
import lk.cypher.bookly.services.admin.AdminServices;

@Path("/admin/auth")
public class AdminController {
    private final Gson gson = new Gson();

    @Path("/login")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response adminLogin(String jsonData, @Context HttpServletRequest request) {
        AdminDTO adminDTO = gson.fromJson(jsonData, AdminDTO.class);
        String responseJson = new AdminServices().adminLogin(adminDTO, request);
        return Response.ok().entity(responseJson).build();
    }
}
