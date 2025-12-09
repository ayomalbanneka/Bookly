package lk.cypher.bookliy.services;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookliy.dto.ProductDTO;
import lk.cypher.bookliy.entity.User;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.Session;

public class ProductServices {
    public String addNewProduct(ProductDTO productDTO, @Context HttpServletRequest request) {
        JsonObject jsonObject = new JsonObject();
        boolean status = false;
        String message = "";

        if (productDTO.getTitle() == null) {
            message = "Title is required";
        } else if (productDTO.getTitle().isBlank()) {
            message = "Product title cannot be empty";
        } else if (productDTO.getAuthor() == null) {
            message = "Author is required";
        } else if (productDTO.getAuthor().isBlank()) {
            message = "Product author cannot be empty";
        } else if (productDTO.getPrice() <= 0) {
            message = "Product price must be greater than zero";
        } else if (productDTO.getQuantity() < 0) {
            message = "Product quantity cannot be negative";
        } else if (productDTO.getCategoryId() <= 0) {
            message = "Invalid category selected. Please select a valid category.";
        } else if (productDTO.getDescription() == null) {
            message = "Product description is required";
        } else if (productDTO.getDescription().isBlank()) {
            message = "Product description cannot be empty";
        } else {
            // Logic to save the product would go here
            HttpSession httpSession = request.getSession(false);
            if (httpSession == null) {
                message = "Session is required. Please login again.";
//            } else if (httpSession.getAttribute('admin') == null) {
//                message = "Session is invalid. Please login again.";
            }else{
//                User sessionUser = (User) httpSession.getAttribute("user");
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            }
        }
        return null;
    }
}
