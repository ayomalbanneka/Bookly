package lk.cypher.bookily.controller.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/verify-accounts")
public class verificationController {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response verifyUserAccount(@QueryParam("verificationCode") String code) {
        System.out.println(code);
        return Response.ok().build();
    }
}
