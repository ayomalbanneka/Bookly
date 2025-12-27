package lk.cypher.bookly.controller.api;

import com.google.gson.Gson;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookly.dto.UserDTO;
import lk.cypher.bookly.services.UserServices;

@Path("/verify-accounts")
public class verificationController {
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response verifyUserAccount(String jsonData) {
        Gson gson = new Gson();
        UserDTO userDTO = gson.fromJson(jsonData, UserDTO.class);
        String responseJson = new UserServices().verifyAccount(userDTO);
        return Response.ok().entity(responseJson).build();
    }
}
