package lk.cypher.bookliy.controller.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.InvoiceServices;

@Path("/invoices")
public class InvoiceController {
    private final InvoiceServices invoiceServices = new InvoiceServices();

    @Path("/user-invoices")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadInvoiceData(@QueryParam("orderId") String orderId) {
        String responseJson = invoiceServices.getInvoiceData(orderId);
        return Response.ok().entity(responseJson).build();
    }
}
