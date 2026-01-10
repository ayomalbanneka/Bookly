package lk.cypher.bookliy.controller.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
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
}
