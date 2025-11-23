package lk.cypher.bookliy.controller.api;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lk.cypher.bookliy.services.ContentServices;

@Path("/data")
public class ContentController {
    @Path("/{districtId}/cities")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    public Response loadCities(@PathParam("districtId") int districtId) {
        String responseJson = new ContentServices().loadAllCities(districtId);
        return Response.ok().entity(responseJson).build();
    }

    @Path("/districts")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    public Response loadDistricts() {
        String responseJson = new ContentServices().loadAllDistricts();
        return Response.ok().entity(responseJson).build();
    }
}
