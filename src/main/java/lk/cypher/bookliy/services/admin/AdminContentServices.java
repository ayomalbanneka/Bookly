package lk.cypher.bookliy.services.admin;

import com.google.gson.JsonObject;
import lk.cypher.bookliy.entity.Category;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.Session;

import java.util.List;

public class AdminContentServices {
    public String loadAllCategories() {
        JsonObject responseObject = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<Category> categoryList = hibernateSession.createQuery("from Category c", Category.class).list();
        responseObject.add("categories", AppUtil.gson.toJsonTree(AdminContentServices.categories(categoryList)));
        hibernateSession.close();

        return AppUtil.gson.toJson(responseObject);
    }

    private static List<JsonObject> categories(List<Category> categoryList) {
        List<JsonObject> categories = new java.util.ArrayList<>();
        for (Category category : categoryList) {
            JsonObject categoryObject = new JsonObject();
            categoryObject.addProperty("id", category.getId());
            categoryObject.addProperty("name", category.getName());
            categories.add(categoryObject);
        }
        return categories;
    }
}
