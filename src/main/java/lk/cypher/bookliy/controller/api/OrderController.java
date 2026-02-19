package lk.cypher.bookliy.controller.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.OrderServices;

@Path("/orders")
public class OrderController {
    private final OrderServices orderServices = new OrderServices();

    @Path("verify-order")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response verifyOrder(@QueryParam("orderId") String orderId) {
        String responseJson = orderServices.verifyOrderDetails(orderId);
        return Response.ok(responseJson).build();
    }

    @Path("complete-order")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response completeOrder(@QueryParam("orderId") String orderId) {
        String responseJson = orderServices.completeAndVerify(orderId);
        return Response.ok(responseJson).build();
    }
}
