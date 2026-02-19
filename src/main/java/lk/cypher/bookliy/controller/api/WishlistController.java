package lk.cypher.bookliy.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.WishlistServices;

@Path("/wishlist")
public class WishlistController {
    private final WishlistServices wishlistServices = new WishlistServices();

    @Path("/add")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response addToWishlist(@QueryParam("stockId") String stockId, @Context HttpServletRequest request) {
        String responseJson = wishlistServices.addToWishlist(stockId, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/remove/{wishlistId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeFromWishlist(@PathParam("wishlistId") String wishlistId, @Context HttpServletRequest request) {
        String responseJson = wishlistServices.removeFromWishlist(wishlistId, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/items")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWishlistItems(@Context HttpServletRequest request) {
        String responseJson = wishlistServices.getWishlistItems(request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/check")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response isInWishlist(@QueryParam("stockId") String stockId, @Context HttpServletRequest request) {
        String responseJson = wishlistServices.isInWishlist(stockId, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/move-to-cart/{wishlistId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveToCart(@PathParam("wishlistId") String wishlistId, @Context HttpServletRequest request) {
        String responseJson = wishlistServices.moveToCart(wishlistId, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/count")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWishlistCount(@Context HttpServletRequest request) {
        String responseJson = wishlistServices.getWishlistCount(request);
        return Response.ok().entity(responseJson).build();
    }
}

