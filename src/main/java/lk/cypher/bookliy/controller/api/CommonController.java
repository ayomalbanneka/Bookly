package lk.cypher.bookliy.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.CommonServices;

@Path("/common")
public class CommonController {
    @Path("/single-product")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadSingleProduct(@QueryParam("productId") int id) {
        String responseJson = new CommonServices().getSingleProduct(id);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/add-to-cart")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response addToCart(@QueryParam("sId") String sId, @QueryParam("qty") String qty, @Context HttpServletRequest request) {
        String responseJson = new CommonServices().addToCart(sId, qty, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/get-cart-items")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCartItems(@Context HttpServletRequest request) {
        String responseJson = new CommonServices().getAllUserCarts(request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/related-products")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadRelatedProducts(@QueryParam("productId") int id) {
        String responseJson = new CommonServices().getRelatedProducts(id);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/all-products")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadAllProducts() {
        String responseJson = new CommonServices().getAllProducts();
        return Response.ok().entity(responseJson).build();
    }

    @Path("/romance")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadRomance() {
        String responseJson = new CommonServices().getRomanceBooks();
        return Response.ok().entity(responseJson).build();
    }

    @Path("/mystery")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadFiction() {
        String responseJson = new CommonServices().getMysteryBooks();
        return Response.ok().entity(responseJson).build();
    }

    @Path("/science-fiction")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadScienceFiction() {
        String responseJson = new CommonServices().getScienceFictionBooks();
        return Response.ok().entity(responseJson).build();
    }

    @Path("/biography")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadBiography() {
        String responseJson = new CommonServices().getBiographyBooks();
        return Response.ok().entity(responseJson).build();
    }

    @Path("/self-help")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadSelfHelp() {
        String responseJson = new CommonServices().getSelfHelpBooks();
        return Response.ok().entity(responseJson).build();
    }

    @Path("/fiction")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadFictionBooks() {
        String responseJson = new CommonServices().getFictionBooks();
        return Response.ok().entity(responseJson).build();
    }

    @Path("/business")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadBusinessBooks() {
        String responseJson = new CommonServices().getBusinessBooks();
        return Response.ok().entity(responseJson).build();
    }

    @Path("/children")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadChildrenBooks() {
        String responseJson = new CommonServices().getChildrenBooks();
        return Response.ok().entity(responseJson).build();
    }
}