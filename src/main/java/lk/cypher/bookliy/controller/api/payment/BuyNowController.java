package lk.cypher.bookliy.controller.api.payment;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.annotation.IsUser;
import lk.cypher.bookliy.dto.BuyNowDTO;
import lk.cypher.bookliy.services.OrderServices;
import lk.cypher.bookliy.services.payment.BuyNowServices;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.ENV;
import lk.cypher.bookliy.util.PayHereUtil;
import lk.cypher.bookliy.validation.Validator;

import java.net.URI;

@Path("/payments")
public class BuyNowController {

    private final BuyNowServices buyNowServices = new BuyNowServices();

    /**
     * GET /api/payments/buy-now-address-data
     * Returns the user's primary address and delivery options for the Buy Now modal.
     */
    @IsUser
    @Path("/buy-now-address-data")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBuyNowAddressData(@Context HttpServletRequest request) {
        String responseJson = buyNowServices.getBuyNowAddressData(request);
        return Response.ok(responseJson).build();
    }

    /**
     * POST /api/payments/buy-now
     * Processes a Buy Now order and returns PayHere payment details.
     */
    @IsUser
    @Path("/buy-now")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response buyNow(String requestData, @Context HttpServletRequest request) {
        BuyNowDTO requestDTO = AppUtil.gson.fromJson(requestData, BuyNowDTO.class);
        String responseJson = buyNowServices.processBuyNow(requestDTO, request);
        return Response.ok(responseJson).build();
    }

    /**
     * POST /api/payments/buy-now-notify
     * PayHere server-to-server notification for Buy Now orders.
     */
    @Path("/buy-now-notify")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response buyNowNotify(MultivaluedMap<String, String> form) {
        String orderId = form.getFirst("order_id");
        String statusCode = form.getFirst("status_code");
        System.out.println("Buy Now notify — order: " + orderId + ", status: " + statusCode);

        if (!PayHereUtil.validateNotify(form)) {
            System.out.println("Invalid PayHere signature for buy-now order: " + orderId);
            return Response.status(Response.Status.BAD_REQUEST).entity("INVALID SIGNATURE").build();
        }

        int oId = Integer.parseInt(orderId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));

        if (Integer.parseInt(statusCode) == PayHereUtil.PAYMENT_SUCCESS) {
            buyNowServices.completeBuyNowOrder(oId);
        } else {
            // Reuse the standard failed-order logic from OrderServices
            new OrderServices().failedOrder(orderId);
        }

        return Response.ok().build();
    }

    /**
     * POST /api/payments/buy-now-complete
     * Called from the client-side payhere.onCompleted callback.
     * Idempotent — safe to call even if notify URL already processed the order.
     */
    @IsUser
    @Path("/buy-now-complete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response buyNowComplete(@QueryParam("orderId") String orderId) {
        String responseJson = buyNowServices.completeAndVerifyBuyNow(orderId);
        return Response.ok(responseJson).build();
    }
}