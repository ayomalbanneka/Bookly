package lk.cypher.bookliy.services.admin;

import com.google.gson.JsonObject;
import lk.cypher.bookliy.dto.OrderDTO;
import lk.cypher.bookliy.dto.ProductDTO;
import lk.cypher.bookliy.dto.StockDTO;
import lk.cypher.bookliy.dto.UserDTO;
import lk.cypher.bookliy.entity.*;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.Session;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class AdminContentServices {
    public String loadAllUsers() {
        JsonObject responseObject = new JsonObject();
        String message = "";
        boolean status = false;

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<User> userList = hibernateSession.createQuery("FROM User u", User.class).getResultList();

        List<UserDTO> userDTOList = new ArrayList<>();
        for (User user : userList) {
            UserDTO userDTO = new UserDTO();

            LocalDateTime createdAt = user.getCreatedAt();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM, yyyy");
            String sinceAt = createdAt.format(formatter);
            userDTO.setSinceAt(sinceAt);

            userDTO.setId(user.getId());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setEmail(user.getEmail());
            userDTO.setStatus(user.getStatus().getValue());
            userDTOList.add(userDTO);
        }
        responseObject.add("users", AppUtil.gson.toJsonTree(userDTOList));

        hibernateSession.close();

        status = true;
        message = "All users retrieved successfully.";

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    public String loadAllCategories() {
        JsonObject responseObject = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<Category> categoryList = hibernateSession.createQuery("from Category c", Category.class).list();
        responseObject.add("categories", AppUtil.gson.toJsonTree(AdminContentServices.categories(categoryList)));
        hibernateSession.close();

        return AppUtil.gson.toJson(responseObject);
    }

    public String loadAllBooks() {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

        try {
            // Load All Categories
            List<Category> categoryList = hibernateSession.createQuery("FROM Category c", Category.class).getResultList();

            // Load All Products
            List<Product> productList = hibernateSession.createQuery("FROM Product p", Product.class).getResultList();

            // Create category list with counts
            List<JsonObject> categories = new ArrayList<>();
            for (Category category : categoryList) {
                JsonObject categoryObj = new JsonObject();
                categoryObj.addProperty("id", category.getId());
                categoryObj.addProperty("name", category.getName());

                // Get product count for this category
                Long count = hibernateSession.createQuery(
                                "SELECT COUNT(p) FROM Product p WHERE p.category = :category", Long.class)
                        .setParameter("category", category)
                        .getSingleResult();
                categoryObj.addProperty("count", count);

                categories.add(categoryObj);
            }

            // Build Product DTO List
            List<ProductDTO> productDTOList = new ArrayList<>();
            for (Product product : productList) {
                ProductDTO productDTO = new ProductDTO();
                productDTO.setProductId(product.getId());
                productDTO.setTitle(product.getTitle());
                productDTO.setAuthor(product.getAuthor());
                productDTO.setCategoryName(product.getCategory().getName());
                productDTO.setImages(product.getImages());

                List<StockDTO> stockDTOList = new ArrayList<>();
                for (Stock stock : product.getStocks()) {
                    StockDTO stockDTO = new StockDTO();
                    stockDTO.setStockId(stock.getId());
                    stockDTO.setPrice(stock.getPrice());
                    stockDTO.setStock(stock.getQty());
                    stockDTOList.add(stockDTO);
                }
                productDTO.setStockDTOList(stockDTOList);
                productDTOList.add(productDTO);
            }

            // Add all data to response
            responseObj.add("categoryList", AppUtil.gson.toJsonTree(categories));
            responseObj.add("allProducts", AppUtil.gson.toJsonTree(productDTOList));
            responseObj.addProperty("maxResult", AppUtil.MAX_RESULT_VALUE);

            status = true;
            message = "All products retrieved successfully.";

        } catch (Exception e) {
            status = false;
            message = "Error loading books: " + e.getMessage();
            e.printStackTrace();
        } finally {
            // Close session after all operations are complete
            if (hibernateSession != null && hibernateSession.isOpen()) {
                hibernateSession.close();
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    public String loadAllOrders() {
        JsonObject responseObj = new JsonObject();
        String message = "";
        boolean status = false;

        Session hibernateSession = null;

        try {
            hibernateSession = HibernateUtil.getSessionFactory().openSession();

            List<Order> orderList = hibernateSession.createQuery("FROM Order o", Order.class).getResultList();

            List<OrderDTO> orderDTOList = new ArrayList<>();
            for (Order order : orderList) {
                OrderDTO orderDTO = new OrderDTO();
                orderDTO.setOrderId(order.getId());

                String firstName = order.getUser().getFirstName();
                String lastName = order.getUser().getLastName();
                orderDTO.setCustomerName((firstName + " " + lastName).trim());
                orderDTO.setOrderDate(order.getCreatedAt().toString());
                orderDTO.setStatus(order.getStatus().getValue());
                orderDTO.setEmail(order.getUser().getEmail());

                // Calculate total amount from order items
                double itemsTotal = 0.0;
                if (order.getOrderItems() != null) {
                    for (OrderItem item : order.getOrderItems()) {
                        if (item.getStock() != null) {
                            double itemPrice = item.getStock().getPrice();
                            int quantity = item.getQty();
                            itemsTotal += itemPrice * quantity;
                        }
                    }
                }

                // Get delivery cost
                double deliveryCost = 0.0;
                if (order.getDeliveryType() != null) {
                    deliveryCost = order.getDeliveryType().getPrice();
                }

                // Set individual amounts
                orderDTO.setItemsTotal(itemsTotal);
                orderDTO.setDeliveryCost(deliveryCost);

                // Calculate and set total amount (items + delivery)
                double totalAmount = itemsTotal + deliveryCost;
                orderDTO.setTotalAmount(totalAmount);

                orderDTOList.add(orderDTO);
            }

            responseObj.add("allOrders", AppUtil.gson.toJsonTree(orderDTOList));
            status = true;
            message = "All orders retrieved successfully.";

        } catch (Exception e) {
            status = false;
            message = "Error loading orders: " + e.getMessage();
            e.printStackTrace();
        } finally {
            if (hibernateSession != null && hibernateSession.isOpen()) {
                hibernateSession.close();
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);

        return AppUtil.gson.toJson(responseObj);
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
