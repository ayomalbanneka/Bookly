package lk.cypher.bookily.controller.api;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookily.dto.UserDTO;
import lk.cypher.bookily.entity.User;
import lk.cypher.bookily.services.UserServices;

@Path("/users")
public class UserController {
    private final Gson GSON = new Gson();

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewAccount(String jsonData) {
        UserDTO userDTO = GSON.fromJson(jsonData, UserDTO.class);
        String responseJson = new UserServices().addNewUser(userDTO);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/login")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(String jsonData, @Context HttpServletRequest request) {
        UserDTO userDTO = GSON.fromJson(jsonData, UserDTO.class);
        String responseJson = new UserServices().userLogin(userDTO, request);
        return Response.ok().entity(responseJson).build();
    }
}
