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

    @Path("/return")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response paymentSuccess(@QueryParam("orderId") String orderId) {
        return Response.seeOther(URI.create(ENV.get("app.url") + "/invoice.html?orderId=" + orderId)).build();
    }

    @Path("/cancel")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response paymentCancel() {
        return Response.ok("Payment Canceled").build();
    }

    @Path("/notify")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response paymentNotify(MultivaluedMap<String, String> form) {
        String orderId = form.getFirst("orderId");
        String statusCode = form.getFirst("statusCode");

        if (!PayHereUtil.validateNotify(form)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("INVALID SIGNATURE")
                    .build();
        }

        OrderServices orderService = new OrderServices();
        if (Integer.parseInt(statusCode) == PayHereUtil.PAYMENT_SUCCESS) {
            // Payment Success Logic Here
            orderService.completeOrder(orderId);
        } else {
            // Payment Failure Logic Here
            orderService.failedOrder(orderId);
        }

        return Response.ok().build();
    }
}
