package lk.cypher.bookliy.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.annotation.IsUser;
import lk.cypher.bookliy.services.ProfileServices;

@Path("/profiles")
public class ProfileController {

    @GET
    @IsUser
    @Path("/user-profile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserProfile(@Context HttpServletRequest request) {
        String response = new ProfileServices().userProfile(request); // Placeholder for actual service call
        return Response.ok().entity(response).build();
    }
}
