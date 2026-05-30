package lk.cypher.bookliy.controller.api.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.admin.AdminUserServices;

@Path("/admin/users")
public class AdminUserController {

    @Path("/{userId}/block")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public Response blockUser(@PathParam("userId") int userId, @Context HttpServletRequest request) {
        String responseJson = new AdminUserServices().blockUser(userId, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/{userId}/unblock")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public Response unblockUser(@PathParam("userId") int userId, @Context HttpServletRequest request) {
        String responseJson = new AdminUserServices().unblockUser(userId, request);
        return Response.ok().entity(responseJson).build();
    }
}

