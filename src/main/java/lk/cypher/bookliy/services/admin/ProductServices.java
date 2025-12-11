package lk.cypher.bookliy.services.admin;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookliy.dto.ProductDTO;
import lk.cypher.bookliy.entity.*;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ProductServices {

    public Product getProductById(int productId) {
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Product product = hibernateSession.find(Product.class, productId);
        hibernateSession.close();
        return product;
    }

    public String updateProduct(Product product) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = hibernateSession.beginTransaction();
        try {
            hibernateSession.merge(product);
            transaction.commit();
            status = true;
            message = "Product updated successfully.";
        } catch (HibernateException e) {
            transaction.rollback();
            e.printStackTrace();
            message = "Failed to update product. Please try again.";
        } finally {
            hibernateSession.close();
        }
        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    public String addNewProduct(ProductDTO productDTO, @Context HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
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
        } else if (productDTO.getIsbn() == null) {
            message = "ISBN is required";
        } else if (productDTO.getIsbn().isBlank()) {
            message = "Product ISBN cannot be empty";
        } else if (productDTO.getLanguage() == null) {
            message = "Language is required";
        } else if (productDTO.getLanguage().isBlank()) {
            message = "Product language cannot be empty";
        } else if (productDTO.getPublishedDate() == null) {
            message = "Published Date is required";
        } else if (productDTO.getPublishedDate().isBlank()) {
            message = "Published Date cannot be empty";
        } else if (productDTO.getPublisher() == null) {
            message = "Publisher is required";
        } else if (productDTO.getPublisher().isBlank()) {
            message = "Product publisher cannot be empty";
        } else if (productDTO.getStock() < 0) {
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
            } else if (httpSession.getAttribute("admin") == null) {
                message = "Session is invalid. Please login again.";
            } else {
                Admin sessionUser = (Admin) httpSession.getAttribute("admin");
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
                Admin admin = hibernateSession.createQuery("FROM Admin a WHERE a.id=:id", Admin.class)
                        .setParameter("id", sessionUser.getId())
                        .getSingleResultOrNull();

                if (admin == null) {
                    message = "Admin not found. Please login again.";
                } else {
                    if (!admin.getStatus().getValue().equals(String.valueOf(Status.Type.APPROVED))) {
                        message = "Your admin account is not approved. Please contact support.";
                    } else {
                        Category category = hibernateSession.find(Category.class, productDTO.getCategoryId());
                        if (category == null) {
                            message = "Category not found. Please contact support.";
                        } else {
                            Product product = new Product();

                            LocalDateTime parsedDate = LocalDateTime.parse(
                                    productDTO.getPublishedDate() + "T00:00:00"
                            );

                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
                            String formattedDate = parsedDate.format(formatter);

                            product.setTitle(productDTO.getTitle());
                            product.setAuthor(productDTO.getAuthor());
                            product.setDescription(productDTO.getDescription());
                            product.setCategory(category);
                            product.setDescription(productDTO.getDescription());
                            product.setIsbn(productDTO.getIsbn());
                            product.setLanguage(productDTO.getLanguage());
                            product.setPublishedDate(formattedDate);
                            product.setPublisher(productDTO.getPublisher());
                            product.setGenre(productDTO.getGenre());
                            product.setPages(productDTO.getPages());
                            product.setAdmin(admin);

                            Stock stock = new Stock();
                            stock.setProduct(product);
                            stock.setQty(productDTO.getStock());
                            stock.setPrice(productDTO.getPrice());

                            Discount defaultDiscount = hibernateSession.createNamedQuery("Discount.findDefault", Discount.class)
                                    .getSingleResult();

                            stock.setDiscount(defaultDiscount);
                            Status activeStatus = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                                    .setParameter("value", Status.Type.ACTIVE.toString())
                                    .getSingleResult();
                            stock.setDiscount(defaultDiscount);
                            stock.setStatus(activeStatus);

                            Transaction transaction = hibernateSession.beginTransaction(); // Start transaction
                            try {
                                hibernateSession.persist(product);
                                hibernateSession.persist(stock);
                                transaction.commit();
                                status = true;
                                message = "Product added successfully.";
                                responseObj.addProperty("productId", product.getId());
                            } catch (HibernateException e) {
                                transaction.rollback();
                                e.printStackTrace();
                            } finally {
                                hibernateSession.close();
                            }
                        }
                    }
                }
            }
        }
        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }
}
