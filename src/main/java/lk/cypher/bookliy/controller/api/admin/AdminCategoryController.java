package lk.cypher.bookliy.controller.api.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.google.gson.JsonObject;
import lk.cypher.bookliy.services.admin.AdminCategoryServices;
import lk.cypher.bookliy.util.AppUtil;

@Path("/admin/categories")
public class AdminCategoryController {

    @Path("/save")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response saveCategory(String json, @Context HttpServletRequest request) {
        JsonObject payload = AppUtil.gson.fromJson(json, JsonObject.class);
        String name = payload != null && payload.has("name") ? payload.get("name").getAsString() : null;
        String description = payload != null && payload.has("description") ? payload.get("description").getAsString() : null;
        String responseJson = new AdminCategoryServices().saveCategory(name, description, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/{categoryId}/update")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCategory(@PathParam("categoryId") int categoryId, String json, @Context HttpServletRequest request) {
        JsonObject payload = AppUtil.gson.fromJson(json, JsonObject.class);
        String name = payload != null && payload.has("name") ? payload.get("name").getAsString() : null;
        String responseJson = new AdminCategoryServices().updateCategory(categoryId, name, request);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/{categoryId}/delete")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCategory(@PathParam("categoryId") int categoryId, @Context HttpServletRequest request) {
        String responseJson = new AdminCategoryServices().deleteCategory(categoryId, request);
        return Response.ok().entity(responseJson).build();
    }
}

