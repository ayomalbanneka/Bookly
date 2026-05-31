package lk.cypher.bookliy.controller.api.admin;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.dto.AdminDTO;
import lk.cypher.bookliy.entity.Admin;
import lk.cypher.bookliy.services.admin.AdminServices;
import lk.cypher.bookliy.util.AppUtil;

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

    @Path("/logout")
    @POST
    public Response logout(@Context HttpServletRequest request) {
        HttpSession httpSession = request.getSession(false);
        if (httpSession != null && httpSession.getAttribute("admin") != null) {
            httpSession.invalidate();
            return Response.status(Response.Status.OK).build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @GET
    @Path("/current-logged-admin")
    @Produces(MediaType.APPLICATION_JSON)
    public String getCurrentAdmin(@Context HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        HttpSession httpSession = request.getSession(false);

        if (httpSession != null && httpSession.getAttribute("admin") != null) {
            Admin admin = (Admin) httpSession.getAttribute("admin");
            responseObject.addProperty("status", true);
            responseObject.addProperty("firstName", admin.getFirstName());
            responseObject.addProperty("lastName", admin.getLastName());
        } else {
            responseObject.addProperty("status", false);
        }

        return AppUtil.gson.toJson(responseObject);
    }
}
