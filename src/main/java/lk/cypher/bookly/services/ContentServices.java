package lk.cypher.bookly.services;

import com.google.gson.JsonObject;
import lk.cypher.bookly.dto.ProductDTO;
import lk.cypher.bookly.dto.StockDTO;
import lk.cypher.bookly.entity.City;
import lk.cypher.bookly.entity.District;
import lk.cypher.bookly.entity.Product;
import lk.cypher.bookly.entity.Stock;
import lk.cypher.bookly.util.AppUtil;
import lk.cypher.bookly.util.HibernateUtil;
import org.hibernate.Session;

import java.util.ArrayList;
import java.util.List;

public class ContentServices {
    public String loadAllDistricts() {
        JsonObject responseObject = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<District> districtList = hibernateSession
                .createQuery("FROM District d LEFT JOIN FETCH d.cities", District.class)
                .getResultList();
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

    public String loadNewArrivals() {
        JsonObject responseObject = new JsonObject();
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<Product> productList = hibernateSession.createQuery("FROM Product p ORDER BY p.createdAt DESC", Product.class)
                .setMaxResults(8)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product product : productList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setProductId(product.getId());
            productDTO.setTitle(product.getTitle());
            productDTO.setAuthor(product.getAuthor());
            productDTO.setImages(product.getImages());

            List<StockDTO> stockDTOList = new ArrayList<>();
            for (Stock stock : product.getStocks()) {
                StockDTO stockDTO = new StockDTO();
                stockDTO.setPrice(stock.getPrice());
                stockDTO.setStockId(stock.getId());
                stockDTOList.add(stockDTO);
            }
            productDTO.setStockDTOList(stockDTOList);
            productDTOList.add(productDTO);
        }
        hibernateSession.close();
        responseObject.add("newArrivals", AppUtil.gson.toJsonTree(productDTOList));
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

    private static List<JsonObject> districts(List<District> districtList) {
        List<JsonObject> districts = new ArrayList<>();
        for (District district : districtList) {
            JsonObject districtObject = new JsonObject();
            districtObject.addProperty("id", district.getId());
            districtObject.addProperty("name", district.getName());
            districts.add(districtObject);
        }
        return districts;
    }
}
