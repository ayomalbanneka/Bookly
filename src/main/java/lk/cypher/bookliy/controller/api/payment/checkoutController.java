package lk.cypher.bookliy.controller.api.payment;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.annotation.IsUser;
import lk.cypher.bookliy.dto.CheckoutRequestDTO;
import lk.cypher.bookliy.services.OrderServices;
import lk.cypher.bookliy.services.payment.checkoutServices;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.ENV;
import lk.cypher.bookliy.util.PayHereUtil;

import java.net.URI;

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

    @IsUser
    @Path("/checkout")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response userCheckout(String requestData, @Context HttpServletRequest request) {
        CheckoutRequestDTO checkoutRequestDTO = AppUtil.gson.fromJson(requestData, CheckoutRequestDTO.class);
        String responseJson = new checkoutServices().processCheckout(checkoutRequestDTO, request);
        return Response.ok().entity(responseJson).build();
    }
}
