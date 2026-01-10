package lk.cypher.bookliy.controller.api.payment;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.OrderServices;
import lk.cypher.bookliy.util.ENV;
import lk.cypher.bookliy.util.PayHereUtil;

import java.net.URI;

@Path("/payments")
public class PaymentController {
    @Path("/return")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response paymentSuccess(@QueryParam("orderId") String orderId) {
        return Response.seeOther(URI.create(ENV.get("app.url") + "/invoice.html?orderId=" + orderId)).build();
    }

    @Path("/cancel")
    @GET
    public Response paymentCancel() {
        return Response.ok("Payment Canceled").build();
    }

    @Path("/notify")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response paymentNotify(MultivaluedMap<String, String> form) {
        String orderId = form.getFirst("order_id");
        String statusCode = form.getFirst("status_code");
        System.out.println("Received payment notification for order ID: " + orderId + " with status code: " + statusCode);

        if (!PayHereUtil.validateNotify(form)) {
            System.out.println("Invalid signature for order ID: " + orderId);
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("INVALID SIGNATURE").build();
        }

        OrderServices orderServices = new OrderServices();
        if (Integer.parseInt(statusCode) == PayHereUtil.PAYMENT_SUCCESS) {
            System.out.println("Payment successful for order ID: " + orderId);
            // success situation
            orderServices.completeOrder(orderId);
        } else {
            System.out.println("Payment failed for order ID: " + orderId);
            // failed situation
            orderServices.failedOrder(orderId);
        }
        return Response.ok().build();
    }
}
