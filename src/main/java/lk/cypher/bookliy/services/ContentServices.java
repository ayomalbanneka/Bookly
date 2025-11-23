package lk.cypher.bookliy.services;

import com.google.gson.JsonObject;
import lk.cypher.bookliy.entity.City;
import lk.cypher.bookliy.entity.District;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.Session;

import java.util.ArrayList;
import java.util.List;

public class ContentServices {
    public String loadAllDistricts() {
        JsonObject responseObject = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<District> districtList = hibernateSession.createQuery("FROM District d", District.class).getResultList();
        responseObject.add("districts", AppUtil.gson.toJsonTree(ContentServices.districts(districtList)));
        hibernateSession.close();

        return AppUtil.gson.toJson(responseObject);
    }

    public String loadAllCities(int districtId) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        if (districtId <= 0) {
            message = "please select a district";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            District district = hibernateSession.find(District.class, districtId); // Check if the district exists
            if (district == null) {
                message = "district not found";
            } else {

                List<City> cityList = hibernateSession.createQuery("FROM City c WHERE c.district.id = :districtId", City.class)
                        .setParameter("districtId", districtId)
                        .getResultList();
                if (cityList.isEmpty()) {
                    message = "no cities found";
                } else {
                    responseObject.add("cities", AppUtil.gson.toJsonTree(ContentServices.cities(cityList)));
                    status = true;
                    message = "cities loaded successfully";
                }
            }
            hibernateSession.close();
        }
        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    private static List<JsonObject> cities(List<City> cityList) {
        List<JsonObject> cities = new ArrayList<>();
        for (City city : cityList) {
            JsonObject cityObject = new JsonObject();
            cityObject.addProperty("id", city.getId());
            cityObject.addProperty("name", city.getName());
            cities.add(cityObject);

        }
        return cities;
    }

    private static List<District> districts(List<District> districtList) {
        List<District> districts = new ArrayList<>();
        for (District district : districtList) {
            JsonObject object = new JsonObject();
            object.addProperty("id", district.getId());
            object.addProperty("name", district.getName());
            districts.add(district);
        }
        return districts;
    }
}
