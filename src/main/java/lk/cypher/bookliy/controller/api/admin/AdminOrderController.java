package lk.cypher.bookliy.controller.api.admin;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.admin.AdminOrderServices;
import lk.cypher.bookliy.util.AppUtil;

@Path("/admin/orders")
public class AdminOrderController {

    @Path("/{orderId}/status")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateOrderStatus(@PathParam("orderId") String orderId, String json, @Context HttpServletRequest request) {
        JsonObject payload = AppUtil.gson.fromJson(json, JsonObject.class);
        String status = payload != null && payload.has("status") ? payload.get("status").getAsString() : null;
        String responseJson = new AdminOrderServices().updateOrderStatus(orderId, status, request);
        return Response.ok().entity(responseJson).build();
    }
}

