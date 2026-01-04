package lk.cypher.bookliy.controller.api.payment;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.annotation.IsUser;
import lk.cypher.bookliy.services.payment.checkoutServices;

@Path("/payments")
public class checkoutController {
    @IsUser
    @Path("/user-checkout-data")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadUserCheckoutData(@Context HttpServletRequest request) {
        String responseJson = new checkoutServices().getCheckoutData(request);
        return Response.ok().entity(responseJson).build();
    }
}
