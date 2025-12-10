package lk.cypher.bookliy.controller.api;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.annotation.IsUser;
import lk.cypher.bookliy.dto.UserDTO;
import lk.cypher.bookliy.entity.Address;
import lk.cypher.bookliy.services.ProfileServices;
import lk.cypher.bookliy.util.AppUtil;

@Path("/profiles")
public class ProfileController {

    @IsUser
    @Path("/user-profile")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserProfile(@Context HttpServletRequest request) {
        String response = new ProfileServices().userProfile(request); // Placeholder for actual service call
        return Response.ok().entity(response).build();
    }

    @IsUser
    @PUT
    @Path("/update-profile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserProfile(String jsonData, @Context HttpServletRequest request) {
        UserDTO userDTO = AppUtil.gson.fromJson(jsonData, UserDTO.class);
        String responseJson = new ProfileServices().updateProfile(userDTO, request); // Placeholder for actual service call
        return Response.ok().entity(responseJson).build();
    }

    @IsUser
    @POST
    @Path("/new-address")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addNewAddress(String jsonData, @Context HttpServletRequest request) {
        String responseJson = new ProfileServices().addNewAddress(jsonData, request);
        return Response.ok().entity(responseJson).build();
    }
}
