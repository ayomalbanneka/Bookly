package lk.cypher.bookliy.services;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lk.cypher.bookliy.dto.WishlistDTO;
import lk.cypher.bookliy.entity.Stock;
import lk.cypher.bookliy.entity.User;
import lk.cypher.bookliy.entity.Wishlist;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class WishlistServices {

    // Add item to wishlist
    public String addToWishlist(String stockId, HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        HttpSession httpSession = request.getSession();
        User sessionUser = (User) httpSession.getAttribute("user");

        if (sessionUser == null) {
            message = "Please login to add items to your wishlist.";
        } else if (stockId == null || stockId.isBlank()) {
            message = "Invalid product selected.";
        } else {
            int sId = Integer.parseInt(stockId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));

            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            Transaction transaction = hibernateSession.beginTransaction();

            try {
                // Check if stock exists
                Stock stock = hibernateSession.find(Stock.class, sId);
                if (stock == null) {
                    message = "Product not found.";
                } else {
                    // Check if item already exists in wishlist
                    Wishlist existingWishlist = hibernateSession.createNamedQuery("Wishlist.findByUserAndStock", Wishlist.class)
                            .setParameter("userId", sessionUser.getId())
                            .setParameter("stockId", sId)
                            .getSingleResultOrNull();

                    if (existingWishlist != null) {
                        message = "This item is already in your wishlist.";
                    } else {
                        // Get user from database
                        User user = hibernateSession.find(User.class, sessionUser.getId());

                        Wishlist wishlist = new Wishlist();
                        wishlist.setUser(user);
                        wishlist.setStock(stock);

                        hibernateSession.persist(wishlist);
                        transaction.commit();

                        status = true;
                        message = "Item added to wishlist successfully!";
                    }
                }
            } catch (Exception e) {
                if (transaction != null) {
                    transaction.rollback();
                }
                message = "Error adding item to wishlist: " + e.getMessage();
                e.printStackTrace();
            } finally {
                hibernateSession.close();
            }
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    // Remove item from wishlist
    public String removeFromWishlist(String wishlistId, HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        HttpSession httpSession = request.getSession();
        User sessionUser = (User) httpSession.getAttribute("user");

        if (sessionUser == null) {
            message = "Please login to manage your wishlist.";
        } else if (wishlistId == null || wishlistId.isBlank()) {
            message = "Invalid wishlist item selected.";
        } else {
            int wId = Integer.parseInt(wishlistId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));

            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            Transaction transaction = hibernateSession.beginTransaction();

            try {
                Wishlist wishlist = hibernateSession.find(Wishlist.class, wId);
                if (wishlist == null) {
                    message = "Wishlist item not found.";
                } else if (wishlist.getUser().getId() != sessionUser.getId()) {
                    message = "You don't have permission to remove this item.";
                } else {
                    hibernateSession.remove(wishlist);
                    transaction.commit();

                    status = true;
                    message = "Item removed from wishlist successfully!";
                }
            } catch (Exception e) {
                if (transaction != null) {
                    transaction.rollback();
                }
                message = "Error removing item from wishlist: " + e.getMessage();
                e.printStackTrace();
            } finally {
                hibernateSession.close();
            }
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    // Get all wishlist items for user
    public String getWishlistItems(HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        HttpSession httpSession = request.getSession();
        User sessionUser = (User) httpSession.getAttribute("user");

        if (sessionUser == null) {
            message = "Please login to view your wishlist.";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

            try {
                List<Wishlist> wishlistItems = hibernateSession.createNamedQuery("Wishlist.findByUser", Wishlist.class)
                        .setParameter("userId", sessionUser.getId())
                        .getResultList();

                List<WishlistDTO> wishlistDTOList = new ArrayList<>();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM, yyyy");

                for (Wishlist wishlist : wishlistItems) {
                    WishlistDTO dto = new WishlistDTO();
                    dto.setWishlistId(wishlist.getId());
                    dto.setStockId(wishlist.getStock().getId());
                    dto.setProductId(wishlist.getStock().getProduct().getId());
                    dto.setTitle(wishlist.getStock().getProduct().getTitle());
                    dto.setAuthor(wishlist.getStock().getProduct().getAuthor());
                    dto.setCategory(wishlist.getStock().getProduct().getCategory().getName());
                    dto.setPrice(wishlist.getStock().getPrice());
                    dto.setStock(wishlist.getStock().getQty());

                    if (!wishlist.getStock().getProduct().getImages().isEmpty()) {
                        dto.setImage(wishlist.getStock().getProduct().getImages().get(0));
                    }

                    dto.setAddedDate(wishlist.getCreatedAt().format(formatter));
                    wishlistDTOList.add(dto);
                }

                responseObject.add("wishlistItems", AppUtil.gson.toJsonTree(wishlistDTOList));
                responseObject.addProperty("itemCount", wishlistDTOList.size());
                status = true;
                message = "Wishlist loaded successfully.";

            } catch (Exception e) {
                message = "Error loading wishlist: " + e.getMessage();
                e.printStackTrace();
            } finally {
                hibernateSession.close();
            }
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    // Check if item is in wishlist
    public String isInWishlist(String stockId, HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        boolean inWishlist = false;

        HttpSession httpSession = request.getSession();
        User sessionUser = (User) httpSession.getAttribute("user");

        if (sessionUser != null && stockId != null && !stockId.isBlank()) {
            int sId = Integer.parseInt(stockId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));

            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

            try {
                Wishlist wishlist = hibernateSession.createNamedQuery("Wishlist.findByUserAndStock", Wishlist.class)
                        .setParameter("userId", sessionUser.getId())
                        .setParameter("stockId", sId)
                        .getSingleResultOrNull();

                inWishlist = wishlist != null;
                status = true;
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                hibernateSession.close();
            }
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("inWishlist", inWishlist);
        return AppUtil.gson.toJson(responseObject);
    }

    // Move item from wishlist to cart
    public String moveToCart(String wishlistId, HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        HttpSession httpSession = request.getSession();
        User sessionUser = (User) httpSession.getAttribute("user");

        if (sessionUser == null) {
            message = "Please login to manage your wishlist.";
        } else if (wishlistId == null || wishlistId.isBlank()) {
            message = "Invalid wishlist item selected.";
        } else {
            int wId = Integer.parseInt(wishlistId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));

            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            Transaction transaction = hibernateSession.beginTransaction();

            try {
                Wishlist wishlist = hibernateSession.find(Wishlist.class, wId);
                if (wishlist == null) {
                    message = "Wishlist item not found.";
                } else if (wishlist.getUser().getId() != sessionUser.getId()) {
                    message = "You don't have permission to move this item.";
                } else {
                    // Add to cart using CommonServices logic
                    CommonServices commonServices = new CommonServices();
                    String cartResult = commonServices.addToCart(
                            String.valueOf(wishlist.getStock().getId()),
                            "1",
                            request
                    );

                    // If successfully added to cart, remove from wishlist
                    JsonObject cartResponse = AppUtil.gson.fromJson(cartResult, JsonObject.class);
                    if (cartResponse.get("status").getAsBoolean()) {
                        hibernateSession.remove(wishlist);
                        transaction.commit();
                        status = true;
                        message = "Item moved to cart successfully!";
                    } else {
                        message = cartResponse.get("message").getAsString();
                    }
                }
            } catch (Exception e) {
                if (transaction != null) {
                    transaction.rollback();
                }
                message = "Error moving item to cart: " + e.getMessage();
                e.printStackTrace();
            } finally {
                hibernateSession.close();
            }
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    // Get wishlist count for user
    public String getWishlistCount(HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        int count = 0;

        HttpSession httpSession = request.getSession();
        User sessionUser = (User) httpSession.getAttribute("user");

        if (sessionUser != null) {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

            try {
                Long wishlistCount = hibernateSession.createQuery(
                                "SELECT COUNT(w) FROM Wishlist w WHERE w.user.id = :userId", Long.class)
                        .setParameter("userId", sessionUser.getId())
                        .getSingleResult();

                count = wishlistCount.intValue();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                hibernateSession.close();
            }
        }

        responseObject.addProperty("count", count);
        return AppUtil.gson.toJson(responseObject);
    }
}

