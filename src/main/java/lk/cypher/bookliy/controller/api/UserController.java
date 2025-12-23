package lk.cypher.bookliy.controller.api;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.annotation.IsUser;
import lk.cypher.bookliy.dto.UserDTO;
import lk.cypher.bookliy.services.CommonServices;
import lk.cypher.bookliy.services.UserServices;

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

        // After successful login, merge guest cart with user cart
        new CommonServices().mergeUserCarts(request);
        return Response.ok().entity(responseJson).build();
    }

    @IsUser
    @Path("/logout")
    @POST
    public Response logout(@Context HttpServletRequest request) {
        HttpSession httpSession = request.getSession(false);
        System.out.println(httpSession);
        if (httpSession != null && httpSession.getAttribute("user") != null) {
            httpSession.invalidate();
            return Response.status(Response.Status.OK).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }
}
